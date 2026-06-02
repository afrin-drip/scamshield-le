package com.scamshield.le.audio

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.launch
import javax.inject.Inject
import javax.inject.Singleton

data class SpeechResult(
    val text: String,
    val confidence: Float,
    val isFinal: Boolean,
    val source: String = "android_stt"
)

@Singleton
class SpeechRecognitionManager @Inject constructor(
    private val context: Context
) {
    private val _results = MutableSharedFlow<SpeechResult>(extraBufferCapacity = 50)
    val results: SharedFlow<SpeechResult> get() = _results

    private var recognizer: SpeechRecognizer? = null
    private var isListening = false
    private var scope: CoroutineScope? = null

    fun startListening(coroutineScope: CoroutineScope) {
        if (!SpeechRecognizer.isRecognitionAvailable(context)) {
            coroutineScope.launch {
                _results.emit(SpeechResult("", 0f, false, "stt_unavailable"))
            }
            return
        }
        scope = coroutineScope
        isListening = true
        startSession()
    }

    private fun startSession() {
        recognizer?.destroy()
        recognizer = SpeechRecognizer.createSpeechRecognizer(context).apply {
            setRecognitionListener(object : RecognitionListener {
                override fun onReadyForSpeech(params: Bundle?) {}
                override fun onBeginningOfSpeech() {}
                override fun onRmsChanged(rmsdB: Float) {}
                override fun onBufferReceived(buffer: ByteArray?) {}
                override fun onEndOfSpeech() {}

                override fun onPartialResults(partialResults: Bundle?) {
                    val text = partialResults
                        ?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        ?.firstOrNull() ?: return
                    scope?.launch {
                        _results.emit(SpeechResult(text, 0.5f, false, "android_stt"))
                    }
                }

                override fun onResults(results: Bundle?) {
                    val texts = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                    val scores = results?.getFloatArray(SpeechRecognizer.CONFIDENCE_SCORES)
                    val text = texts?.firstOrNull() ?: return
                    val confidence = scores?.firstOrNull() ?: 0.8f
                    scope?.launch {
                        _results.emit(SpeechResult(text, confidence, true, "android_stt"))
                    }
                    if (isListening) {
                        scope?.launch {
                            delay(150)
                            startSession()
                        }
                    }
                }

                override fun onError(error: Int) {
                    val shouldRestart = error == SpeechRecognizer.ERROR_NO_MATCH ||
                            error == SpeechRecognizer.ERROR_SPEECH_TIMEOUT ||
                            error == SpeechRecognizer.ERROR_RECOGNIZER_BUSY
                    scope?.launch {
                        _results.emit(SpeechResult("", 0f, false, "stt_error:$error"))
                        if (isListening && shouldRestart) {
                            delay(500)
                            startSession()
                        }
                    }
                }

                override fun onEvent(eventType: Int, params: Bundle?) {}
            })
        }

        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
            putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS, 1000L)
            putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 1500L)
        }
        recognizer?.startListening(intent)
    }

    fun stopListening() {
        isListening = false
        recognizer?.stopListening()
        recognizer?.destroy()
        recognizer = null
    }
}

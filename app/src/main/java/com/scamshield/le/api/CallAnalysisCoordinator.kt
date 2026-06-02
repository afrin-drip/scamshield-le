package com.scamshield.le.api

import com.scamshield.le.audio.AudioCaptureManager
import com.scamshield.le.audio.SpeechRecognitionManager
import com.scamshield.le.rules.RiskAssessment
import com.scamshield.le.rules.RiskEngine
import com.scamshield.le.rules.ScamSignal
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.flow.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CallAnalysisCoordinator @Inject constructor(
    private val claudeApiService: ClaudeApiService,
    private val claudeAudioAnalyzer: ClaudeAudioAnalyzer,
    private val speechRecognitionManager: SpeechRecognitionManager,
    private val audioCaptureManager: AudioCaptureManager
) {
    private val _riskAssessment = MutableStateFlow(RiskAssessment(0, emptyList(), RiskAssessment.RiskLevel.LOW))
    val riskAssessment: StateFlow<RiskAssessment> get() = _riskAssessment
    private val _transcript = MutableStateFlow("")
    val transcript: StateFlow<String> get() = _transcript
    private val _analysisSource = MutableStateFlow("waiting")
    val analysisSource: StateFlow<String> get() = _analysisSource
    private val buffer = StringBuilder()
    private var wordCount = 0

    fun startAnalysis(scope: CoroutineScope) {
        speechRecognitionManager.startListening(scope)
        scope.launch {
            speechRecognitionManager.results.collect { result ->
                when {
                    result.text.isNotBlank() -> {
                        if (result.isFinal) {
                            appendTranscript(result.text)
                            wordCount += result.text.split(" ").size
                            _analysisSource.value = "android_stt (${(result.confidence * 100).toInt()}% conf)"
                        }
                        if (claudeAudioAnalyzer.shouldEnhanceWithClaude(result, wordCount)) {
                            scope.launch { enhanceWithClaude() }
                        }
                    }
                    result.source.startsWith("stt_error") || result.source == "stt_unavailable" -> {
                        _analysisSource.value = "claude_backup"
                        if (_transcript.value.isNotBlank()) scope.launch { enhanceWithClaude() }
                    }
                }
            }
        }
    }

    private suspend fun enhanceWithClaude() {
        if (_transcript.value.isBlank()) return
        val enhanced = claudeAudioAnalyzer.analyzeTranscriptSemantically(_transcript.value)
        if (enhanced.enhancedRiskScore > 0 || enhanced.confidenceScore > 0.5f) {
            val mergedScore = maxOf(_riskAssessment.value.totalScore, enhanced.enhancedRiskScore)
            val currentSignals = _riskAssessment.value.signals.toMutableList()
            if (enhanced.manipulationTactics && currentSignals.none { it is ScamSignal.UrgencyPressure })
                currentSignals.add(ScamSignal.UrgencyPressure)
            val level = when { mergedScore >= 90 -> RiskAssessment.RiskLevel.CRITICAL; mergedScore >= 70 -> RiskAssessment.RiskLevel.LIKELY_SCAM; mergedScore >= 40 -> RiskAssessment.RiskLevel.SUSPICIOUS; else -> RiskAssessment.RiskLevel.LOW }
            _riskAssessment.value = RiskAssessment(mergedScore, currentSignals, level)
            _analysisSource.value = "claude_enhanced (${(enhanced.confidenceScore * 100).toInt()}% conf)"
        }
    }

    fun appendTranscript(text: String) {
        buffer.append(" ").append(text)
        _transcript.value = buffer.toString().trim()
        _riskAssessment.value = RiskEngine.analyze(_transcript.value)
    }

    fun reset() {
        speechRecognitionManager.stopListening()
        buffer.clear()
        wordCount = 0
        _transcript.value = ""
        _analysisSource.value = "waiting"
        _riskAssessment.value = RiskAssessment(0, emptyList(), RiskAssessment.RiskLevel.LOW)
    }
}

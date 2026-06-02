package com.scamshield.le.api

import com.google.gson.Gson
import com.scamshield.le.BuildConfig
import com.scamshield.le.audio.SpeechResult
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ClaudeAudioAnalyzer @Inject constructor(
    private val client: OkHttpClient
) {
    private val gson = Gson()

    private val transcriptAnalysisPrompt = """
        You are an expert at detecting law enforcement impersonation phone scams.
        Analyze this phone call transcript carefully for scam indicators that keyword 
        matching might miss — indirect threats, implied urgency, unusual payment requests,
        or psychological manipulation tactics.
        
        Respond ONLY with valid JSON:
        {
          "lawEnforcementClaim": boolean,
          "arrestWarrantLanguage": boolean,
          "moneyRequest": boolean,
          "suspiciousPaymentMethod": boolean,
          "urgencyPressure": boolean,
          "manipulationTactics": boolean,
          "confidenceScore": 0.0-1.0,
          "summary": "one sentence",
          "enhancedRiskScore": 0-100
        }
    """.trimIndent()

    suspend fun analyzeTranscriptSemantically(transcript: String): ClaudeEnhancedResult {
        return withContext(Dispatchers.IO) {
            try {
                val body = gson.toJson(mapOf(
                    "model" to "claude-3-5-haiku-20241022",
                    "max_tokens" to 300,
                    "system" to transcriptAnalysisPrompt,
                    "messages" to listOf(mapOf("role" to "user", "content" to "Transcript: $transcript"))
                ))
                val request = Request.Builder()
                    .url("https://api.anthropic.com/v1/messages")
                    .post(body.toRequestBody("application/json".toMediaType()))
                    .header("x-api-key", BuildConfig.CLAUDE_API_KEY)
                    .header("anthropic-version", "2023-06-01")
                    .build()
                val response = client.newCall(request).execute()
                val responseBody = response.body?.string() ?: return@withContext ClaudeEnhancedResult()
                val json = gson.fromJson(responseBody, Map::class.java)
                val text = ((json["content"] as? List<*>)?.firstOrNull() as? Map<*, *>)?.get("text") as? String ?: return@withContext ClaudeEnhancedResult()
                gson.fromJson(text.trim(), ClaudeEnhancedResult::class.java)
            } catch (e: Exception) {
                ClaudeEnhancedResult()
            }
        }
    }

    fun shouldEnhanceWithClaude(result: SpeechResult, transcriptLength: Int): Boolean {
        return when {
            result.source.startsWith("stt_error") -> true
            result.source == "stt_unavailable" -> true
            result.confidence < 0.6f && result.isFinal -> true
            transcriptLength > 0 && transcriptLength % 100 == 0 -> true
            else -> false
        }
    }
}

data class ClaudeEnhancedResult(
    val lawEnforcementClaim: Boolean = false,
    val arrestWarrantLanguage: Boolean = false,
    val moneyRequest: Boolean = false,
    val suspiciousPaymentMethod: Boolean = false,
    val urgencyPressure: Boolean = false,
    val manipulationTactics: Boolean = false,
    val confidenceScore: Float = 0f,
    val summary: String = "",
    val enhancedRiskScore: Int = 0
)

package com.scamshield.le.service

import android.telecom.Call
import android.telecom.CallScreeningService
import android.util.Log
import com.scamshield.le.intelligence.ScamIntelligenceManager
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.*
import javax.inject.Inject

@AndroidEntryPoint
class CallScreeningServiceImpl : CallScreeningService() {

    @Inject lateinit var scamIntelligenceManager: ScamIntelligenceManager

    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    companion object {
        private const val TAG = "CallScreeningService"
        private const val BLOCK_THRESHOLD = 0.8f
        private const val SILENCE_THRESHOLD = 0.5f
    }

    override fun onScreenCall(callDetails: Call.Details) {
        val phoneNumber = callDetails.handle?.schemeSpecificPart ?: run {
            Log.w(TAG, "No phone number available for screening; allowing call")
            respondToCall(callDetails, CallResponse.Builder().build())
            return
        }

        Log.d(TAG, "Screening call from $phoneNumber")

        serviceScope.launch {
            try {
                val result = scamIntelligenceManager.checkNumber(phoneNumber)
                val response = buildScreeningResponse(phoneNumber, result.confidence, result.scamType, result.isKnownScam)
                respondToCall(callDetails, response)
            } catch (e: Exception) {
                Log.e(TAG, "Screening check failed for $phoneNumber: ${e.message}")
                // Fail open — allow the call rather than block on error
                respondToCall(callDetails, CallResponse.Builder().build())
            }
        }
    }

    private fun buildScreeningResponse(
        phoneNumber: String,
        confidence: Float,
        scamType: String?,
        isKnownScam: Boolean
    ): CallResponse {
        return when {
            isKnownScam && confidence >= BLOCK_THRESHOLD -> {
                Log.i(TAG, "BLOCKED $phoneNumber — confidence=$confidence type=$scamType")
                CallResponse.Builder()
                    .setRejectCall(true)
                    .setDisallowCall(true)
                    .setSkipCallLog(false)
                    .setSkipNotification(false)
                    .build()
            }
            confidence >= SILENCE_THRESHOLD -> {
                Log.i(TAG, "SILENCED $phoneNumber — confidence=$confidence type=$scamType")
                CallResponse.Builder()
                    .setSilenceCall(true)
                    .build()
            }
            else -> {
                Log.d(TAG, "ALLOWED $phoneNumber — confidence=$confidence")
                CallResponse.Builder().build()
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
    }
}

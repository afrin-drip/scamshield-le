package com.scamshield.le.service

import android.telecom.Call
import android.telecom.CallScreeningService
import android.util.Log
import com.scamshield.le.data.repository.ScamRepository
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * CallScreeningService implementation (API 29+).
 * Intercepts incoming calls and rejects high-risk numbers found in the scam database.
 */
@AndroidEntryPoint
class CallScreeningServiceImpl : CallScreeningService() {

    @Inject
    lateinit var scamRepository: ScamRepository

    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    override fun onScreenCall(callDetails: Call.Details) {
        val handle = callDetails.handle
        val phoneNumber = handle?.schemeSpecificPart ?: run {
            Log.w(TAG, "onScreenCall: no phone number available, allowing call")
            respondToCall(callDetails, CallResponse.Builder().build())
            return
        }

        serviceScope.launch {
            val scamEntry = scamRepository.findByPhoneNumber(phoneNumber)
            val riskScore = scamEntry?.riskScore ?: 0

            if (riskScore >= HIGH_RISK_THRESHOLD) {
                Log.i(TAG, "Intercepted high-risk call from $phoneNumber (score=$riskScore) — rejecting")
                val response = CallResponse.Builder()
                    .setRejectCall(true)
                    .setDisallowCall(true)
                    .setSilenceCall(true)
                    .setSkipCallLog(false)
                    .setSkipNotification(false)
                    .build()
                respondToCall(callDetails, response)
            } else {
                Log.d(TAG, "Call from $phoneNumber allowed (score=$riskScore)")
                respondToCall(callDetails, CallResponse.Builder().build())
            }
        }
    }

    companion object {
        private const val TAG = "CallScreeningServiceImpl"
        private const val HIGH_RISK_THRESHOLD = 70
    }
}

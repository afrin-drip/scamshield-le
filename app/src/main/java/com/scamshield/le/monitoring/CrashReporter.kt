package com.scamshield.le.monitoring

import com.google.firebase.crashlytics.FirebaseCrashlytics
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CrashReporter @Inject constructor() {

    private val crashlytics: FirebaseCrashlytics
        get() = FirebaseCrashlytics.getInstance()

    fun logScamDetected(score: Int, signals: List<String>) {
        crashlytics.log("SCAM_DETECTED: score=${score} signals=${signals.joinToString(",")}")
        crashlytics.setCustomKey("last_scam_score", score)
        crashlytics.setCustomKey("last_scam_signal_count", signals.size)
        crashlytics.recordException(RuntimeException("ScamDetected: score=${score}"))
    }

    fun logPermissionDenied(permission: String) {
        crashlytics.log("PERMISSION_DENIED: ${permission}")
        crashlytics.setCustomKey("last_denied_permission", permission)
        crashlytics.recordException(SecurityException("PermissionDenied: ${permission}"))
    }

    fun setUserTier(tier: String) {
        crashlytics.setCustomKey("user_tier", tier)
    }

    fun logApiError(endpoint: String, code: Int) {
        crashlytics.log("API_ERROR: endpoint=${endpoint} code=${code}")
        crashlytics.setCustomKey("last_api_endpoint", endpoint)
        crashlytics.setCustomKey("last_api_error_code", code)
        crashlytics.recordException(Exception("ApiError: ${endpoint} returned ${code}"))
    }

    fun recordException(e: Throwable, context: String) {
        crashlytics.log("EXCEPTION [${context}]: ${e.message}")
        crashlytics.setCustomKey("exception_context", context)
        crashlytics.recordException(e)
    }
}
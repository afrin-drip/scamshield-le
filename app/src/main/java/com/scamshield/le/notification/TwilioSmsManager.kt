package com.scamshield.le.notification

import android.util.Log
import com.scamshield.le.BuildConfig
import com.scamshield.le.analytics.CrashReporter
import okhttp3.Credentials
import okhttp3.FormBody
import okhttp3.OkHttpClient
import okhttp3.Request
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TwilioSmsManager @Inject constructor(
    private val okHttpClient: OkHttpClient,
    private val crashReporter: CrashReporter
) {
    companion object {
        private const val TAG = "TwilioSmsManager"
        private const val BASE_URL = "https://api.twilio.com/2010-04-01/Accounts"
    }

    fun sendScamAlert(
        guardianPhone: String,
        familyMemberName: String,
        riskScore: Int,
        signals: List<String>
    ): Boolean {
        return try {
            val accountSid = BuildConfig.TWILIO_ACCOUNT_SID
            val authToken = BuildConfig.TWILIO_AUTH_TOKEN
            val fromNumber = BuildConfig.TWILIO_FROM_NUMBER

            if (accountSid.isBlank() || authToken.isBlank() || fromNumber.isBlank()) {
                Log.w(TAG, "Twilio credentials not configured")
                crashReporter.log("TwilioSmsManager: credentials not configured")
                return false
            }

            val body = FormBody.Builder()
                .add("To", guardianPhone)
                .add("From", fromNumber)
                .add("Body", "\uD83D\uDEA8 ScamShield Alert: A possible law enforcement impersonation scam was " +
                    "detected on ${familyMemberName}'s call (risk score: ${riskScore}/100). " +
                    "Do NOT let them send money. Call them now.")
                .build()

            val request = Request.Builder()
                .url("${BASE_URL}/${accountSid}/Messages.json")
                .addHeader("Authorization", Credentials.basic(accountSid, authToken))
                .post(body)
                .build()

            val response = okHttpClient.newCall(request).execute()
            val success = response.isSuccessful
            val code = response.code
            val errorBody = if (!success) response.body?.string() ?: "unknown" else ""
            response.close()

            if (success) {
                Log.i(TAG, "SMS alert sent to $guardianPhone for $familyMemberName (risk: $riskScore)")
                crashReporter.log("TwilioSmsManager: SMS sent to $guardianPhone")
            } else {
                Log.e(TAG, "SMS failed: $code - $errorBody")
                crashReporter.logError("TwilioSmsManager: SMS failed ($code): $errorBody")
            }
            success
        } catch (e: Exception) {
            Log.e(TAG, "Exception sending SMS alert", e)
            crashReporter.logException(e, "TwilioSmsManager.sendScamAlert")
            false
        }
    }
}

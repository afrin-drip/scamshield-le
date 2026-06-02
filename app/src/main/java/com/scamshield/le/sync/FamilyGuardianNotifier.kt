package com.scamshield.le.sync

import com.scamshield.le.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class FamilyGuardianNotifier @Inject constructor() {

    suspend fun notifyGuardian(
        guardianFcmToken: String,
        memberName: String,
        riskScore: Float
    ) = withContext(Dispatchers.IO) {
        try {
            val scorePercent = "%.0f".format(riskScore * 100)
            val message = JSONObject().apply {
                put("message", JSONObject().apply {
                    put("token", guardianFcmToken)
                    put("notification", JSONObject().apply {
                        put("title", "Scam Alert")
                        put("body", "A scam was detected on ${memberName}'s call. Risk score: ${scorePercent}%")
                    })
                })
            }
            val url = URL("https://fcm.googleapis.com/v1/projects/${BuildConfig.FIREBASE_PROJECT_ID}/messages:send")
            val conn = url.openConnection() as HttpURLConnection
            conn.apply {
                requestMethod = "POST"
                setRequestProperty("Authorization", "Bearer ${BuildConfig.FIREBASE_SERVER_KEY}")
                setRequestProperty("Content-Type", "application/json")
                doOutput = true
                outputStream.use { it.write(message.toString().toByteArray()) }
            }
            // Non-critical: ignore non-200 silently
        } catch (e: Exception) { /* Network error — best-effort */ }
    }
}
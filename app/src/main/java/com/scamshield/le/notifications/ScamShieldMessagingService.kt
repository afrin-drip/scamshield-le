package com.scamshield.le.notifications

import android.content.SharedPreferences
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class ScamShieldMessagingService : FirebaseMessagingService() {

    @Inject
    lateinit var familyNotificationManager: FamilyNotificationManager

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        val data = remoteMessage.data

        val riskScore = data["riskScore"]?.toIntOrNull() ?: 0
        val callerNumber = data["callerNumber"] ?: "Unknown"
        val transcriptExcerpt = data["transcriptExcerpt"] ?: ""

        familyNotificationManager.showScamAlert(
            riskScore = riskScore,
            callerNumber = callerNumber,
            transcriptExcerpt = transcriptExcerpt
        )
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        val prefs: SharedPreferences = getSharedPreferences(
            "scamshield_prefs",
            MODE_PRIVATE
        )
        prefs.edit().putString("fcm_token", token).apply()
    }
}

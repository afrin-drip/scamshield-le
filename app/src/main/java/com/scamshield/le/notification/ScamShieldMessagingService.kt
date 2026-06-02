package com.scamshield.le.notification

import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.scamshield.le.MainActivity
import com.scamshield.le.R

class ScamShieldMessagingService : FirebaseMessagingService() {
    companion object {
        private const val TAG = "ScamShieldFCM"
        const val PREF_NAME = "scamshield_prefs"
        const val KEY_FCM_TOKEN = "fcm_token"
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d(TAG, "New FCM token: ${token}")
        getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE).edit().putString(KEY_FCM_TOKEN, token).apply()
        com.google.firebase.auth.FirebaseAuth.getInstance().currentUser?.uid?.let { uid ->
            FirebaseFirestore.getInstance().collection("users").document(uid)
                .update("fcmToken", token)
                .addOnFailureListener { e -> Log.e(TAG, "Firestore token update failed", e) }
        }
    }

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        val type = message.data["type"] ?: return
        NotificationChannelManager.createChannels(this)
        when (type) {
            "scam_alert"     -> handleScamAlert(message)
            "family_scam"    -> handleFamilyScam(message)
            "weekly_summary" -> handleWeeklySummary(message)
        }
    }

    private fun handleScamAlert(msg: RemoteMessage) {
        val alertId = msg.data["alertId"] ?: ""
        val pi = deepLinkIntent(Uri.parse("scamshield://alert?alertId=${alertId}"), 1001)
        val notif = NotificationCompat.Builder(this, NotificationChannelManager.CHANNEL_ALERT)
            .setSmallIcon(R.drawable.ic_notification_alert)
            .setContentTitle(msg.notification?.title ?: "Scam Alert Detected")
            .setContentText(msg.notification?.body ?: "A scam attempt was detected on your device.")
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setAutoCancel(true).setFullScreenIntent(pi, true).setContentIntent(pi).build()
        getSystemService(NotificationManager::class.java)
            .notify(alertId.hashCode().takeIf { it != 0 } ?: System.currentTimeMillis().toInt(), notif)
    }

    private fun handleFamilyScam(msg: RemoteMessage) {
        val incidentId = msg.data["incidentId"] ?: ""
        val pi = deepLinkIntent(Uri.parse("scamshield://incident/${incidentId}"), 1002)
        val notif = NotificationCompat.Builder(this, NotificationChannelManager.CHANNEL_FAMILY)
            .setSmallIcon(R.drawable.ic_notification_family)
            .setContentTitle(msg.notification?.title ?: "Family Guardian Alert")
            .setContentText(msg.notification?.body ?: "A family member may have encountered a scam.")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_MESSAGE)
            .setAutoCancel(true).setContentIntent(pi).build()
        getSystemService(NotificationManager::class.java)
            .notify(incidentId.hashCode().takeIf { it != 0 } ?: System.currentTimeMillis().toInt(), notif)
    }

    private fun handleWeeklySummary(msg: RemoteMessage) {
        val pi = deepLinkIntent(Uri.parse("scamshield://history"), 1003)
        val notif = NotificationCompat.Builder(this, NotificationChannelManager.CHANNEL_SUMMARY)
            .setSmallIcon(R.drawable.ic_notification_summary)
            .setContentTitle(msg.notification?.title ?: "Weekly ScamShield Summary")
            .setContentText(msg.notification?.body ?: "Your weekly summary is ready.")
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true).setContentIntent(pi).build()
        getSystemService(NotificationManager::class.java).notify(System.currentTimeMillis().toInt(), notif)
    }

    private fun deepLinkIntent(uri: Uri, requestCode: Int) = PendingIntent.getActivity(
        this, requestCode,
        Intent(Intent.ACTION_VIEW, uri, this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
}
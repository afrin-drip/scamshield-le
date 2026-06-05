package com.scamshield.le.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.IBinder
import android.telephony.PhoneStateListener
import android.telephony.TelephonyManager
import android.util.Log
import androidx.core.app.NotificationCompat
import com.scamshield.le.R
import com.scamshield.le.intelligence.ScamIntelligenceManager
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.*
import javax.inject.Inject

@AndroidEntryPoint
class PassiveDetectionService : Service() {

    @Inject lateinit var scamIntelligenceManager: ScamIntelligenceManager

    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
    private lateinit var telephonyManager: TelephonyManager
    private lateinit var phoneStateListener: PhoneStateListener

    companion object {
        private const val TAG = "PassiveDetectionService"
        private const val FOREGROUND_NOTIFICATION_ID = 1001
        private const val SCAM_ALERT_NOTIFICATION_ID = 2001
        private const val CHANNEL_FOREGROUND = "passive_detection_fg"
        private const val CHANNEL_SCAM_ALERT = "scam_alert"
        private const val HIGH_CONFIDENCE_THRESHOLD = 0.5f
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
        telephonyManager = getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
        setupPhoneStateListener()
        startForeground(FOREGROUND_NOTIFICATION_ID, buildForegroundNotification())
    }

    private fun setupPhoneStateListener() {
        phoneStateListener = object : PhoneStateListener() {
            @Deprecated("Deprecated in API 31; use TelephonyCallback on API 31+")
            override fun onCallStateChanged(state: Int, phoneNumber: String?) {
                if (state == TelephonyManager.CALL_STATE_RINGING && !phoneNumber.isNullOrBlank()) {
                    Log.d(TAG, "CALL_STATE_RINGING — checking $phoneNumber")
                    serviceScope.launch {
                        checkIncomingCall(phoneNumber)
                    }
                }
            }
        }

        @Suppress("DEPRECATION")
        telephonyManager.listen(phoneStateListener, PhoneStateListener.LISTEN_CALL_STATE)
    }

    private suspend fun checkIncomingCall(phoneNumber: String) {
        try {
            val result = scamIntelligenceManager.checkNumber(phoneNumber)
            Log.d(TAG, "Intelligence result for $phoneNumber: confidence=${result.confidence}, known=${result.isKnownScam}")

            if (result.confidence >= HIGH_CONFIDENCE_THRESHOLD || result.isKnownScam) {
                val message = result.warningMessage
                    ?: "⚠️ Incoming call from known scam number. This may be a law enforcement impersonation scam."
                showScamAlertNotification(phoneNumber, message, result.confidence)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to check incoming number: ${e.message}")
        }
    }

    private fun showScamAlertNotification(phoneNumber: String, message: String, confidence: Float) {
        val notificationManager = getSystemService(NotificationManager::class.java)

        val priority = if (confidence >= 0.8f)
            NotificationCompat.PRIORITY_MAX
        else
            NotificationCompat.PRIORITY_HIGH

        val notification = NotificationCompat.Builder(this, CHANNEL_SCAM_ALERT)
            .setSmallIcon(R.drawable.ic_warning)
            .setContentTitle("⚠️ Suspected Scam Call")
            .setContentText(message)
            .setStyle(NotificationCompat.BigTextStyle().bigText(message))
            .setPriority(priority)
            .setCategory(Notification.CATEGORY_CALL)
            .setAutoCancel(true)
            .setVibrate(longArrayOf(0, 500, 200, 500))
            .build()

        notificationManager.notify(SCAM_ALERT_NOTIFICATION_ID, notification)
        Log.d(TAG, "Scam alert notification shown for $phoneNumber (confidence=$confidence)")
    }

    private fun buildForegroundNotification(): Notification =
        NotificationCompat.Builder(this, CHANNEL_FOREGROUND)
            .setSmallIcon(R.drawable.ic_shield)
            .setContentTitle("ScamShield Active")
            .setContentText("Monitoring calls for scam activity")
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()

    private fun createNotificationChannels() {
        val nm = getSystemService(NotificationManager::class.java)

        nm.createNotificationChannel(
            NotificationChannel(
                CHANNEL_FOREGROUND,
                "ScamShield Service",
                NotificationManager.IMPORTANCE_LOW
            ).apply { description = "Keeps ScamShield running in the background" }
        )

        nm.createNotificationChannel(
            NotificationChannel(
                CHANNEL_SCAM_ALERT,
                "Scam Call Alerts",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Alerts for incoming calls from known scam numbers"
                enableVibration(true)
            }
        )
    }

    override fun onDestroy() {
        super.onDestroy()
        @Suppress("DEPRECATION")
        telephonyManager.listen(phoneStateListener, PhoneStateListener.LISTEN_NONE)
        serviceScope.cancel()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}

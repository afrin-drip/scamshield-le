package com.scamshield.le.notifications

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class FamilyNotificationManager @Inject constructor(
    @ApplicationContext private val context: Context
) {

    companion object {
        const val CHANNEL_ID = "family_scam_alerts"
        const val CHANNEL_NAME = "Family Scam Alerts"
        const val CHANNEL_DESCRIPTION = "Notifications for scam alerts sent to family guardians"
        private var notificationId = 1000
    }

    private val notificationManager: NotificationManager =
        context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    init {
        createNotificationChannel()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = CHANNEL_DESCRIPTION
                enableVibration(true)
                enableLights(true)
            }
            notificationManager.createNotificationChannel(channel)
        }
    }

    fun showScamAlert(
        riskScore: Int,
        callerNumber: String,
        transcriptExcerpt: String
    ) {
        val viewDetailsIntent = context.packageManager
            .getLaunchIntentForPackage(context.packageName)
            ?.apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                putExtra("EXTRA_CALLER_NUMBER", callerNumber)
                putExtra("EXTRA_RISK_SCORE", riskScore)
            }

        val pendingIntent = PendingIntent.getActivity(
            context,
            notificationId,
            viewDetailsIntent ?: Intent(),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val riskLabel = when {
            riskScore >= 80 -> "HIGH RISK"
            riskScore >= 50 -> "MEDIUM RISK"
            else -> "LOW RISK"
        }

        val excerptPreview = if (transcriptExcerpt.length > 100)
            transcriptExcerpt.take(100) + "..."
        else transcriptExcerpt

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle("ScamShield Alert: $riskLabel ($riskScore%)")
            .setContentText("Caller: $callerNumber")
            .setStyle(
                NotificationCompat.BigTextStyle()
                    .bigText("Caller: $callerNumber\n\nTranscript: $excerptPreview")
            )
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .addAction(
                android.R.drawable.ic_menu_view,
                "View Details",
                pendingIntent
            )
            .build()

        notificationManager.notify(notificationId++, notification)
    }
}

package com.scamshield.le.notification

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.annotation.RequiresApi

object NotificationChannelManager {
    const val CHANNEL_MONITORING = "scamshield_monitoring"
    const val CHANNEL_ALERT      = "scamshield_alert"
    const val CHANNEL_FAMILY     = "scamshield_family"
    const val CHANNEL_SUMMARY    = "scamshield_summary"

    fun createChannels(context: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val nm = context.getSystemService(NotificationManager::class.java) ?: return
        nm.createNotificationChannels(listOf(
            buildChannel(CHANNEL_MONITORING, "Monitoring Service",       NotificationManager.IMPORTANCE_LOW,     badge = false),
            buildChannel(CHANNEL_ALERT,      "Scam Alerts",              NotificationManager.IMPORTANCE_HIGH,    vibrate = true, lights = true, lockscreen = android.app.Notification.VISIBILITY_PUBLIC),
            buildChannel(CHANNEL_FAMILY,     "Family Guardian Alerts",   NotificationManager.IMPORTANCE_HIGH,    vibrate = true, lights = true, lockscreen = android.app.Notification.VISIBILITY_PUBLIC),
            buildChannel(CHANNEL_SUMMARY,    "Weekly Summaries",         NotificationManager.IMPORTANCE_DEFAULT)
        ))
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun buildChannel(
        id: String, name: String, importance: Int,
        badge: Boolean = true, vibrate: Boolean = false,
        lights: Boolean = false, lockscreen: Int = android.app.Notification.VISIBILITY_PRIVATE
    ) = NotificationChannel(id, name, importance).apply {
        setShowBadge(badge)
        if (vibrate) enableVibration(true)
        if (lights)  enableLights(true)
        lockscreenVisibility = lockscreen
    }
}
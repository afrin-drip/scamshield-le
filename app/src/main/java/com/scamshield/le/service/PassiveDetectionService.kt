package com.scamshield.le.service
import android.app.*; import android.content.Context; import android.content.Intent; import android.os.IBinder
import android.telephony.PhoneStateListener; import android.telephony.TelephonyManager
import androidx.core.app.NotificationCompat; import com.scamshield.le.MainActivity
import com.scamshield.le.alertsystem.AlertManager; import com.scamshield.le.api.CallAnalysisCoordinator
import com.scamshield.le.audio.AudioCaptureManager; import com.scamshield.le.data.repository.SettingsRepository
import dagger.hilt.android.AndroidEntryPoint; import kotlinx.coroutines.*; import javax.inject.Inject
@AndroidEntryPoint class PassiveDetectionService : Service() {
    @Inject lateinit var audioCaptureManager: AudioCaptureManager
    @Inject lateinit var coordinator: CallAnalysisCoordinator
    @Inject lateinit var alertManager: AlertManager
    @Inject lateinit var settings: SettingsRepository
    companion object { const val CHANNEL_ID = "passive_detection"; const val NOTIFICATION_ID = 3001; var isRunning = false; fun start(c: Context) { c.startForegroundService(Intent(c, PassiveDetectionService::class.java)) }; fun stop(c: Context) { c.stopService(Intent(c, PassiveDetectionService::class.java)) } }
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())
    private var telephonyManager: TelephonyManager? = null; private var phoneStateListener: PhoneStateListener? = null; private var isMonitoringCall = false
    override fun onCreate() { super.onCreate(); isRunning = true; createChannel(); startForeground(NOTIFICATION_ID, buildNotification()); setupListener() }
    private fun setupListener() {
        telephonyManager = getSystemService(TelephonyManager::class.java)
        phoneStateListener = object : PhoneStateListener() {
            @Deprecated("Deprecated in Java")
            override fun onCallStateChanged(state: Int, num: String?) {
                when (state) {
                    TelephonyManager.CALL_STATE_OFFHOOK -> { if (!isMonitoringCall && settings.passiveDetectionEnabled) { isMonitoringCall = true; coordinator.reset(); audioCaptureManager.startCapture(); coordinator.startAnalysis(scope); scope.launch { coordinator.riskAssessment.collect { if (it.level.name == "CRITICAL" && isMonitoringCall) alertManager.triggerAlert() } } } }
                    TelephonyManager.CALL_STATE_IDLE -> { if (isMonitoringCall) { isMonitoringCall = false; audioCaptureManager.stopCapture(); coordinator.reset() } }
                }
            }
        }
        @Suppress("DEPRECATION") telephonyManager?.listen(phoneStateListener, PhoneStateListener.LISTEN_CALL_STATE)
    }
    private fun createChannel() { val c = NotificationChannel(CHANNEL_ID, "Passive Scam Detection", NotificationManager.IMPORTANCE_LOW); getSystemService(NotificationManager::class.java).createNotificationChannel(c) }
    private fun buildNotification(): Notification { val pi = PendingIntent.getActivity(this, 0, Intent(this, MainActivity::class.java), PendingIntent.FLAG_IMMUTABLE); return NotificationCompat.Builder(this, CHANNEL_ID).setContentTitle("ScamShield — Passive Protection").setContentText("Monitoring incoming calls automatically").setSmallIcon(android.R.drawable.ic_btn_speak_now).setContentIntent(pi).setOngoing(true).build() }
    override fun onDestroy() { isRunning = false; isMonitoringCall = false; @Suppress("DEPRECATION") telephonyManager?.listen(phoneStateListener, PhoneStateListener.LISTEN_NONE); audioCaptureManager.stopCapture(); scope.cancel(); super.onDestroy() }
    override fun onBind(intent: Intent?): IBinder? = null
}

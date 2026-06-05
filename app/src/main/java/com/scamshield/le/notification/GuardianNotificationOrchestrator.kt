package com.scamshield.le.notification

import android.util.Log
import com.scamshield.le.analytics.Analytics
import com.scamshield.le.data.model.FamilyMember
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class GuardianNotificationOrchestrator @Inject constructor(
    private val familyGuardianNotifier: FamilyGuardianNotifier,
    private val twilioSmsManager: TwilioSmsManager,
    private val analytics: Analytics
) {
    companion object {
        private const val TAG = "GuardianNotificationOrchestrator"
    }

    fun sendGuardianAlert(
        guardian: FamilyMember,
        scamMember: FamilyMember,
        riskScore: Int,
        signals: List<String>
    ) {
        var fcmSuccess = false
        var smsSuccess = false

        // Step 1: Try FCM push notification
        try {
            fcmSuccess = familyGuardianNotifier.sendPushNotification(guardian, scamMember, riskScore, signals)
            if (fcmSuccess) {
                Log.i(TAG, "FCM push sent to guardian ${guardian.id}")
            } else {
                Log.w(TAG, "FCM push failed for guardian ${guardian.id}")
            }
        } catch (e: Exception) {
            Log.e(TAG, "FCM exception for guardian ${guardian.id}", e)
            fcmSuccess = false
        }

        // Step 2: If FCM failed OR guardian has smsEnabled, send Twilio SMS
        val shouldSendSms = !fcmSuccess || guardian.smsEnabled
        if (shouldSendSms && guardian.guardianPhone.isNotBlank()) {
            smsSuccess = twilioSmsManager.sendScamAlert(
                guardianPhone = guardian.guardianPhone,
                familyMemberName = scamMember.name,
                riskScore = riskScore,
                signals = signals
            )
            if (smsSuccess) {
                Log.i(TAG, "SMS alert sent to guardian ${guardian.id}")
            } else {
                Log.e(TAG, "SMS alert failed for guardian ${guardian.id}")
            }
        } else if (shouldSendSms) {
            Log.w(TAG, "SMS skipped for guardian ${guardian.id}: no phone number configured")
        }

        // Step 3: Log which channel succeeded
        val channel = when {
            fcmSuccess && smsSuccess -> "both"
            fcmSuccess -> "fcm_only"
            smsSuccess -> "sms_only"
            else -> "none"
        }
        analytics.trackEvent(
            "guardian_alert_sent",
            mapOf(
                "guardian_id" to guardian.id.toString(),
                "scam_member_id" to scamMember.id.toString(),
                "risk_score" to riskScore.toString(),
                "fcm_success" to fcmSuccess.toString(),
                "sms_sent" to shouldSendSms.toString(),
                "sms_success" to smsSuccess.toString(),
                "channel" to channel
            )
        )
    }
}

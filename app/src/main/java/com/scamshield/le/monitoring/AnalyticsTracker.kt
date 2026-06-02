package com.scamshield.le.monitoring

import com.google.firebase.analytics.FirebaseAnalytics
import com.google.firebase.analytics.logEvent
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AnalyticsTracker @Inject constructor(
    private val analytics: FirebaseAnalytics
) {
    fun logMonitoringStarted() =
        analytics.logEvent("monitoring_started") {}

    fun logMonitoringStopped(durationSeconds: Int) =
        analytics.logEvent("monitoring_stopped") {
            param("duration_seconds", durationSeconds.toLong())
        }

    fun logScamAlertShown(riskScore: Int, signalCount: Int) =
        analytics.logEvent("scam_alert_shown") {
            param("risk_score", riskScore.toLong())
            param("signal_count", signalCount.toLong())
        }

    /** @param destination "ftc" or "ic3" */
    fun logReportSubmitted(destination: String) =
        analytics.logEvent("report_submitted") {
            param("destination", destination)
        }

    fun logFamilyMemberAdded() =
        analytics.logEvent("family_member_added") {}

    fun logSubscriptionUpgrade(tier: String) =
        analytics.logEvent("subscription_upgrade") {
            param("tier", tier)
        }
}
package com.scamshield.shared.util

import com.scamshield.shared.detection.RiskAssessment
import com.scamshield.shared.detection.ScamSignal

object RiskScoreFormatter {

    fun formatScore(score: Int): String = "$score / 100"

    fun riskLevelLabel(level: RiskAssessment.RiskLevel): String = when (level) {
        RiskAssessment.RiskLevel.LOW -> "Low Risk"
        RiskAssessment.RiskLevel.SUSPICIOUS -> "Suspicious Activity"
        RiskAssessment.RiskLevel.LIKELY_SCAM -> "Likely Scam"
        RiskAssessment.RiskLevel.CRITICAL -> "Critical — Scam Detected"
    }

    fun signalSummary(signals: List<ScamSignal>): String {
        if (signals.isEmpty()) return "No scam indicators detected."
        return signals.joinToString(separator = "\n") { signal ->
            "• ${signal.label} (+${signal.score} pts)"
        }
    }
}
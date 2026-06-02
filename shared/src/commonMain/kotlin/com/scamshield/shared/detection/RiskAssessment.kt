package com.scamshield.shared.detection

data class RiskAssessment(
    val totalScore: Int,
    val signals: List<ScamSignal>,
    val level: RiskLevel
) {
    enum class RiskLevel(val label: String) {
        LOW("Low Risk"),
        SUSPICIOUS("Suspicious"),
        LIKELY_SCAM("Likely Scam"),
        CRITICAL("Critical - Scam")
    }
}
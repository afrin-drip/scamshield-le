package com.scamshield.shared.detection

object RiskEngine {

    private val urgencyKeywords = listOf(
        "immediately", "urgent", "right now", "act now", "do not hang up",
        "do not delay", "time sensitive", "limited time", "expire", "expires today",
        "final notice", "last chance", "warrant issued", "arrest warrant",
        "immediately contact", "call immediately", "respond immediately",
        "24 hours", "48 hours", "today only", "failure to comply"
    )

    private val impersonationKeywords = listOf(
        "irs", "internal revenue service", "social security", "ssa",
        "social security administration", "fbi", "federal bureau",
        "dea", "drug enforcement", "ftc", "federal trade commission",
        "department of justice", "doj", "u.s. marshal", "us marshal",
        "sheriff", "police department", "law enforcement",
        "government agency", "federal agent", "treasury department",
        "medicare", "medicaid", "customs", "immigration", "border patrol",
        "homeland security", "secret service", "interpol"
    )

    private val paymentKeywords = listOf(
        "gift card", "gift cards", "google play", "apple gift card",
        "itunes", "amazon gift card", "prepaid card", "prepaid debit",
        "wire transfer", "western union", "money gram", "moneygram",
        "bitcoin", "cryptocurrency", "crypto", "zelle", "cashapp", "cash app",
        "venmo", "money order", "wire money", "send money", "payment required",
        "pay immediately", "pay now", "fine must be paid", "fee required",
        "processing fee", "clearance fee", "bail", "bond"
    )

    private val threatKeywords = listOf(
        "arrest", "arrested", "jail", "prison", "warrant",
        "criminal charges", "criminal record", "felony", "indictment",
        "prosecute", "prosecution", "deported", "deportation",
        "seized", "frozen", "suspend", "suspended", "revoke", "revoked",
        "legal action", "lawsuit", "sued", "court order", "subpoena",
        "do not tell", "do not inform", "keep confidential", "tell no one",
        "do not contact", "law enforcement will", "officers are"
    )

    private val personalInfoKeywords = listOf(
        "social security number", "ssn", "date of birth", "date of birth",
        "bank account", "account number", "routing number", "credit card",
        "debit card", "pin number", "password", "mother's maiden name",
        "driver's license", "passport number", "tax id", "ein",
        "verify your identity", "confirm your identity", "verify account",
        "personal information", "sensitive information"
    )

    fun analyze(text: String): RiskAssessment {
        val lower = text.lowercase()
        val signals = mutableListOf<ScamSignal>()

        val urgencyCount = urgencyKeywords.count { lower.contains(it) }
        if (urgencyCount > 0) {
            val score = minOf(25 + (urgencyCount - 1) * 5, 40)
            signals.add(ScamSignal.UrgencyLanguage(score))
        }

        val impersonationCount = impersonationKeywords.count { lower.contains(it) }
        if (impersonationCount > 0) {
            val score = minOf(30 + (impersonationCount - 1) * 5, 45)
            signals.add(ScamSignal.ImpersonationTactic(score))
        }

        val paymentCount = paymentKeywords.count { lower.contains(it) }
        if (paymentCount > 0) {
            val score = minOf(35 + (paymentCount - 1) * 5, 50)
            signals.add(ScamSignal.PaymentPressure(score))
        }

        val threatCount = threatKeywords.count { lower.contains(it) }
        if (threatCount > 0) {
            val score = minOf(30 + (threatCount - 1) * 5, 45)
            signals.add(ScamSignal.ThreatLanguage(score))
        }

        val personalCount = personalInfoKeywords.count { lower.contains(it) }
        if (personalCount > 0) {
            val score = minOf(20 + (personalCount - 1) * 5, 35)
            signals.add(ScamSignal.PersonalInfoRequest(score))
        }

        val totalScore = minOf(signals.sumOf { it.score }, 100)

        val level = when {
            totalScore >= 80 -> RiskAssessment.RiskLevel.CRITICAL
            totalScore >= 55 -> RiskAssessment.RiskLevel.LIKELY_SCAM
            totalScore >= 30 -> RiskAssessment.RiskLevel.SUSPICIOUS
            else -> RiskAssessment.RiskLevel.LOW
        }

        return RiskAssessment(totalScore = totalScore, signals = signals, level = level)
    }
}
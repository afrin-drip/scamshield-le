package com.scamshield.shared.detection

sealed class ScamSignal(val score: Int, val label: String) {
    class UrgencyLanguage(score: Int = 25) : ScamSignal(score, "Urgency Language")
    class ImpersonationTactic(score: Int = 30) : ScamSignal(score, "Impersonation Tactic")
    class PaymentPressure(score: Int = 35) : ScamSignal(score, "Payment Pressure")
    class ThreatLanguage(score: Int = 30) : ScamSignal(score, "Threat Language")
    class PersonalInfoRequest(score: Int = 20) : ScamSignal(score, "Personal Info Request")
}
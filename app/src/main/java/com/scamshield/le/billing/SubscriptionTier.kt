package com.scamshield.le.billing

enum class SubscriptionTier {
    FREE, PRO, FAMILY;

    fun hasPassiveDetection() = this != FREE
    fun hasFamilyMode() = this == FAMILY
    fun hasAnalytics() = this != FREE
    fun hasSimulation() = this != FREE
    fun displayName() = when (this) {
        FREE -> "Free"
        PRO -> "Pro"
        FAMILY -> "Family"
    }
}

object ProductIds {
    const val PRO_MONTHLY = "scamshield_pro_monthly"
    const val FAMILY_MONTHLY = "scamshield_family_monthly"
}

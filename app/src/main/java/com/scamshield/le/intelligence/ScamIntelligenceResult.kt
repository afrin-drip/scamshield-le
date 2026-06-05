package com.scamshield.le.intelligence

data class ScamIntelligenceResult(
    val isKnownScam: Boolean,
    val confidence: Float,       // 0.0–1.0
    val scamType: String?,       // "LE_IMPERSONATION", "IRS", "SSA", "TECH_SUPPORT", etc.
    val reportCount: Int,
    val warningMessage: String?
)

package com.scamshield.shared.model

import com.scamshield.shared.detection.RiskAssessment

data class ScamReport(
    val id: String,
    val timestamp: Long,
    val transcribedText: String,
    val assessment: RiskAssessment,
    val callerNumber: String? = null,
    val userNotes: String? = null,
    val reportedToAgency: String? = null
)
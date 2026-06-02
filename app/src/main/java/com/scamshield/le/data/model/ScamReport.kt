package com.scamshield.le.data.model

data class ScamReport(val incidentId: Long, val transcript: String, val riskScore: Int, val signalsDetected: List<String>, val callerClaimed: String = "", val paymentRequested: Boolean = false, val paymentMethod: String = "", val amountRequested: String = "", val phoneNumber: String = "", val timestamp: Long = System.currentTimeMillis())

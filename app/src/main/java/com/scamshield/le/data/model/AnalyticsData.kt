package com.scamshield.le.data.model

enum class RiskLevel {
    LOW, MEDIUM, HIGH, CRITICAL
}

data class SignalCount(
    val signal: String,
    val count: Int
)

data class DayCount(
    val date: String,
    val count: Int
)

data class AnalyticsData(
    val totalIncidents: Int,
    val topSignals: List<SignalCount>,
    val dailyCounts: List<DayCount>,
    val riskDistribution: Map<RiskLevel, Int>
)

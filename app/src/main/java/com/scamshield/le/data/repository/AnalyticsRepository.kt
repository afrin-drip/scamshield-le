package com.scamshield.le.data.repository

import com.scamshield.le.data.db.IncidentDao
import com.scamshield.le.data.model.DayCount
import com.scamshield.le.data.model.RiskLevel
import com.scamshield.le.data.model.SignalCount
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AnalyticsRepository @Inject constructor(
    private val incidentDao: IncidentDao
) {

    suspend fun getTotalIncidents(): Int =
        incidentDao.getTotalIncidentCount()

    fun getSignalFrequency(): Flow<List<SignalCount>> = flow {
        val raw = incidentDao.getAllSignals()
        val freq = raw
            .flatMap { it.split(",").map(String::trim).filter(String::isNotEmpty) }
            .groupingBy { it }
            .eachCount()
            .entries
            .sortedByDescending { it.value }
            .map { SignalCount(it.key, it.value) }
        emit(freq)
    }

    fun getIncidentsByDay(days: Int = 7): Flow<List<DayCount>> = flow {
        val fmt = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        val cal = Calendar.getInstance()
        val result = mutableListOf<DayCount>()
        for (i in days - 1 downTo 0) {
            cal.time = Calendar.getInstance().time
            cal.add(Calendar.DAY_OF_YEAR, -i)
            val dateStr = fmt.format(cal.time)
            val count = incidentDao.getIncidentCountForDate(dateStr)
            result.add(DayCount(dateStr, count))
        }
        emit(result)
    }

    fun getRiskDistribution(): Flow<Map<RiskLevel, Int>> = flow {
        val distribution = mapOf(
            RiskLevel.LOW to incidentDao.getIncidentCountByRiskRange(0, 25),
            RiskLevel.MEDIUM to incidentDao.getIncidentCountByRiskRange(26, 50),
            RiskLevel.HIGH to incidentDao.getIncidentCountByRiskRange(51, 75),
            RiskLevel.CRITICAL to incidentDao.getIncidentCountByRiskRange(76, 100)
        )
        emit(distribution)
    }
}

package com.scamshield.le.data.db

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface IncidentDao {
    @Query("SELECT * FROM incidents ORDER BY timestamp DESC")
    fun getAllIncidents(): Flow<List<IncidentEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertIncident(i: IncidentEntity): Long

    @Query("DELETE FROM incidents WHERE id = :id")
    suspend fun deleteById(id: Long)

    // --- Analytics queries (Track D) ---

    @Query("SELECT COUNT(*) FROM incidents")
    suspend fun getTotalIncidentCount(): Int

    @Query("SELECT COUNT(*) FROM incidents WHERE riskLevel = :level")
    suspend fun getCountByRiskLevel(level: String): Int

    @Query("SELECT signalsDetected FROM incidents WHERE signalsDetected != ''")
    suspend fun getAllSignals(): List<String>

    @Query("SELECT * FROM incidents ORDER BY timestamp DESC LIMIT :limit")
    suspend fun getRecentIncidents(limit: Int): List<IncidentEntity>

    @Query("SELECT * FROM incidents WHERE timestamp >= :since ORDER BY timestamp ASC")
    suspend fun getIncidentsSince(since: Long): List<IncidentEntity>

    @Query("SELECT AVG(totalScore) FROM incidents")
    suspend fun getAverageRiskScore(): Float?

    @Query("SELECT MAX(totalScore) FROM incidents")
    suspend fun getMaxRiskScore(): Int?

    @Query("SELECT COUNT(*) FROM incidents WHERE timestamp >= :startOfDay AND timestamp < :endOfDay")
    suspend fun getIncidentsCountForDay(startOfDay: Long, endOfDay: Long): Int
}

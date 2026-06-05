package com.scamshield.le.intelligence

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "scam_numbers")
data class ScamNumber(
    @PrimaryKey
    val number: String,
    val areaCode: String,
    val reportCount: Int = 0,
    val lastSeen: Long = System.currentTimeMillis(),
    val confidence: Float = 0.0f,
    val scamType: String? = null
)

@Dao
interface ScamNumberDao {
    @Query("SELECT * FROM scam_numbers WHERE number = :phoneNumber LIMIT 1")
    suspend fun getByNumber(phoneNumber: String): ScamNumber?

    @Query("SELECT * FROM scam_numbers WHERE areaCode = :areaCode ORDER BY confidence DESC")
    suspend fun getByAreaCode(areaCode: String): List<ScamNumber>

    @Query("SELECT * FROM scam_numbers WHERE confidence >= 0.7 ORDER BY confidence DESC")
    fun getHighConfidenceNumbers(): Flow<List<ScamNumber>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertNumber(scamNumber: ScamNumber)

    @Query("DELETE FROM scam_numbers WHERE number = :phoneNumber")
    suspend fun deleteNumber(phoneNumber: String)
}

@Database(entities = [ScamNumber::class], version = 1, exportSchema = false)
abstract class ScamNumberDatabase : RoomDatabase() {
    abstract fun scamNumberDao(): ScamNumberDao

    companion object {
        const val DATABASE_NAME = "scam_numbers.db"

        /**
         * Confidence scoring: 0.0–1.0
         * - Report count contributes up to 0.7 (logarithmic, saturates around 100 reports)
         * - Recency contributes up to 0.3 (linear decay over 30 days)
         */
        fun calculateConfidence(reportCount: Int, lastSeenMillis: Long): Float {
            val now = System.currentTimeMillis()
            val daysSinceLastSeen = (now - lastSeenMillis) / (1000L * 60 * 60 * 24).toFloat()

            val reportScore = minOf(
                0.7f,
                (Math.log1p(reportCount.toDouble()) / Math.log1p(100.0)).toFloat() * 0.7f
            )
            val recencyScore = maxOf(0.0f, 0.3f * (1.0f - (daysSinceLastSeen / 30.0f)))

            return minOf(1.0f, reportScore + recencyScore)
        }
    }
}

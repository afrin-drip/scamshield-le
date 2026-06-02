package com.scamshield.le.data.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.scamshield.le.data.model.FamilyNotification
import kotlinx.coroutines.flow.Flow

@Dao
interface FamilyNotificationDao {

    @Insert
    suspend fun insert(notification: FamilyNotification): Long

    @Query("SELECT * FROM family_notifications ORDER BY timestamp DESC")
    fun getAll(): Flow<List<FamilyNotification>>

    @Query("SELECT * FROM family_notifications WHERE acknowledged = 0 ORDER BY timestamp DESC")
    fun getUnacknowledged(): Flow<List<FamilyNotification>>

    @Query("UPDATE family_notifications SET acknowledged = 1 WHERE id = :id")
    suspend fun markAcknowledged(id: Long)
}

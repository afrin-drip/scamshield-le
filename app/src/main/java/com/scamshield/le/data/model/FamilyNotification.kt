package com.scamshield.le.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "family_notifications")
data class FamilyNotification(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val guardianId: String,
    val memberId: String,
    val riskScore: Int,
    val transcriptExcerpt: String,
    val callerNumber: String,
    val timestamp: Long,
    val acknowledged: Boolean = false
)

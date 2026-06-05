package com.scamshield.le.data.db
import androidx.room.Entity; import androidx.room.PrimaryKey
@Entity(tableName = "family_members")
data class FamilyMemberEntity(@PrimaryKey(autoGenerate = true) val id: Long = 0, val name: String, val phoneNumber: String, val relationship: String, val isProtected: Boolean = true, val notifyOnScam: Boolean = true, val addedAt: Long = System.currentTimeMillis(),
    val smsEnabled: Boolean = false,
    val guardianPhone: String = ""
)

package com.scamshield.le.data.db
import androidx.room.Database; import androidx.room.RoomDatabase
@Database(entities = [IncidentEntity::class, FamilyMemberEntity::class], version = 2, exportSchema = false)
abstract class AppDatabase : RoomDatabase() { abstract fun incidentDao(): IncidentDao; abstract fun familyMemberDao(): FamilyMemberDao }

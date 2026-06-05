package com.scamshield.le.data.db

import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase

val MIGRATION_2_3 = object : Migration(2, 3) {
    override fun migrate(database: SupportSQLiteDatabase) {
        // Add Twilio SMS fields to family_members table
        database.execSQL(
            "ALTER TABLE family_members ADD COLUMN smsEnabled INTEGER NOT NULL DEFAULT 0"
        )
        database.execSQL(
            "ALTER TABLE family_members ADD COLUMN guardianPhone TEXT NOT NULL DEFAULT ''"
        )
    }
}

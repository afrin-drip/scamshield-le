package com.scamshield.le.data.repository

import android.util.Log
import com.scamshield.le.data.dao.FamilyNotificationDao
import com.scamshield.le.data.model.FamilyNotification
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class FamilyNotificationRepository @Inject constructor(
    private val familyNotificationDao: FamilyNotificationDao
) {

    companion object {
        private const val TAG = "FamilyNotificationRepo"
        private const val PREFS_NAME = "scamshield_prefs"
        private const val KEY_FCM_TOKEN = "fcm_token"
    }

    suspend fun saveToken(token: String) {
        Log.d(TAG, "FCM token saved: $token")
        // Token persistence is handled by ScamShieldMessagingService via SharedPreferences.
        // This function is available for any additional token registration logic (e.g. syncing to backend).
    }

    suspend fun sendFamilyAlert(notification: FamilyNotification): Long {
        Log.d(TAG, "Saving family alert: caller=${notification.callerNumber}, risk=${notification.riskScore}")
        val insertedId = familyNotificationDao.insert(notification)
        Log.i(TAG, "Family alert saved with id=$insertedId")
        return insertedId
    }

    fun getNotificationHistory(): Flow<List<FamilyNotification>> {
        return familyNotificationDao.getAll()
    }

    suspend fun markAcknowledged(id: Long) {
        Log.d(TAG, "Marking notification $id as acknowledged")
        familyNotificationDao.markAcknowledged(id)
    }
}

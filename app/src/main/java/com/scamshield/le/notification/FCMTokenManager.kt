package com.scamshield.le.notification

import android.content.Context
import android.util.Log
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.messaging.FirebaseMessaging
import kotlinx.coroutines.tasks.await

class FCMTokenManager(private val context: Context) {
    companion object { private const val TAG = "FCMTokenManager" }

    private val prefs by lazy {
        context.getSharedPreferences(ScamShieldMessagingService.PREF_NAME, Context.MODE_PRIVATE)
    }

    val cachedToken: String?
        get() = prefs.getString(ScamShieldMessagingService.KEY_FCM_TOKEN, null)

    suspend fun getToken(): String? = runCatching {
        FirebaseMessaging.getInstance().token.await().also {
            prefs.edit().putString(ScamShieldMessagingService.KEY_FCM_TOKEN, it).apply()
        }
    }.onFailure { Log.e(TAG, "Token fetch failed", it) }.getOrNull()

    suspend fun uploadTokenForCurrentUser() {
        val uid   = FirebaseAuth.getInstance().currentUser?.uid ?: return
        val token = getToken() ?: return
        runCatching {
            FirebaseFirestore.getInstance().collection("users").document(uid)
                .update("fcmToken", token).await()
            Log.d(TAG, "FCM token uploaded for ${uid}")
        }.onFailure { Log.e(TAG, "Upload failed for ${uid}", it) }
    }

    fun clearCachedToken() {
        prefs.edit().remove(ScamShieldMessagingService.KEY_FCM_TOKEN).apply()
    }
}
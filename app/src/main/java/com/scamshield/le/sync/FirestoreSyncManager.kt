package com.scamshield.le.sync

import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.SetOptions
import com.scamshield.le.data.model.Incident
import kotlinx.coroutines.tasks.await
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class FirestoreSyncManager @Inject constructor(
    private val firestore: FirebaseFirestore,
    private val authManager: FirebaseAuthManager,
    private val mapper: FirestoreIncidentMapper
) {
    suspend fun syncIncident(incident: Incident) {
        val userId = authManager.currentUserId ?: return
        try {
            firestore
                .collection("users")
                .document(userId)
                .collection("incidents")
                .document(incident.id.toString())
                .set(mapper.toFirestoreMap(incident), SetOptions.merge())
                .await()
        } catch (e: Exception) {
            // Firestore offline persistence queues the write automatically
        }
    }

    suspend fun deleteIncident(id: Long) {
        val userId = authManager.currentUserId ?: return
        try {
            firestore
                .collection("users")
                .document(userId)
                .collection("incidents")
                .document(id.toString())
                .delete()
                .await()
        } catch (e: Exception) {
            // Handled by offline persistence
        }
    }
}
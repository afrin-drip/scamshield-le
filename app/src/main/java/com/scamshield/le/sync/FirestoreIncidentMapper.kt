package com.scamshield.le.sync

import com.google.firebase.Timestamp
import com.google.firebase.firestore.DocumentSnapshot
import com.scamshield.le.data.model.Incident
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class FirestoreIncidentMapper @Inject constructor() {

    fun toFirestoreMap(incident: Incident): Map<String, Any> = buildMap {
        put("id", incident.id)
        put("phoneNumber", incident.phoneNumber)
        put("callerName", incident.callerName ?: "")
        put("riskScore", incident.riskScore)
        put("riskLevel", incident.riskLevel.name)
        put("transcription", incident.transcription ?: "")
        put("startTime", incident.startTime)
        put("endTime", incident.endTime ?: 0L)
        put("duration", incident.duration ?: 0L)
        put("isScam", incident.isScam)
        put("scamType", incident.scamType ?: "")
        put("notes", incident.notes ?: "")
        put("syncedAt", Timestamp.now())
    }

    fun fromFirestoreDocument(doc: DocumentSnapshot): Incident? {
        return try {
            Incident(
                id = doc.getLong("id") ?: return null,
                phoneNumber = doc.getString("phoneNumber") ?: "",
                callerName = doc.getString("callerName")?.ifEmpty { null },
                riskScore = doc.getDouble("riskScore")?.toFloat() ?: 0f,
                riskLevel = enumValueOf(doc.getString("riskLevel") ?: "LOW"),
                transcription = doc.getString("transcription")?.ifEmpty { null },
                startTime = doc.getLong("startTime") ?: 0L,
                endTime = doc.getLong("endTime")?.takeIf { it > 0L },
                duration = doc.getLong("duration")?.takeIf { it > 0L },
                isScam = doc.getBoolean("isScam") ?: false,
                scamType = doc.getString("scamType")?.ifEmpty { null },
                notes = doc.getString("notes")?.ifEmpty { null }
            )
        } catch (e: Exception) {
            null
        }
    }
}
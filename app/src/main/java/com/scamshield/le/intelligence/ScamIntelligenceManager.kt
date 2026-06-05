package com.scamshield.le.intelligence

import android.util.Log
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ScamIntelligenceManager @Inject constructor(
    private val scamNumberDao: ScamNumberDao,
    private val firestore: FirebaseFirestore
) {
    companion object {
        private const val TAG = "ScamIntelligenceManager"
        private const val COLLECTION = "known_scam_numbers"

        /** Area codes with elevated scam activity */
        val HIGH_RISK_AREA_CODES = setOf(
            "202", "206", "212", "347", "404", "407", "470", "626",
            "657", "702", "786", "800", "833", "844", "855", "866",
            "877", "888"
        )
    }

    /**
     * Cross-references [phoneNumber] against local DB and high-risk area codes.
     * Returns a [ScamIntelligenceResult] with confidence, scam type, and warning message.
     */
    suspend fun checkNumber(phoneNumber: String): ScamIntelligenceResult = withContext(Dispatchers.IO) {
        val normalized = normalizeNumber(phoneNumber)
        val areaCode = extractAreaCode(normalized)

        // 1. Direct number match
        val knownScam = scamNumberDao.getByNumber(normalized)
        if (knownScam != null) {
            return@withContext ScamIntelligenceResult(
                isKnownScam = true,
                confidence = knownScam.confidence,
                scamType = knownScam.scamType,
                reportCount = knownScam.reportCount,
                warningMessage = buildWarningMessage(knownScam.confidence, knownScam.scamType)
            )
        }

        // 2. Area-code risk check
        if (areaCode != null && HIGH_RISK_AREA_CODES.contains(areaCode)) {
            val areaNumbers = scamNumberDao.getByAreaCode(areaCode)
            if (areaNumbers.isNotEmpty()) {
                val avgConfidence = areaNumbers.map { it.confidence }.average().toFloat()
                val adjustedConfidence = avgConfidence * 0.4f
                return@withContext ScamIntelligenceResult(
                    isKnownScam = false,
                    confidence = adjustedConfidence,
                    scamType = null,
                    reportCount = 0,
                    warningMessage = if (adjustedConfidence > 0.2f)
                        "⚠️ This number is from an area code with elevated scam activity."
                    else null
                )
            }
        }

        // 3. Clean
        ScamIntelligenceResult(
            isKnownScam = false,
            confidence = 0.0f,
            scamType = null,
            reportCount = 0,
            warningMessage = null
        )
    }

    /**
     * Records [phoneNumber] as a scam of [scamType] in the local DB and syncs to Firestore.
     */
    suspend fun reportNumber(phoneNumber: String, scamType: String) = withContext(Dispatchers.IO) {
        val normalized = normalizeNumber(phoneNumber)
        val areaCode = extractAreaCode(normalized) ?: ""

        val existing = scamNumberDao.getByNumber(normalized)
        val newReportCount = (existing?.reportCount ?: 0) + 1
        val now = System.currentTimeMillis()
        val confidence = ScamNumberDatabase.calculateConfidence(newReportCount, now)

        scamNumberDao.upsertNumber(
            ScamNumber(
                number = normalized,
                areaCode = areaCode,
                reportCount = newReportCount,
                lastSeen = now,
                confidence = confidence,
                scamType = scamType
            )
        )

        try {
            firestore.collection(COLLECTION)
                .document(normalized)
                .set(
                    mapOf(
                        "number" to normalized,
                        "areaCode" to areaCode,
                        "reportCount" to newReportCount,
                        "lastSeen" to now,
                        "confidence" to confidence,
                        "scamType" to scamType
                    )
                )
                .await()
            Log.d(TAG, "Synced $normalized to Firestore")
        } catch (e: Exception) {
            Log.e(TAG, "Firestore sync failed for $normalized: ${e.message}")
        }
    }

    /**
     * Pulls all documents from the Firestore "known_scam_numbers" collection
     * and upserts them into the local Room database.
     */
    suspend fun syncFromCloud() = withContext(Dispatchers.IO) {
        try {
            val snapshot = firestore.collection(COLLECTION).get().await()
            var synced = 0
            for (doc in snapshot.documents) {
                val number = doc.getString("number") ?: continue
                val areaCode = doc.getString("areaCode") ?: extractAreaCode(number) ?: ""
                val reportCount = doc.getLong("reportCount")?.toInt() ?: 0
                val lastSeen = doc.getLong("lastSeen") ?: System.currentTimeMillis()
                val confidence = doc.getDouble("confidence")?.toFloat()
                    ?: ScamNumberDatabase.calculateConfidence(reportCount, lastSeen)
                val scamType = doc.getString("scamType")

                scamNumberDao.upsertNumber(
                    ScamNumber(
                        number = number,
                        areaCode = areaCode,
                        reportCount = reportCount,
                        lastSeen = lastSeen,
                        confidence = confidence,
                        scamType = scamType
                    )
                )
                synced++
            }
            Log.d(TAG, "Cloud sync complete: $synced numbers ingested")
        } catch (e: Exception) {
            Log.e(TAG, "Cloud sync failed: ${e.message}")
            throw e
        }
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private fun normalizeNumber(phoneNumber: String): String {
        val digits = phoneNumber.replace(Regex("[^0-9+]"), "")
        return when {
            digits.startsWith("+1") && digits.length == 12 -> digits.substring(2)
            digits.startsWith("1") && digits.length == 11 -> digits.substring(1)
            else -> digits
        }
    }

    private fun extractAreaCode(normalized: String): String? =
        if (normalized.length >= 10) normalized.substring(0, 3) else null

    private fun buildWarningMessage(confidence: Float, scamType: String?): String {
        val label = when (scamType) {
            "LE_IMPERSONATION" -> "law enforcement impersonation"
            "IRS"              -> "IRS impersonation"
            "SSA"              -> "Social Security Administration"
            "TECH_SUPPORT"     -> "tech support"
            else               -> "scam"
        }
        return when {
            confidence >= 0.8f ->
                "⚠️ Incoming call from known scam number. This may be a $label scam."
            confidence >= 0.5f ->
                "⚠️ WARNING: This number has been reported as a $label scam."
            else ->
                "⚠️ This number has been flagged for suspicious activity."
        }
    }
}

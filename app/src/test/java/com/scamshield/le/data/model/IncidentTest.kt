package com.scamshield.le.data.model

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class IncidentTest {

    private fun makeIncident(
        id: Long = 1L,
        phoneNumber: String = "+15550001234",
        riskScore: Int = 75,
        riskLevel: String = "LIKELY_SCAM",
        signals: String = "Law Enforcement Claim,Money Request",
        timestamp: Long = System.currentTimeMillis(),
        transcript: String = "Sample transcript"
    ) = IncidentEntity(
        id = id,
        phoneNumber = phoneNumber,
        riskScore = riskScore,
        riskLevel = riskLevel,
        signals = signals,
        timestamp = timestamp,
        transcript = transcript
    )

    @Test
    fun testFormattedDateReturnsNonEmpty() {
        val incident = makeIncident(timestamp = System.currentTimeMillis())
        assertThat(incident.formattedDate()).isNotEmpty()
    }

    @Test
    fun testFormattedDateContainsYear() {
        val incident = makeIncident(timestamp = System.currentTimeMillis())
        val date = incident.formattedDate()
        assertThat(date).containsMatch("\\d{4}")
    }

    @Test
    fun testFormattedDateIsHumanReadable() {
        val fixedTimestamp = 1705320000000L
        val incident = makeIncident(timestamp = fixedTimestamp)
        val date = incident.formattedDate()
        assertThat(date).isNotEmpty()
        assertThat(date).doesNotMatch("^\\d{13}$")
    }

    @Test
    fun testRiskBadgeColorForLow() {
        val incident = makeIncident(riskLevel = "LOW", riskScore = 10)
        val color = incident.riskBadgeColor()
        assertThat(color).isNotNull()
        assertThat(color).isNotEqualTo(incident.copy(riskLevel = "CRITICAL").riskBadgeColor())
    }

    @Test
    fun testRiskBadgeColorForSuspicious() {
        val incident = makeIncident(riskLevel = "SUSPICIOUS", riskScore = 50)
        assertThat(incident.riskBadgeColor()).isNotNull()
    }

    @Test
    fun testRiskBadgeColorForLikelyScam() {
        val incident = makeIncident(riskLevel = "LIKELY_SCAM", riskScore = 75)
        assertThat(incident.riskBadgeColor()).isNotNull()
    }

    @Test
    fun testRiskBadgeColorForCritical() {
        val incident = makeIncident(riskLevel = "CRITICAL", riskScore = 100)
        assertThat(incident.riskBadgeColor()).isNotNull()
    }

    @Test
    fun testCriticalColorDiffersFromLowColor() {
        val low = makeIncident(riskLevel = "LOW", riskScore = 10)
        val critical = makeIncident(riskLevel = "CRITICAL", riskScore = 100)
        assertThat(low.riskBadgeColor()).isNotEqualTo(critical.riskBadgeColor())
    }

    @Test
    fun testRiskBadgeColorIsConsistent() {
        val incident = makeIncident(riskLevel = "LIKELY_SCAM", riskScore = 75)
        assertThat(incident.riskBadgeColor()).isEqualTo(incident.riskBadgeColor())
    }

    @Test
    fun testToIncidentSplitsCommaSeparatedSignals() {
        val entity = makeIncident(signals = "Law Enforcement Claim,Money Request,Urgency Tactic")
        val incident = entity.toIncident()
        assertThat(incident.signals).hasSize(3)
    }

    @Test
    fun testToIncidentSingleSignal() {
        val entity = makeIncident(signals = "Suspicious Payment Method")
        val incident = entity.toIncident()
        assertThat(incident.signals).hasSize(1)
        assertThat(incident.signals.first()).isEqualTo("Suspicious Payment Method")
    }

    @Test
    fun testToIncidentEmptySignals() {
        val entity = makeIncident(signals = "")
        val incident = entity.toIncident()
        assertThat(incident.signals).isNotNull()
    }

    @Test
    fun testToIncidentPreservesSignalNames() {
        val signalString = "Law Enforcement Claim,Arrest Warrant Threat,Money Request"
        val entity = makeIncident(signals = signalString)
        val incident = entity.toIncident()
        assertThat(incident.signals).contains("Law Enforcement Claim")
        assertThat(incident.signals).contains("Arrest Warrant Threat")
        assertThat(incident.signals).contains("Money Request")
    }

    @Test
    fun testToIncidentPreservesPhoneNumber() {
        val entity = makeIncident(phoneNumber = "+15550009876")
        val incident = entity.toIncident()
        assertThat(incident.phoneNumber).isEqualTo("+15550009876")
    }

    @Test
    fun testToIncidentPreservesRiskScore() {
        val entity = makeIncident(riskScore = 85)
        val incident = entity.toIncident()
        assertThat(incident.riskScore).isEqualTo(85)
    }

    @Test
    fun testToIncidentFiveSignals() {
        val entity = makeIncident(
            signals = "Law Enforcement Claim,Arrest Warrant Threat,Money Request," +
                      "Suspicious Payment Method,Urgency Tactic"
        )
        val incident = entity.toIncident()
        assertThat(incident.signals).hasSize(5)
    }
}

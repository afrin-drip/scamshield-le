package com.scamshield.le.rules

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class ScamSignalTest {

    @Test
    fun testLawEnforcementClaimSignalScore() {
        val signal = ScamSignal(
            category = SignalCategory.LAW_ENFORCEMENT_CLAIM,
            label = "Law Enforcement Claim",
            score = 25,
            matchedText = "I'm officer Johnson"
        )
        assertThat(signal.score).isEqualTo(25)
        assertThat(signal.category).isEqualTo(SignalCategory.LAW_ENFORCEMENT_CLAIM)
    }

    @Test
    fun testLawEnforcementClaimSignalLabel() {
        val signal = ScamSignal(
            category = SignalCategory.LAW_ENFORCEMENT_CLAIM,
            label = "Law Enforcement Claim",
            score = 25,
            matchedText = "officer"
        )
        assertThat(signal.label).isNotEmpty()
        assertThat(signal.label).ignoringCase().contains("law enforcement")
    }

    @Test
    fun testArrestWarrantSignalScore() {
        val signal = ScamSignal(
            category = SignalCategory.ARREST_WARRANT,
            label = "Arrest Warrant Threat",
            score = 20,
            matchedText = "you have a warrant"
        )
        assertThat(signal.score).isEqualTo(20)
        assertThat(signal.category).isEqualTo(SignalCategory.ARREST_WARRANT)
    }

    @Test
    fun testArrestWarrantSignalLabel() {
        val signal = ScamSignal(
            category = SignalCategory.ARREST_WARRANT,
            label = "Arrest Warrant Threat",
            score = 20,
            matchedText = "warrant"
        )
        assertThat(signal.label).isNotEmpty()
        assertThat(signal.matchedText).isNotEmpty()
    }

    @Test
    fun testMoneyRequestSignalScore() {
        val signal = ScamSignal(
            category = SignalCategory.MONEY_REQUEST,
            label = "Money Request",
            score = 40,
            matchedText = "you need to pay now"
        )
        assertThat(signal.score).isEqualTo(40)
        assertThat(signal.category).isEqualTo(SignalCategory.MONEY_REQUEST)
    }

    @Test
    fun testMoneyRequestSignalLabel() {
        val signal = ScamSignal(
            category = SignalCategory.MONEY_REQUEST,
            label = "Money Request",
            score = 40,
            matchedText = "pay now"
        )
        assertThat(signal.label).ignoringCase().contains("money")
    }

    @Test
    fun testSuspiciousPaymentSignalScore() {
        val signal = ScamSignal(
            category = SignalCategory.SUSPICIOUS_PAYMENT,
            label = "Suspicious Payment Method",
            score = 60,
            matchedText = "buy gift cards"
        )
        assertThat(signal.score).isEqualTo(60)
        assertThat(signal.category).isEqualTo(SignalCategory.SUSPICIOUS_PAYMENT)
    }

    @Test
    fun testSuspiciousPaymentSignalLabel() {
        val signal = ScamSignal(
            category = SignalCategory.SUSPICIOUS_PAYMENT,
            label = "Suspicious Payment Method",
            score = 60,
            matchedText = "gift cards"
        )
        assertThat(signal.label).isNotEmpty()
        assertThat(signal.score).isGreaterThan(40)
    }

    @Test
    fun testUrgencySignalScore() {
        val signal = ScamSignal(
            category = SignalCategory.URGENCY,
            label = "Urgency Tactic",
            score = 20,
            matchedText = "don't hang up"
        )
        assertThat(signal.score).isEqualTo(20)
        assertThat(signal.category).isEqualTo(SignalCategory.URGENCY)
    }

    @Test
    fun testUrgencySignalLabel() {
        val signal = ScamSignal(
            category = SignalCategory.URGENCY,
            label = "Urgency Tactic",
            score = 20,
            matchedText = "don't hang up"
        )
        assertThat(signal.label).isNotEmpty()
        assertThat(signal.matchedText).contains("hang up")
    }

    @Test
    fun testSignalScoreOrdering() {
        val signals = listOf(
            ScamSignal(SignalCategory.URGENCY, "Urgency", 20, "don't hang up"),
            ScamSignal(SignalCategory.LAW_ENFORCEMENT_CLAIM, "LE Claim", 25, "officer"),
            ScamSignal(SignalCategory.MONEY_REQUEST, "Money", 40, "pay now"),
            ScamSignal(SignalCategory.SUSPICIOUS_PAYMENT, "Suspicious Payment", 60, "gift cards"),
            ScamSignal(SignalCategory.ARREST_WARRANT, "Warrant", 20, "warrant")
        )
        val sorted = signals.sortedByDescending { it.score }
        assertThat(sorted.first().category).isEqualTo(SignalCategory.SUSPICIOUS_PAYMENT)
        assertThat(sorted.first().score).isEqualTo(60)
    }

    @Test
    fun testAllSignalCategoriesExist() {
        val categories = SignalCategory.values()
        assertThat(categories).hasLength(5)
    }

    @Test
    fun testSignalMatchedTextIsPreserved() {
        val matchedText = "buy iTunes gift cards immediately"
        val signal = ScamSignal(
            category = SignalCategory.SUSPICIOUS_PAYMENT,
            label = "Suspicious Payment Method",
            score = 60,
            matchedText = matchedText
        )
        assertThat(signal.matchedText).isEqualTo(matchedText)
    }

    @Test
    fun testSignalScoresArePositive() {
        val allSignals = listOf(
            ScamSignal(SignalCategory.LAW_ENFORCEMENT_CLAIM, "LE", 25, "officer"),
            ScamSignal(SignalCategory.ARREST_WARRANT, "Warrant", 20, "warrant"),
            ScamSignal(SignalCategory.MONEY_REQUEST, "Money", 40, "pay"),
            ScamSignal(SignalCategory.SUSPICIOUS_PAYMENT, "Payment", 60, "gift cards"),
            ScamSignal(SignalCategory.URGENCY, "Urgency", 20, "hang up")
        )
        allSignals.forEach { signal ->
            assertThat(signal.score).isGreaterThan(0)
        }
    }
}

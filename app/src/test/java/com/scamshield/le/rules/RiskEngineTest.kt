package com.scamshield.le.rules

import com.google.common.truth.Truth.assertThat
import org.junit.Before
import org.junit.Test

class RiskEngineTest {

    private lateinit var engine: RiskEngine

    @Before
    fun setUp() {
        engine = RiskEngine()
    }

    @Test
    fun testLawEnforcementClaimDetected() {
        val result = engine.analyze("I'm officer Johnson from the police department")
        assertThat(result.score).isAtLeast(25)
        assertThat(result.signals).isNotEmpty()
        assertThat(result.signals.any { it.label.contains("law enforcement", ignoreCase = true) ||
                it.label.contains("officer", ignoreCase = true) ||
                it.category == SignalCategory.LAW_ENFORCEMENT_CLAIM }).isTrue()
    }

    @Test
    fun testArrestWarrantDetected() {
        val result = engine.analyze("You have a warrant for your arrest and must comply")
        assertThat(result.score).isAtLeast(20)
        assertThat(result.signals.any { it.score >= 20 }).isTrue()
    }

    @Test
    fun testMoneyRequestDetected() {
        val result = engine.analyze("You need to pay now or face legal consequences")
        assertThat(result.score).isAtLeast(40)
        assertThat(result.signals.any { it.category == SignalCategory.MONEY_REQUEST ||
                it.label.contains("pay", ignoreCase = true) }).isTrue()
    }

    @Test
    fun testSuspiciousPaymentDetected() {
        val result = engine.analyze("Please buy gift cards and read me the numbers")
        assertThat(result.score).isAtLeast(60)
        assertThat(result.signals.any { it.category == SignalCategory.SUSPICIOUS_PAYMENT ||
                it.label.contains("gift card", ignoreCase = true) }).isTrue()
    }

    @Test
    fun testUrgencyDetected() {
        val result = engine.analyze("Don't hang up the phone, stay with me")
        assertThat(result.score).isAtLeast(20)
        assertThat(result.signals.any { it.category == SignalCategory.URGENCY ||
                it.label.contains("urgency", ignoreCase = true) ||
                it.score >= 20 }).isTrue()
    }

    @Test
    fun testMultipleSignalsCombine() {
        // LE claim (+25) + money request (+40) + gift cards (+60) = 125, capped at 100, CRITICAL
        val result = engine.analyze(
            "I'm officer Johnson. You have a warrant. You need to pay now by buying gift cards."
        )
        assertThat(result.score).isEqualTo(100)
        assertThat(result.level).isEqualTo(RiskLevel.CRITICAL)
    }

    @Test
    fun testThreshold40IsSuspicious() {
        val result = engine.analyze("You need to pay now to resolve this matter")
        assertThat(result.score).isAtLeast(40)
        assertThat(result.level).isAnyOf(
            RiskLevel.SUSPICIOUS, RiskLevel.LIKELY_SCAM, RiskLevel.CRITICAL
        )
    }

    @Test
    fun testThreshold70IsLikelyScam() {
        val result = engine.analyze(
            "This is officer Smith. You need to pay $500 now to avoid arrest."
        )
        assertThat(result.score).isAtLeast(70)
        assertThat(result.level).isAnyOf(RiskLevel.LIKELY_SCAM, RiskLevel.CRITICAL)
    }

    @Test
    fun testThreshold90IsCritical() {
        val result = engine.analyze(
            "I'm a federal officer. You have a warrant. Pay immediately with gift cards or wire transfer."
        )
        assertThat(result.score).isAtLeast(90)
        assertThat(result.level).isEqualTo(RiskLevel.CRITICAL)
    }

    @Test
    fun testEmptyTranscriptIsLow() {
        val result = engine.analyze("")
        assertThat(result.score).isEqualTo(0)
        assertThat(result.level).isEqualTo(RiskLevel.LOW)
    }

    @Test
    fun testCaseInsensitive() {
        val lower = engine.analyze("buy gift cards")
        val upper = engine.analyze("BUY GIFT CARDS")
        val mixed = engine.analyze("Buy Gift Cards")
        assertThat(lower.score).isEqualTo(upper.score)
        assertThat(lower.score).isEqualTo(mixed.score)
    }

    @Test
    fun testPartialKeywords() {
        val result = engine.analyze("I'm Officer Smith calling about your account")
        assertThat(result.score).isAtLeast(25)
    }

    @Test
    fun testFBIScriptIsCritical() {
        val fbiScript = """
            This is Special Agent Davis from the FBI. We have issued a federal arrest warrant
            in your name for money laundering and tax evasion. To resolve this matter immediately
            you must pay a fine of $2,500. Do not hang up. You should purchase Google Play gift
            cards and read me the numbers on the back. Do not tell anyone about this call or you
            will be arrested immediately.
        """.trimIndent()
        val result = engine.analyze(fbiScript)
        assertThat(result.score).isEqualTo(100)
        assertThat(result.level).isEqualTo(RiskLevel.CRITICAL)
    }

    @Test
    fun testIRSScriptIsLikelyScamOrHigher() {
        val irsScript = """
            This is the Internal Revenue Service. Your tax account has been flagged for
            immediate action. You owe back taxes and must pay today to avoid a warrant
            being issued for your arrest. Call us back immediately.
        """.trimIndent()
        val result = engine.analyze(irsScript)
        assertThat(result.level).isAnyOf(RiskLevel.LIKELY_SCAM, RiskLevel.CRITICAL)
        assertThat(result.score).isAtLeast(70)
    }

    @Test
    fun testInnocentTranscriptIsLow() {
        val result = engine.analyze("Hi, how are you today? The weather is nice.")
        assertThat(result.score).isLessThan(40)
        assertThat(result.level).isEqualTo(RiskLevel.LOW)
    }

    @Test
    fun testWhitespaceOnlyTranscriptIsLow() {
        val result = engine.analyze("   \n\t  ")
        assertThat(result.score).isEqualTo(0)
        assertThat(result.level).isEqualTo(RiskLevel.LOW)
    }

    @Test
    fun testScoreNeverExceeds100() {
        val result = engine.analyze(
            "Officer FBI IRS warrant arrest pay now gift cards wire transfer cryptocurrency " +
            "don't hang up don't tell anyone urgent immediate action required"
        )
        assertThat(result.score).isAtMost(100)
    }

    @Test
    fun testScoreIsNonNegative() {
        val result = engine.analyze("some random transcript text")
        assertThat(result.score).isAtLeast(0)
    }

    @Test
    fun testSocialSecurityScamScript() {
        val script = """
            Your Social Security number has been suspended due to suspicious activity.
            Press 1 to speak with an officer immediately or a warrant will be issued.
        """.trimIndent()
        val result = engine.analyze(script)
        assertThat(result.score).isAtLeast(40)
        assertThat(result.level).isAnyOf(
            RiskLevel.SUSPICIOUS, RiskLevel.LIKELY_SCAM, RiskLevel.CRITICAL
        )
    }

    @Test
    fun testWireTransferDetected() {
        val result = engine.analyze("You need to wire transfer the money to this account today")
        assertThat(result.score).isAtLeast(40)
    }

    @Test
    fun testCryptocurrencyDetected() {
        val result = engine.analyze("Send the payment in Bitcoin or Ethereum to resolve this")
        assertThat(result.score).isAtLeast(40)
    }

    @Test
    fun testDontTellAnyoneUrgency() {
        val result = engine.analyze("Do not tell anyone about this call, it is confidential")
        assertThat(result.score).isAtLeast(20)
    }

    @Test
    fun testMultipleUrgencySignalsStack() {
        val first = engine.analyze("don't hang up")
        val second = engine.analyze("don't hang up, act immediately, don't tell anyone")
        assertThat(second.score).isGreaterThan(first.score)
    }

    @Test
    fun testAnalyzeReturnsNonNullResult() {
        val result = engine.analyze("test input")
        assertThat(result).isNotNull()
        assertThat(result.signals).isNotNull()
    }

    @Test
    fun testRiskLevelLowBelow40() {
        val result = engine.analyze("Hello, I am calling to check in with you today")
        if (result.score < 40) {
            assertThat(result.level).isEqualTo(RiskLevel.LOW)
        }
    }

    @Test
    fun testRiskLevelCriticalAt100() {
        val result = engine.analyze(
            "FBI officer warrant arrest pay gift cards wire transfer don't hang up don't tell anyone"
        )
        if (result.score == 100) {
            assertThat(result.level).isEqualTo(RiskLevel.CRITICAL)
        }
    }
}

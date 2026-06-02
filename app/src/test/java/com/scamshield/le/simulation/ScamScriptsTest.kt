package com.scamshield.le.simulation

import com.google.common.truth.Truth.assertThat
import com.scamshield.le.rules.RiskEngine
import com.scamshield.le.rules.RiskLevel
import org.junit.Before
import org.junit.Test

class ScamScriptsTest {

    private lateinit var scripts: ScamScripts
    private lateinit var engine: RiskEngine

    @Before
    fun setUp() {
        scripts = ScamScripts()
        engine = RiskEngine()
    }

    @Test
    fun testFiveScriptsExist() {
        assertThat(scripts.getAllScripts()).hasSize(5)
    }

    @Test
    fun testEachScriptHasLines() {
        scripts.getAllScripts().forEach { script ->
            assertThat(script.lines).isNotEmpty()
            script.lines.forEach { line ->
                assertThat(line).isNotEmpty()
            }
        }
    }

    @Test
    fun testEachScriptHasName() {
        scripts.getAllScripts().forEach { script ->
            assertThat(script.name).isNotEmpty()
        }
    }

    @Test
    fun testEachScriptHasNonEmptyTranscript() {
        scripts.getAllScripts().forEach { script ->
            val fullText = script.lines.joinToString(" ")
            assertThat(fullText.trim()).isNotEmpty()
        }
    }

    @Test
    fun testFBIScriptProducesCritical() {
        val fbiScript = scripts.getAllScripts().find {
            it.name.contains("FBI", ignoreCase = true)
        }
        assertThat(fbiScript).isNotNull()

        val transcript = fbiScript!!.lines.joinToString(" ")
        val result = engine.analyze(transcript)

        assertThat(result.level).isEqualTo(RiskLevel.CRITICAL)
        assertThat(result.score).isEqualTo(100)
    }

    @Test
    fun testFBIScriptContainsLawEnforcementClaim() {
        val fbiScript = scripts.getAllScripts().find {
            it.name.contains("FBI", ignoreCase = true)
        }
        assertThat(fbiScript).isNotNull()
        val transcript = fbiScript!!.lines.joinToString(" ").lowercase()
        assertThat(
            transcript.contains("fbi") ||
            transcript.contains("federal bureau") ||
            transcript.contains("agent") ||
            transcript.contains("officer")
        ).isTrue()
    }

    @Test
    fun testFBIScriptContainsPaymentDemand() {
        val fbiScript = scripts.getAllScripts().find {
            it.name.contains("FBI", ignoreCase = true)
        }
        assertThat(fbiScript).isNotNull()
        val transcript = fbiScript!!.lines.joinToString(" ").lowercase()
        assertThat(
            transcript.contains("pay") ||
            transcript.contains("fine") ||
            transcript.contains("gift card") ||
            transcript.contains("wire")
        ).isTrue()
    }

    @Test
    fun testAllScriptsProduceNonZeroRiskScore() {
        scripts.getAllScripts().forEach { script ->
            val transcript = script.lines.joinToString(" ")
            val result = engine.analyze(transcript)
            assertThat(result.score).isGreaterThan(0)
        }
    }

    @Test
    fun testAllScriptsAreAtLeastSuspicious() {
        scripts.getAllScripts().forEach { script ->
            val transcript = script.lines.joinToString(" ")
            val result = engine.analyze(transcript)
            assertThat(result.level).isAnyOf(
                RiskLevel.SUSPICIOUS,
                RiskLevel.LIKELY_SCAM,
                RiskLevel.CRITICAL
            )
        }
    }

    @Test
    fun testIRSScriptExistsAndIsDangerous() {
        val irsScript = scripts.getAllScripts().find {
            it.name.contains("IRS", ignoreCase = true) ||
            it.name.contains("tax", ignoreCase = true)
        }
        if (irsScript != null) {
            val transcript = irsScript.lines.joinToString(" ")
            val result = engine.analyze(transcript)
            assertThat(result.level).isAnyOf(RiskLevel.LIKELY_SCAM, RiskLevel.CRITICAL)
        }
    }

    @Test
    fun testSocialSecurityScriptExistsIfPresent() {
        val ssScript = scripts.getAllScripts().find {
            it.name.contains("social security", ignoreCase = true) ||
            it.name.contains("SSA", ignoreCase = true)
        }
        if (ssScript != null) {
            val transcript = ssScript.lines.joinToString(" ")
            val result = engine.analyze(transcript)
            assertThat(result.score).isAtLeast(40)
        }
    }

    @Test
    fun testScriptLinesAreTrimmed() {
        scripts.getAllScripts().forEach { script ->
            script.lines.forEach { line ->
                assertThat(line).isEqualTo(line.trim())
            }
        }
    }

    @Test
    fun testScriptNamesAreUnique() {
        val names = scripts.getAllScripts().map { it.name }
        assertThat(names.toSet()).hasSize(names.size)
    }

    @Test
    fun testEachScriptHasAtLeastThreeLines() {
        scripts.getAllScripts().forEach { script ->
            assertThat(script.lines.size).isAtLeast(3)
        }
    }
}

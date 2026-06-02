package com.scamshield.le.monitoring

import com.google.firebase.perf.FirebasePerformance
import com.google.firebase.perf.metrics.Trace
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PerformanceTracker @Inject constructor() {

    private val performance: FirebasePerformance
        get() = FirebasePerformance.getInstance()

    /** Times end-to-end scam analysis pipeline. Caller must call stop(). */
    fun traceScamAnalysis(): Trace =
        performance.newTrace("scam_analysis").also { it.start() }

    /** Times Claude API round-trip. Caller must call stop(). */
    fun traceClaudeApiCall(): Trace =
        performance.newTrace("claude_api_call").also { it.start() }

    /** Times STT session lifecycle. Caller must call stop(). */
    fun traceSttSession(): Trace =
        performance.newTrace("stt_session").also { it.start() }
}
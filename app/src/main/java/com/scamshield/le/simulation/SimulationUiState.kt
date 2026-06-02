package com.scamshield.le.simulation

data class SimulationUiState(
    val isRunning: Boolean = false,
    val currentTranscript: String = "",
    val riskScore: Int = 0,
    val detectedSignals: List<String> = emptyList(),
    val selectedScript: ScriptType = ScriptType.IRS_ARREST,
    val isComplete: Boolean = false,
    val currentUtteranceIndex: Int = 0
)

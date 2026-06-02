package com.scamshield.le.ui.simulation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.scamshield.le.simulation.ScamScripts
import com.scamshield.le.simulation.ScriptType
import com.scamshield.le.simulation.SimulationUiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SimulationViewModel @Inject constructor() : ViewModel() {

    private val _uiState = MutableStateFlow(SimulationUiState())
    val uiState: StateFlow<SimulationUiState> = _uiState.asStateFlow()
    private var simulationJob: Job? = null

    private val signalKeywords = mapOf(
        "warrant" to "Authority: Warrant Claim",
        "arrest" to "Threat: Arrest Threat",
        "irs" to "Authority: IRS Impersonation",
        "ssn" to "PII: SSN Request",
        "social security" to "PII: SSN Request",
        "gift card" to "Payment: Gift Card Demand",
        "wire transfer" to "Payment: Wire Transfer Demand",
        "secret" to "Pressure: Secrecy Demand",
        "don't tell" to "Pressure: Secrecy Demand",
        "do not tell" to "Pressure: Secrecy Demand",
        "immediately" to "Urgency: Immediate Action",
        "immediate" to "Urgency: Immediate Action",
        "federal" to "Authority: Federal Agency Claim",
        "marshal" to "Authority: Marshal Impersonation",
        "sheriff" to "Authority: Sheriff Impersonation",
        "court" to "Authority: Court Impersonation",
        "redemption code" to "Payment: Gift Card Demand",
        "pin number" to "Payment: Gift Card Demand",
        "do not hang up" to "Pressure: Call Control",
        "remain on the line" to "Pressure: Call Control",
        "attorney" to "Isolation: Legal Counsel Blocked",
        "do not contact" to "Isolation: Contact Restriction",
        "forfeiture" to "Threat: Asset Seizure",
        "indictment" to "Authority: Legal Action Claim",
        "obstruction" to "Threat: Legal Threat Escalation"
    )

    fun selectScript(type: ScriptType) {
        if (!_uiState.value.isRunning) {
            _uiState.update { it.copy(selectedScript = type) }
        }
    }

    fun startSimulation() {
        if (_uiState.value.isRunning) return
        _uiState.update { it.copy(isRunning = true, isComplete = false, currentTranscript = "", riskScore = 0, detectedSignals = emptyList(), currentUtteranceIndex = 0) }
        simulationJob = viewModelScope.launch {
            val utterances = ScamScripts.getScript(_uiState.value.selectedScript)
            utterances.forEachIndexed { index, utterance ->
                _uiState.update { state ->
                    val newT = if (state.currentTranscript.isEmpty()) utterance else "${state.currentTranscript}\n\n$utterance"
                    state.copy(currentTranscript = newT, currentUtteranceIndex = index)
                }
                val (count, signals) = analyzeForSignals(utterance)
                if (count > 0) {
                    _uiState.update { state -> state.copy(riskScore = minOf(state.riskScore + count * 8, 100), detectedSignals = (state.detectedSignals + signals).distinct()) }
                }
                delay(1500L)
            }
            _uiState.update { it.copy(isRunning = false, isComplete = true) }
        }
    }

    fun stopSimulation() {
        simulationJob?.cancel()
        simulationJob = null
        _uiState.update { it.copy(isRunning = false) }
    }

    fun reset() {
        stopSimulation()
        _uiState.value = SimulationUiState()
    }

    private fun analyzeForSignals(utterance: String): Pair<Int, List<String>> {
        val lower = utterance.lowercase()
        val matched = mutableSetOf<String>()
        signalKeywords.forEach { (keyword, label) -> if (lower.contains(keyword)) matched.add(label) }
        return Pair(matched.size, matched.toList())
    }
}

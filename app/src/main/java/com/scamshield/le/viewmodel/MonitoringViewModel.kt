package com.scamshield.le.viewmodel

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.scamshield.le.alertsystem.AlertManager
import com.scamshield.le.api.CallAnalysisCoordinator
import com.scamshield.le.audio.AudioCaptureManager
import com.scamshield.le.data.repository.IncidentRepository
import com.scamshield.le.rules.RiskAssessment
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MonitoringViewModel @Inject constructor(
    @ApplicationContext private val ctx: Context,
    private val audio: AudioCaptureManager,
    private val coord: CallAnalysisCoordinator,
    private val alert: AlertManager,
    private val repo: IncidentRepository
) : ViewModel() {

    val isMonitoring = audio.isCapturing
    val riskAssessment = coord.riskAssessment
    val transcript = coord.transcript
    val analysisSource = coord.analysisSource

    private val _alertTriggered = MutableStateFlow(false)
    val alertTriggered: StateFlow<Boolean> get() = _alertTriggered
    private var startTime = 0L

    init {
        viewModelScope.launch {
            riskAssessment.collect {
                if (it.level == RiskAssessment.RiskLevel.CRITICAL && !_alertTriggered.value) {
                    _alertTriggered.value = true
                    alert.triggerAlert()
                }
            }
        }
    }

    fun hasAudioPermission() =
        ContextCompat.checkSelfPermission(ctx, Manifest.permission.RECORD_AUDIO) ==
                PackageManager.PERMISSION_GRANTED

    fun startMonitoring() {
        if (!hasAudioPermission()) return
        startTime = System.currentTimeMillis()
        coord.reset()
        _alertTriggered.value = false
        audio.startCapture()
        coord.startAnalysis(viewModelScope)
    }

    fun stopMonitoring() {
        audio.stopCapture()
        val a = riskAssessment.value
        if (a.totalScore > 0) {
            val dur = ((System.currentTimeMillis() - startTime) / 1000).toInt()
            viewModelScope.launch {
                repo.saveIncident(a.totalScore, a.level.name, a.signals.map { it.label }, transcript.value, dur)
            }
        }
    }

    fun dismissAlert() { _alertTriggered.value = false }
    fun injectTranscript(text: String) = coord.appendTranscript(text)
}

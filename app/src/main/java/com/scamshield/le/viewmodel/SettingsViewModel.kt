package com.scamshield.le.viewmodel
import android.content.Context; import androidx.lifecycle.ViewModel
import com.scamshield.le.data.repository.SettingsRepository; import com.scamshield.le.service.PassiveDetectionService
import dagger.hilt.android.lifecycle.HiltViewModel; import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow; import kotlinx.coroutines.flow.StateFlow; import javax.inject.Inject
@HiltViewModel class SettingsViewModel @Inject constructor(@ApplicationContext private val ctx: Context, private val settings: SettingsRepository) : ViewModel() {
    private val _passiveDetection = MutableStateFlow(settings.passiveDetectionEnabled); val passiveDetection: StateFlow<Boolean> get() = _passiveDetection
    private val _familyMode = MutableStateFlow(settings.familyModeEnabled); val familyMode: StateFlow<Boolean> get() = _familyMode
    private val _alertSound = MutableStateFlow(settings.alertSoundEnabled); val alertSound: StateFlow<Boolean> get() = _alertSound
    private val _alertVibration = MutableStateFlow(settings.alertVibrationEnabled); val alertVibration: StateFlow<Boolean> get() = _alertVibration
    private val _riskThreshold = MutableStateFlow(settings.minimumRiskThreshold); val riskThreshold: StateFlow<Int> get() = _riskThreshold
    fun setPassiveDetection(enabled: Boolean) { settings.passiveDetectionEnabled = enabled; _passiveDetection.value = enabled; if (enabled) PassiveDetectionService.start(ctx) else PassiveDetectionService.stop(ctx) }
    fun setFamilyMode(e: Boolean) { settings.familyModeEnabled = e; _familyMode.value = e }
    fun setAlertSound(e: Boolean) { settings.alertSoundEnabled = e; _alertSound.value = e }
    fun setAlertVibration(e: Boolean) { settings.alertVibrationEnabled = e; _alertVibration.value = e }
    fun setRiskThreshold(v: Int) { settings.minimumRiskThreshold = v; _riskThreshold.value = v }
}

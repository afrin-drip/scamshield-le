package com.scamshield.le.ui.onboarding

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class OnboardingViewModel @Inject constructor(
    private val dataStore: DataStore<Preferences>
) : ViewModel() {

    companion object {
        val ONBOARDING_COMPLETED = booleanPreferencesKey("onboarding_completed")
        const val TOTAL_STEPS = 4
    }

    private val _currentStep = MutableStateFlow(0)
    val currentStep: StateFlow<Int> = _currentStep.asStateFlow()

    private val _onboardingCompleted = MutableStateFlow(false)
    val onboardingCompleted: StateFlow<Boolean> = _onboardingCompleted.asStateFlow()

    init {
        viewModelScope.launch {
            dataStore.data
                .map { prefs -> prefs[ONBOARDING_COMPLETED] ?: false }
                .collect { completed ->
                    _onboardingCompleted.value = completed
                }
        }
    }

    fun goToNextStep() {
        if (_currentStep.value < TOTAL_STEPS - 1) {
            _currentStep.value = _currentStep.value + 1
        }
    }

    fun goToPreviousStep() {
        if (_currentStep.value > 0) {
            _currentStep.value = _currentStep.value - 1
        }
    }

    fun goToStep(step: Int) {
        if (step in 0 until TOTAL_STEPS) {
            _currentStep.value = step
        }
    }

    fun completeOnboarding() {
        viewModelScope.launch {
            dataStore.edit { prefs ->
                prefs[ONBOARDING_COMPLETED] = true
            }
            _onboardingCompleted.value = true
        }
    }

    fun resetOnboarding() {
        viewModelScope.launch {
            dataStore.edit { prefs ->
                prefs[ONBOARDING_COMPLETED] = false
            }
            _onboardingCompleted.value = false
            _currentStep.value = 0
        }
    }
}

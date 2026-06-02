package com.scamshield.le.ui.analytics

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.scamshield.le.data.model.AnalyticsData
import com.scamshield.le.data.model.DayCount
import com.scamshield.le.data.model.RiskLevel
import com.scamshield.le.data.model.SignalCount
import com.scamshield.le.data.repository.AnalyticsRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed class AnalyticsUiState {
    object Loading : AnalyticsUiState()
    data class Success(val data: AnalyticsData) : AnalyticsUiState()
    data class Error(val message: String) : AnalyticsUiState()
}

@HiltViewModel
class AnalyticsViewModel @Inject constructor(
    private val repository: AnalyticsRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<AnalyticsUiState>(AnalyticsUiState.Loading)
    val uiState: StateFlow<AnalyticsUiState> = _uiState.asStateFlow()

    init {
        loadAnalytics()
    }

    fun loadAnalytics() {
        viewModelScope.launch {
            _uiState.value = AnalyticsUiState.Loading
            try {
                val totalIncidents = repository.getTotalIncidents()
                combine(
                    repository.getSignalFrequency(),
                    repository.getIncidentsByDay(7),
                    repository.getRiskDistribution()
                ) { signals, days, risk ->
                    AnalyticsData(
                        totalIncidents = totalIncidents,
                        topSignals = signals,
                        dailyCounts = days,
                        riskDistribution = risk
                    )
                }.collect { data ->
                    _uiState.value = AnalyticsUiState.Success(data)
                }
            } catch (e: Exception) {
                _uiState.value = AnalyticsUiState.Error(e.message ?: "Unknown error")
            }
        }
    }

    fun refresh() {
        loadAnalytics()
    }
}

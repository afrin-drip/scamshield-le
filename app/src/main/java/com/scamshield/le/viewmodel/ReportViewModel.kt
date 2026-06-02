package com.scamshield.le.viewmodel
import androidx.lifecycle.ViewModel; import androidx.lifecycle.viewModelScope
import com.scamshield.le.data.model.ScamReport; import com.scamshield.le.data.repository.IncidentRepository
import com.scamshield.le.data.repository.ReportRepository; import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow; import kotlinx.coroutines.flow.StateFlow; import kotlinx.coroutines.launch; import javax.inject.Inject
@HiltViewModel class ReportViewModel @Inject constructor(private val incidentRepository: IncidentRepository, private val reportRepository: ReportRepository) : ViewModel() {
    private val _report = MutableStateFlow<ScamReport?>(null); val report: StateFlow<ScamReport?> get() = _report
    private val _submitted = MutableStateFlow(false); val submitted: StateFlow<Boolean> get() = _submitted
    fun loadIncident(incidentId: Long) { viewModelScope.launch { incidentRepository.allIncidents.collect { incidents -> val incident = incidents.find { it.id == incidentId }; incident?.let { _report.value = ScamReport(incidentId = it.id, transcript = it.transcript, riskScore = it.totalScore, signalsDetected = it.signalsDetected, timestamp = it.timestamp) } } } }
    fun reportToFTC(callerClaimed: String, phoneNumber: String, amountRequested: String) { val r = buildReport(callerClaimed, phoneNumber, amountRequested) ?: return; reportRepository.reportToFTC(r); _submitted.value = true }
    fun reportToIC3(callerClaimed: String, phoneNumber: String, amountRequested: String) { val r = buildReport(callerClaimed, phoneNumber, amountRequested) ?: return; reportRepository.reportToIC3(r); _submitted.value = true }
    fun shareReport() { val r = _report.value ?: return; reportRepository.shareReport(r) }
    private fun buildReport(callerClaimed: String, phone: String, amount: String): ScamReport? { val base = _report.value ?: return null; return base.copy(callerClaimed = callerClaimed, phoneNumber = phone, amountRequested = amount, paymentRequested = amount.isNotBlank()) }
}

package com.scamshield.le.ui.intelligence

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.scamshield.le.intelligence.ScamIntelligenceManager
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

// ── ViewModel ─────────────────────────────────────────────────────────────────

sealed class ReportUiState {
    object Idle : ReportUiState()
    object Submitting : ReportUiState()
    object Success : ReportUiState()
    data class Error(val message: String) : ReportUiState()
}

@HiltViewModel
class ScamNumberReportViewModel @Inject constructor(
    private val scamIntelligenceManager: ScamIntelligenceManager
) : ViewModel() {

    private val _uiState = MutableStateFlow<ReportUiState>(ReportUiState.Idle)
    val uiState: StateFlow<ReportUiState> = _uiState.asStateFlow()

    fun submitReport(phoneNumber: String, scamType: String) {
        if (phoneNumber.isBlank()) {
            _uiState.value = ReportUiState.Error("Please enter a phone number.")
            return
        }
        viewModelScope.launch {
            _uiState.value = ReportUiState.Submitting
            try {
                scamIntelligenceManager.reportNumber(phoneNumber.trim(), scamType)
                _uiState.value = ReportUiState.Success
            } catch (e: Exception) {
                _uiState.value = ReportUiState.Error(e.message ?: "Submission failed.")
            }
        }
    }

    fun resetState() { _uiState.value = ReportUiState.Idle }
}

// ── Screen ────────────────────────────────────────────────────────────────────

private val SCAM_TYPES = listOf(
    "LE_IMPERSONATION" to "Law Enforcement Impersonation",
    "IRS"              to "IRS Impersonation",
    "SSA"              to "Social Security Administration",
    "TECH_SUPPORT"     to "Tech Support Scam",
    "OTHER"            to "Other"
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ScamNumberReportScreen(
    prefillNumber: String = "",
    onSubmitted: () -> Unit = {},
    viewModel: ScamNumberReportViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    var phoneNumber by remember { mutableStateOf(prefillNumber) }
    var selectedScamType by remember { mutableStateOf(SCAM_TYPES.first()) }
    var dropdownExpanded by remember { mutableStateOf(false) }

    // Navigate away on success
    LaunchedEffect(uiState) {
        if (uiState is ReportUiState.Success) {
            onSubmitted()
            viewModel.resetState()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Report Scam Number") })
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 24.dp, vertical = 16.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            // Phone number input
            OutlinedTextField(
                value = phoneNumber,
                onValueChange = { phoneNumber = it },
                label = { Text("Phone Number") },
                placeholder = { Text("e.g. +1 800 555 0199") },
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                modifier = Modifier.fillMaxWidth()
            )

            // Scam type dropdown
            ExposedDropdownMenuBox(
                expanded = dropdownExpanded,
                onExpandedChange = { dropdownExpanded = it },
                modifier = Modifier.fillMaxWidth()
            ) {
                OutlinedTextField(
                    value = selectedScamType.second,
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Scam Type") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = dropdownExpanded) },
                    modifier = Modifier
                        .menuAnchor()
                        .fillMaxWidth()
                )
                ExposedDropdownMenu(
                    expanded = dropdownExpanded,
                    onDismissRequest = { dropdownExpanded = false }
                ) {
                    SCAM_TYPES.forEach { scamType ->
                        DropdownMenuItem(
                            text = { Text(scamType.second) },
                            onClick = {
                                selectedScamType = scamType
                                dropdownExpanded = false
                            }
                        )
                    }
                }
            }

            // Error message
            if (uiState is ReportUiState.Error) {
                Text(
                    text = (uiState as ReportUiState.Error).message,
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall
                )
            }

            // Submit button
            Button(
                onClick = { viewModel.submitReport(phoneNumber, selectedScamType.first) },
                enabled = uiState !is ReportUiState.Submitting,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
            ) {
                if (uiState is ReportUiState.Submitting) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(20.dp),
                        strokeWidth = 2.dp,
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                }
                Text(if (uiState is ReportUiState.Submitting) "Submitting…" else "Submit Report")
            }

            // Informational footnote
            Text(
                text = "Reports are shared anonymously with ScamShield's community database to protect others.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.align(Alignment.CenterHorizontally)
            )
        }
    }
}

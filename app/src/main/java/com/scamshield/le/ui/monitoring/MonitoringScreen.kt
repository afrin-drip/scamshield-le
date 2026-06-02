package com.scamshield.le.ui.monitoring

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.scamshield.le.rules.RiskAssessment
import com.scamshield.le.ui.theme.*
import com.scamshield.le.viewmodel.MonitoringViewModel

@Composable
fun MonitoringScreen(
    onAlertTriggered: () -> Unit,
    onStop: () -> Unit,
    vm: MonitoringViewModel = hiltViewModel()
) {
    val assessment by vm.riskAssessment.collectAsState()
    val transcript by vm.transcript.collectAsState()
    val alertTriggered by vm.alertTriggered.collectAsState()
    val analysisSource by vm.analysisSource.collectAsState()

    LaunchedEffect(Unit) { vm.startMonitoring() }
    LaunchedEffect(alertTriggered) { if (alertTriggered) onAlertTriggered() }

    val scoreColor = when (assessment.level) {
        RiskAssessment.RiskLevel.CRITICAL -> ScamRed
        RiskAssessment.RiskLevel.LIKELY_SCAM -> ScamOrange
        RiskAssessment.RiskLevel.SUSPICIOUS -> ScamYellow
        else -> SafeGreen
    }

    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp).verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(Modifier.height(32.dp))
        Text("Monitoring Active", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(4.dp))
        Text(
            "Source: $analysisSource",
            style = MaterialTheme.typography.labelSmall,
            color = if (analysisSource.startsWith("claude")) Color(0xFF64B5F6) else Color.Gray
        )
        Spacer(Modifier.height(24.dp))
        Text("${assessment.totalScore}", fontSize = 80.sp, fontWeight = FontWeight.ExtraBold, color = scoreColor)
        Text("Risk Score", style = MaterialTheme.typography.bodyMedium, color = Color.Gray)
        Spacer(Modifier.height(8.dp))
        LinearProgressIndicator(
            progress = { (assessment.totalScore / 100f).coerceIn(0f, 1f) },
            modifier = Modifier.fillMaxWidth().height(8.dp),
            color = scoreColor
        )
        Spacer(Modifier.height(24.dp))
        if (assessment.signals.isNotEmpty()) {
            Text("Detected Signals", fontWeight = FontWeight.SemiBold)
            Spacer(Modifier.height(8.dp))
            assessment.signals.forEach { signal ->
                SuggestionChip(onClick = {}, label = { Text(signal.label) }, modifier = Modifier.padding(2.dp))
            }
        }
        Spacer(Modifier.height(24.dp))
        if (transcript.isNotBlank()) {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(12.dp)) {
                    Text("Live Transcript", style = MaterialTheme.typography.labelSmall, color = Color.Gray)
                    Spacer(Modifier.height(4.dp))
                    Text(transcript, style = MaterialTheme.typography.bodySmall)
                }
            }
        }
        Spacer(Modifier.height(32.dp))
        Button(
            onClick = { vm.stopMonitoring(); onStop() },
            modifier = Modifier.fillMaxWidth().height(56.dp),
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
        ) {
            Text("Stop Monitoring", fontSize = 16.sp)
        }
    }
}

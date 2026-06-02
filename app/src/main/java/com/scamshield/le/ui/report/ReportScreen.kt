package com.scamshield.le.ui.report

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.scamshield.le.viewmodel.ReportViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReportScreen(incidentId: Long, onBack: () -> Unit, vm: ReportViewModel = hiltViewModel()) {
    val report by vm.report.collectAsState()
    val submitted by vm.submitted.collectAsState()
    LaunchedEffect(incidentId) { vm.loadIncident(incidentId) }
    Scaffold(topBar = { TopAppBar(title = { Text("Report This Scam") }, navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, "Back") } }, actions = { report?.let { IconButton(onClick = { vm.shareReport() }) { Icon(Icons.Default.Share, "Share") } } }) }) { padding ->
        Column(Modifier.fillMaxSize().padding(padding).padding(16.dp).verticalScroll(rememberScrollState())) {
            Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.3f)), modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp)) { Text("Help stop this scam", fontWeight = FontWeight.Bold); Spacer(Modifier.height(4.dp)); Text("Reporting scams helps law enforcement track patterns and protect others. It takes less than 5 minutes and can save someone from losing their savings.", style = MaterialTheme.typography.bodySmall) }
            }
            Spacer(Modifier.height(16.dp))
            report?.let { r ->
                Text("Incident Summary", fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                Spacer(Modifier.height(8.dp))
                Card(Modifier.fillMaxWidth()) { Column(Modifier.padding(12.dp)) { Text("Risk Score: ${r.riskScore}/100", fontWeight = FontWeight.Bold); if (r.signalsDetected.isNotEmpty()) { Spacer(Modifier.height(4.dp)); Text("Signals: ${r.signalsDetected.joinToString(", ")}", style = MaterialTheme.typography.bodySmall) } } }
                Spacer(Modifier.height(16.dp))
                Text("Add Details (Optional)", fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                Spacer(Modifier.height(8.dp))
                var callerClaimed by remember { mutableStateOf("") }
                var phoneNumber by remember { mutableStateOf("") }
                var amountRequested by remember { mutableStateOf("") }
                OutlinedTextField(value = callerClaimed, onValueChange = { callerClaimed = it }, label = { Text("Caller claimed to be") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(value = phoneNumber, onValueChange = { phoneNumber = it }, label = { Text("Caller's phone number") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(value = amountRequested, onValueChange = { amountRequested = it }, label = { Text("Amount requested") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
                Spacer(Modifier.height(24.dp))
                Text("Submit Your Report", fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                Spacer(Modifier.height(12.dp))
                Button(onClick = { vm.reportToFTC(callerClaimed, phoneNumber, amountRequested) }, modifier = Modifier.fillMaxWidth().height(52.dp)) { Text("🏛 Report to FTC (Recommended)", fontSize = 15.sp) }
                Spacer(Modifier.height(8.dp))
                OutlinedButton(onClick = { vm.reportToIC3(callerClaimed, phoneNumber, amountRequested) }, modifier = Modifier.fillMaxWidth().height(52.dp)) { Text("🔵 Report to FBI / IC3", fontSize = 15.sp) }
                Spacer(Modifier.height(8.dp))
                OutlinedButton(onClick = { vm.shareReport() }, modifier = Modifier.fillMaxWidth().height(52.dp)) { Text("📤 Share Report Summary", fontSize = 15.sp) }
                if (submitted) { Spacer(Modifier.height(16.dp)); Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF1B5E20).copy(alpha = 0.2f)), modifier = Modifier.fillMaxWidth()) { Text("✅ Report submitted! Thank you for helping protect others.", modifier = Modifier.padding(12.dp), color = Color(0xFF81C784)) } }
            } ?: Box(Modifier.fillMaxWidth().padding(32.dp), contentAlignment = androidx.compose.ui.Alignment.Center) { CircularProgressIndicator() }
        }
    }
}

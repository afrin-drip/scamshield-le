package com.scamshield.le.ui.settings

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.scamshield.le.viewmodel.SettingsViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(onBack: () -> Unit, onManageFamily: () -> Unit, vm: SettingsViewModel = hiltViewModel()) {
    val passiveDetection by vm.passiveDetection.collectAsState()
    val familyMode by vm.familyMode.collectAsState()
    val alertSound by vm.alertSound.collectAsState()
    val alertVibration by vm.alertVibration.collectAsState()
    val riskThreshold by vm.riskThreshold.collectAsState()
    Scaffold(topBar = { TopAppBar(title = { Text("Settings") }, navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, "Back") } }) }) { padding ->
        Column(Modifier.fillMaxSize().padding(padding).padding(horizontal = 16.dp).verticalScroll(rememberScrollState())) {
            Spacer(Modifier.height(8.dp))
            SectionHeader("Detection")
            SettingRow("Passive Detection", "Auto-monitor all incoming calls without tapping 'Start Monitoring'", passiveDetection) { vm.setPassiveDetection(it) }
            if (passiveDetection) { Card(modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp), colors = CardDefaults.cardColors(containerColor = Color(0xFFF57F17).copy(alpha = 0.15f))) { Text("⚠️ Passive detection captures audio from all calls. Check your state's call recording laws before enabling.", style = MaterialTheme.typography.bodySmall, modifier = Modifier.padding(12.dp), color = Color(0xFFF57F17)) } }
            Spacer(Modifier.height(4.dp))
            Text("Alert Threshold: $riskThreshold", fontWeight = FontWeight.Medium)
            Text("Fire alert when risk score reaches this level", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
            Slider(value = riskThreshold.toFloat(), onValueChange = { vm.setRiskThreshold(it.toInt()) }, valueRange = 40f..100f, steps = 5, modifier = Modifier.fillMaxWidth())
            Spacer(Modifier.height(16.dp)); HorizontalDivider(); Spacer(Modifier.height(16.dp))
            SectionHeader("Alerts")
            SettingRow("Sound Alert", "Play spoken warning when scam detected", alertSound) { vm.setAlertSound(it) }
            SettingRow("Vibration Alert", "Vibrate phone when scam detected", alertVibration) { vm.setAlertVibration(it) }
            Spacer(Modifier.height(16.dp)); HorizontalDivider(); Spacer(Modifier.height(16.dp))
            SectionHeader("Family Protection")
            SettingRow("Family Mode", "Protect family members from scam calls", familyMode) { vm.setFamilyMode(it) }
            if (familyMode) { Button(onClick = onManageFamily, modifier = Modifier.fillMaxWidth()) { Text("Manage Family Members") } }
            Spacer(Modifier.height(32.dp))
        }
    }
}
@Composable fun SectionHeader(title: String) { Text(title, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary, modifier = Modifier.padding(bottom = 8.dp)) }
@Composable fun SettingRow(title: String, subtitle: String, checked: Boolean, onToggle: (Boolean) -> Unit) { Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) { Column(Modifier.weight(1f)) { Text(title, fontWeight = FontWeight.Medium); Text(subtitle, style = MaterialTheme.typography.bodySmall, color = Color.Gray) }; Switch(checked = checked, onCheckedChange = onToggle) }; Spacer(Modifier.height(4.dp)) }

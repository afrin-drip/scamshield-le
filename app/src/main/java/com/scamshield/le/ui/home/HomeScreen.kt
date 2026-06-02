package com.scamshield.le.ui.home
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(onStartMonitoring: () -> Unit, onViewHistory: () -> Unit, onSettings: () -> Unit = {}) {
    Scaffold(topBar = { TopAppBar(title = { Text("ScamShield LE") }, actions = { IconButton(onClick = onSettings) { Icon(Icons.Default.Settings, "Settings") } }) }) { padding ->
        Column(Modifier.fillMaxSize().padding(padding).padding(24.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
            Text("🚨", fontSize = 64.sp); Spacer(Modifier.height(16.dp))
            Text("ScamShield LE", style = MaterialTheme.typography.headlineLarge, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
            Spacer(Modifier.height(8.dp))
            Text("Real-time law enforcement impersonation scam detection", style = MaterialTheme.typography.bodyMedium, textAlign = TextAlign.Center, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
            Spacer(Modifier.height(48.dp))
            Button(onClick = onStartMonitoring, modifier = Modifier.fillMaxWidth().height(56.dp)) { Text("Start Monitoring", fontSize = 18.sp, fontWeight = FontWeight.SemiBold) }
            Spacer(Modifier.height(16.dp))
            OutlinedButton(onClick = onViewHistory, modifier = Modifier.fillMaxWidth().height(56.dp)) { Text("View Incident History", fontSize = 16.sp) }
            Spacer(Modifier.height(48.dp))
            Card(Modifier.fillMaxWidth()) { Column(Modifier.padding(16.dp)) { Text("Key Rule", fontWeight = FontWeight.Bold); Spacer(Modifier.height(4.dp)); Text("Real law enforcement will NEVER demand immediate payment over the phone to avoid arrest.", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.error) } }
        }
    }
}

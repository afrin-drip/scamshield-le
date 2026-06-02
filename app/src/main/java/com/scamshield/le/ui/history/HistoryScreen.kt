package com.scamshield.le.ui.history

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.scamshield.le.data.model.Incident
import com.scamshield.le.viewmodel.HistoryViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HistoryScreen(onBack: () -> Unit, onReport: (Long) -> Unit = {}, vm: HistoryViewModel = hiltViewModel()) {
    val incidents by vm.incidents.collectAsState(initial = emptyList())
    Scaffold(topBar = {
        TopAppBar(title = { Text("Incident History") },
            navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, "Back") } })
    }) { padding ->
        if (incidents.isEmpty()) {
            Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                Text("No incidents recorded yet.", color = Color.Gray)
            }
        } else {
            LazyColumn(Modifier.fillMaxSize().padding(padding).padding(horizontal = 16.dp)) {
                items(incidents, key = { it.id }) { incident ->
                    IncidentCard(incident = incident, onDelete = { vm.delete(incident.id) }, onReport = { onReport(incident.id) })
                    Spacer(Modifier.height(8.dp))
                }
            }
        }
    }
}

@Composable
fun IncidentCard(incident: Incident, onDelete: () -> Unit, onReport: () -> Unit) {
    Card(Modifier.fillMaxWidth()) {
        Column(Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(incident.riskLevel, color = Color(incident.riskBadgeColor()), fontWeight = FontWeight.Bold)
                Spacer(Modifier.weight(1f))
                Text("Score: ${incident.totalScore}", style = MaterialTheme.typography.labelSmall)
            }
            Spacer(Modifier.height(4.dp))
            Text(incident.formattedDate(), style = MaterialTheme.typography.bodySmall, color = Color.Gray)
            if (incident.signalsDetected.isNotEmpty()) {
                Spacer(Modifier.height(4.dp))
                Text(incident.signalsDetected.joinToString(" • "), style = MaterialTheme.typography.bodySmall)
            }
            Spacer(Modifier.height(8.dp))
            Row {
                TextButton(onClick = onReport, modifier = Modifier.weight(1f)) {
                    Text("Report", color = MaterialTheme.colorScheme.primary)
                }
                TextButton(onClick = onDelete, modifier = Modifier.weight(1f)) {
                    Text("Delete", color = MaterialTheme.colorScheme.error)
                }
            }
        }
    }
}

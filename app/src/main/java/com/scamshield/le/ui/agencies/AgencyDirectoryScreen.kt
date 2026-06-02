package com.scamshield.le.ui.agencies

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.OpenInBrowser
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.scamshield.le.data.model.Agency
import com.scamshield.le.data.model.AgencyCategory
import com.scamshield.le.viewmodel.AgencyViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AgencyDirectoryScreen(onBack: () -> Unit, vm: AgencyViewModel = hiltViewModel()) {
    val agencies by vm.agencies.collectAsState()
    val selectedCategory by vm.selectedCategory.collectAsState()
    Scaffold(topBar = {
        TopAppBar(title = { Text("Verified Agency Directory") },
            navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, "Back") } })
    }) { padding ->
        Column(Modifier.fillMaxSize().padding(padding)) {
            ScrollableTabRow(selectedTabIndex = AgencyCategory.values().indexOf(selectedCategory).coerceAtLeast(0), modifier = Modifier.fillMaxWidth()) {
                listOf(null to "All").plus(AgencyCategory.values().map { it to it.label() }).forEach { (cat, label) ->
                    Tab(selected = selectedCategory == cat, onClick = { vm.selectCategory(cat) }, text = { Text(label, fontSize = 12.sp) })
                }
            }
            Spacer(Modifier.height(8.dp))
            Card(modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 4.dp), colors = CardDefaults.cardColors(containerColor = Color(0xFF1A237E).copy(alpha = 0.15f))) {
                Text("Real agencies never call demanding immediate payment. If in doubt, hang up and call the number listed here.", style = MaterialTheme.typography.bodySmall, modifier = Modifier.padding(12.dp), color = Color(0xFF64B5F6))
            }
            Spacer(Modifier.height(8.dp))
            LazyColumn(Modifier.fillMaxSize().padding(horizontal = 16.dp)) {
                items(agencies) { agency ->
                    AgencyCard(agency = agency, onCall = { vm.callAgency(agency.phone) }, onWebsite = { vm.openWebsite(agency.website) })
                    Spacer(Modifier.height(8.dp))
                }
            }
        }
    }
}

@Composable
fun AgencyCard(agency: Agency, onCall: () -> Unit, onWebsite: () -> Unit) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text(agency.shortName, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                    Text(agency.name, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                }
                AssistChip(onClick = {}, label = { Text(agency.category.label(), fontSize = 10.sp) })
            }
            Spacer(Modifier.height(4.dp))
            Text(agency.description, style = MaterialTheme.typography.bodySmall)
            Spacer(Modifier.height(8.dp))
            Row {
                Button(onClick = onCall, modifier = Modifier.weight(1f)) { Icon(Icons.Default.Call, null, modifier = Modifier.size(16.dp)); Spacer(Modifier.width(4.dp)); Text(agency.phone, fontSize = 12.sp) }
                Spacer(Modifier.width(8.dp))
                OutlinedButton(onClick = onWebsite, modifier = Modifier.weight(1f)) { Icon(Icons.Default.OpenInBrowser, null, modifier = Modifier.size(16.dp)); Spacer(Modifier.width(4.dp)); Text("Website", fontSize = 12.sp) }
            }
        }
    }
}

fun AgencyCategory.label() = when (this) {
    AgencyCategory.FEDERAL_LAW_ENFORCEMENT -> "Federal LE"
    AgencyCategory.STATE_LAW_ENFORCEMENT -> "State LE"
    AgencyCategory.COURT_SYSTEM -> "Courts"
    AgencyCategory.CONSUMER_PROTECTION -> "Consumer"
    AgencyCategory.REPORT_FRAUD -> "Report Fraud"
}

package com.scamshield.le.ui.simulation

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.scamshield.le.simulation.ScriptType
import com.scamshield.le.simulation.SimulationUiState

@Composable
fun SimulationScreen(
    viewModel: SimulationViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(text = "ScamShield Demo Mode", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onBackground)
        Text(text = "Educational simulation - signal pattern detection training", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        ScriptSelectorRow(selectedScript = uiState.selectedScript, isDisabled = uiState.isRunning, onSelect = { viewModel.selectScript(it) })
        RiskMeter(score = uiState.riskScore)
        AnimatedVisibility(visible = uiState.isComplete, enter = fadeIn() + slideInVertically()) {
            Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer), modifier = Modifier.fillMaxWidth()) {
                Text(text = "Simulation Complete - Final Risk Score: ${uiState.riskScore}/100", modifier = Modifier.padding(12.dp), fontWeight = FontWeight.Bold, textAlign = TextAlign.Center, color = MaterialTheme.colorScheme.onPrimaryContainer)
            }
        }
        if (uiState.detectedSignals.isNotEmpty()) { DetectedSignalsSection(signals = uiState.detectedSignals) }
        TranscriptBox(transcript = uiState.currentTranscript, modifier = Modifier.weight(1f))
        BottomControls(uiState = uiState, onStart = { viewModel.startSimulation() }, onStop = { viewModel.stopSimulation() }, onReset = { viewModel.reset() })
    }
}

@Composable
private fun ScriptSelectorRow(selectedScript: ScriptType, isDisabled: Boolean, onSelect: (ScriptType) -> Unit) {
    Text(text = "Select Scenario", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        items(ScriptType.entries) { scriptType ->
            FilterChip(selected = scriptType == selectedScript, onClick = { if (!isDisabled) onSelect(scriptType) }, label = { Text(scriptType.displayName, fontSize = 12.sp) }, enabled = !isDisabled, colors = FilterChipDefaults.filterChipColors(selectedContainerColor = MaterialTheme.colorScheme.primary, selectedLabelColor = MaterialTheme.colorScheme.onPrimary))
        }
    }
}

@Composable
private fun RiskMeter(score: Int) {
    val animatedProgress by animateFloatAsState(targetValue = score / 100f, animationSpec = tween(600), label = "riskProgress")
    val meterColor by animateColorAsState(targetValue = when { score < 25 -> Color(0xFF4CAF50); score < 50 -> Color(0xFFFFC107); score < 75 -> Color(0xFFFF9800); else -> Color(0xFFF44336) }, animationSpec = tween(600), label = "meterColor")
    val riskLabel = when { score < 25 -> "LOW RISK"; score < 50 -> "MODERATE RISK"; score < 75 -> "HIGH RISK"; else -> "CRITICAL RISK" }
    Card(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface), elevation = CardDefaults.cardElevation(2.dp)) {
        Column(modifier = Modifier.fillMaxWidth().padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(text = "Risk Score", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Box(contentAlignment = Alignment.Center) {
                CircularProgressIndicator(progress = { animatedProgress }, modifier = Modifier.size(120.dp), color = meterColor, strokeWidth = 10.dp, trackColor = MaterialTheme.colorScheme.surfaceVariant, strokeCap = StrokeCap.Round)
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = "$score", fontSize = 36.sp, fontWeight = FontWeight.ExtraBold, color = meterColor)
                    Text(text = "/ 100", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
            Text(text = riskLabel, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = meterColor)
        }
    }
}

@Composable
private fun DetectedSignalsSection(signals: List<String>) {
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text(text = "Detected Signals (${signals.size})", style = MaterialTheme.typography.labelMedium, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
        LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            items(signals) { signal ->
                AnimatedVisibility(visible = true, enter = fadeIn() + slideInVertically()) {
                    Surface(shape = RoundedCornerShape(16.dp), color = MaterialTheme.colorScheme.errorContainer, modifier = Modifier.wrapContentWidth()) {
                        Text(text = signal, modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp), fontSize = 11.sp, color = MaterialTheme.colorScheme.onErrorContainer, fontWeight = FontWeight.Medium)
                    }
                }
            }
        }
    }
}

@Composable
private fun TranscriptBox(transcript: String, modifier: Modifier = Modifier) {
    val scrollState = rememberScrollState()
    LaunchedEffect(transcript) { scrollState.animateScrollTo(scrollState.maxValue) }
    Card(modifier = modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface), elevation = CardDefaults.cardElevation(1.dp)) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(text = "Transcript", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(Modifier.height(6.dp))
            Box(modifier = Modifier.fillMaxSize().verticalScroll(scrollState)) {
                if (transcript.isEmpty()) {
                    Text(text = "Transcript will appear here during simulation...", color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f), fontStyle = androidx.compose.ui.text.font.FontStyle.Italic, fontSize = 13.sp)
                } else {
                    Text(text = transcript, fontSize = 13.sp, fontFamily = FontFamily.Monospace, lineHeight = 20.sp, color = MaterialTheme.colorScheme.onSurface)
                }
            }
        }
    }
}

@Composable
private fun BottomControls(uiState: SimulationUiState, onStart: () -> Unit, onStop: () -> Unit, onReset: () -> Unit) {
    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
        Button(onClick = if (uiState.isRunning) onStop else onStart, modifier = Modifier.weight(1f), enabled = !uiState.isComplete || uiState.isRunning, colors = ButtonDefaults.buttonColors(containerColor = if (uiState.isRunning) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary)) {
            Text(if (uiState.isRunning) "Stop" else "Start Simulation")
        }
        OutlinedButton(onClick = onReset, modifier = Modifier.weight(1f)) { Text("Reset") }
    }
}

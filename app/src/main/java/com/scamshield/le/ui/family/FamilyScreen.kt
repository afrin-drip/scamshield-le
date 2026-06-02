package com.scamshield.le.ui.family
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.scamshield.le.data.model.FamilyMember
import com.scamshield.le.viewmodel.FamilyViewModel
@OptIn(ExperimentalMaterial3Api::class)
@Composable fun FamilyScreen(onBack: () -> Unit, vm: FamilyViewModel = hiltViewModel()) {
    val members by vm.members.collectAsState(initial = emptyList())
    var showAddDialog by remember { mutableStateOf(false) }
    Scaffold(topBar = { TopAppBar(title = { Text("Family Protection") }, navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, "Back") } }, actions = { IconButton(onClick = { showAddDialog = true }) { Icon(Icons.Default.PersonAdd, "Add") } }) }) { padding ->
        Column(Modifier.fillMaxSize().padding(padding)) {
            Card(modifier = Modifier.fillMaxWidth().padding(16.dp), colors = CardDefaults.cardColors(containerColor = Color(0xFF1A237E).copy(alpha = 0.12f))) { Column(Modifier.padding(16.dp)) { Text("Protect Your Family", fontWeight = FontWeight.Bold); Spacer(Modifier.height(4.dp)); Text("Add family members to monitor their calls. When a scam is detected on their line, you'll receive an alert.", style = MaterialTheme.typography.bodySmall, color = Color.Gray) } }
            if (members.isEmpty()) { Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { Column(horizontalAlignment = Alignment.CenterHorizontally) { Icon(Icons.Default.FamilyRestroom, null, modifier = Modifier.size(64.dp), tint = Color.Gray); Spacer(Modifier.height(8.dp)); Text("No family members added yet", color = Color.Gray); Text("Tap + to protect a family member", style = MaterialTheme.typography.bodySmall, color = Color.Gray) } } }
            else { LazyColumn(Modifier.fillMaxSize().padding(horizontal = 16.dp)) { items(members, key = { it.id }) { member -> FamilyMemberCard(member = member, onToggleProtect = { vm.toggleProtect(member) }, onToggleNotify = { vm.toggleNotify(member) }, onRemove = { vm.removeMember(member.id) }); Spacer(Modifier.height(8.dp)) } } }
        }
    }
    if (showAddDialog) { AddMemberDialog(onDismiss = { showAddDialog = false }, onAdd = { name, phone, rel -> vm.addMember(name, phone, rel); showAddDialog = false }) }
}
@Composable fun FamilyMemberCard(member: FamilyMember, onToggleProtect: () -> Unit, onToggleNotify: () -> Unit, onRemove: () -> Unit) {
    Card(Modifier.fillMaxWidth()) { Column(Modifier.padding(16.dp)) { Row(verticalAlignment = Alignment.CenterVertically) { Icon(Icons.Default.Person, null, tint = MaterialTheme.colorScheme.primary); Spacer(Modifier.width(8.dp)); Column(Modifier.weight(1f)) { Text(member.name, fontWeight = FontWeight.Bold); Text(member.relationship, style = MaterialTheme.typography.bodySmall, color = Color.Gray); Text(member.phoneNumber, style = MaterialTheme.typography.bodySmall, color = Color.Gray) }; IconButton(onClick = onRemove) { Icon(Icons.Default.Delete, "Remove", tint = MaterialTheme.colorScheme.error) } }; Spacer(Modifier.height(8.dp)); Row(verticalAlignment = Alignment.CenterVertically) { Text("Monitor calls", Modifier.weight(1f), style = MaterialTheme.typography.bodySmall); Switch(checked = member.isProtected, onCheckedChange = { onToggleProtect() }) }; Row(verticalAlignment = Alignment.CenterVertically) { Text("Notify me on scam", Modifier.weight(1f), style = MaterialTheme.typography.bodySmall); Switch(checked = member.notifyOnScam, onCheckedChange = { onToggleNotify() }) } } }
}
@Composable fun AddMemberDialog(onDismiss: () -> Unit, onAdd: (String, String, String) -> Unit) {
    var name by remember { mutableStateOf("") }; var phone by remember { mutableStateOf("") }; var relationship by remember { mutableStateOf("") }
    AlertDialog(onDismissRequest = onDismiss, title = { Text("Add Family Member") }, text = { Column { OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Name") }, modifier = Modifier.fillMaxWidth(), singleLine = true); Spacer(Modifier.height(8.dp)); OutlinedTextField(value = phone, onValueChange = { phone = it }, label = { Text("Phone Number") }, modifier = Modifier.fillMaxWidth(), singleLine = true); Spacer(Modifier.height(8.dp)); OutlinedTextField(value = relationship, onValueChange = { relationship = it }, label = { Text("Relationship") }, modifier = Modifier.fillMaxWidth(), singleLine = true) } }, confirmButton = { TextButton(onClick = { if (name.isNotBlank() && phone.isNotBlank()) onAdd(name, phone, relationship) }) { Text("Add") } }, dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } })
}

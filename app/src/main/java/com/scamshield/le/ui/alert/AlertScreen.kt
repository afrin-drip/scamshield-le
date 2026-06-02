package com.scamshield.le.ui.alert

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.scamshield.le.ui.theme.ScamRed

@Composable
fun AlertScreen(
    onDismiss: () -> Unit,
    onViewAgencies: () -> Unit = {},
    onReportScam: () -> Unit = {}
) {
    Box(Modifier.fillMaxSize().background(ScamRed), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(32.dp)) {
            Text("🚨", fontSize = 80.sp)
            Spacer(Modifier.height(16.dp))
            Text("SCAM ALERT", fontSize = 36.sp, fontWeight = FontWeight.ExtraBold, color = Color.White)
            Spacer(Modifier.height(24.dp))
            Text("Law enforcement impersonation scam detected.",
                fontSize = 18.sp, color = Color.White, textAlign = TextAlign.Center, fontWeight = FontWeight.SemiBold)
            Spacer(Modifier.height(16.dp))
            Text("Real law enforcement does NOT demand immediate payment over the phone to avoid arrest.",
                fontSize = 15.sp, color = Color.White.copy(alpha = 0.9f), textAlign = TextAlign.Center)
            Spacer(Modifier.height(40.dp))
            Button(onClick = onDismiss, modifier = Modifier.fillMaxWidth().height(56.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = ScamRed)) {
                Text("Hang Up & Dismiss", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(Modifier.height(12.dp))
            OutlinedButton(onClick = onViewAgencies, modifier = Modifier.fillMaxWidth().height(48.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White)) {
                Text("📞 Call Verified Agency Number", fontSize = 13.sp)
            }
            Spacer(Modifier.height(8.dp))
            OutlinedButton(onClick = onReportScam, modifier = Modifier.fillMaxWidth().height(48.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White)) {
                Text("🏛 Report to FTC / FBI", fontSize = 13.sp)
            }
        }
    }
}

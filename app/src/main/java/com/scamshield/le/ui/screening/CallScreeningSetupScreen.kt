package com.scamshield.le.ui.screening

import android.app.Activity
import android.app.role.RoleManager
import android.content.Intent
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.RequiresApi
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel

/**
 * Compose screen that guides the user through enabling ScamShield as the
 * default call screening app (requires API 29+).
 */
@RequiresApi(Build.VERSION_CODES.Q)
@Composable
fun CallScreeningSetupScreen(
    viewModel: CallScreeningSetupViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val context = LocalContext.current

    val roleRequestLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        viewModel.onRoleRequestResult(result.resultCode == Activity.RESULT_OK)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = if (uiState.isDefaultScreeningApp)
                androidx.compose.material.icons.Icons.Filled.Shield
            else
                androidx.compose.material.icons.Icons.Outlined.Shield,
            contentDescription = null,
            tint = if (uiState.isDefaultScreeningApp)
                MaterialTheme.colorScheme.primary
            else
                MaterialTheme.colorScheme.error,
            modifier = Modifier.size(72.dp)
        )

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = if (uiState.isDefaultScreeningApp)
                "ScamShield is active"
            else
                "ScamShield is not set as the default screening app",
            style = MaterialTheme.typography.headlineSmall,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = if (uiState.isDefaultScreeningApp)
                "Incoming calls are being screened for scam numbers. You will be protected automatically."
            else
                "To block scam calls automatically, ScamShield needs to be set as your phone's default call screening app.",
            style = MaterialTheme.typography.bodyMedium,
            textAlign = TextAlign.Center,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        if (!uiState.isDefaultScreeningApp) {
            Spacer(modifier = Modifier.height(32.dp))

            Text(
                text = "How to enable:\n1. Tap the button below.\n2. In the system dialog, select ScamShield.\n3. Tap Allow.",
                style = MaterialTheme.typography.bodySmall,
                textAlign = TextAlign.Center,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = {
                    val intent = viewModel.buildRoleRequestIntent(context)
                    if (intent != null) roleRequestLauncher.launch(intent)
                },
                enabled = !uiState.isLoading
            ) {
                if (uiState.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(18.dp),
                        strokeWidth = 2.dp,
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                }
                Text("Set as Default Screening App")
            }
        }

        uiState.errorMessage?.let { error ->
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = error,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall,
                textAlign = TextAlign.Center
            )
        }
    }

    LaunchedEffect(Unit) { viewModel.refreshStatus() }
}

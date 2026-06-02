package com.scamshield.le.ui.screening

import android.app.Activity
import android.app.role.RoleManager
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.annotation.RequiresApi
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class CallScreeningSetupUiState(
    val isDefaultScreeningApp: Boolean = false,
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)

/**
 * Hilt ViewModel for the call screening setup screen.
 * Manages RoleManager interactions and exposes setup status via StateFlow.
 */
@RequiresApi(Build.VERSION_CODES.Q)
@HiltViewModel
class CallScreeningSetupViewModel @Inject constructor() : ViewModel() {

    private val _uiState = MutableStateFlow(CallScreeningSetupUiState())
    val uiState: StateFlow<CallScreeningSetupUiState> = _uiState.asStateFlow()

    /**
     * Returns true if ScamShield is the current default call screening app.
     */
    fun isDefaultScreeningApp(context: Context): Boolean {
        val roleManager = context.getSystemService(RoleManager::class.java) ?: return false
        return roleManager.isRoleHeld(RoleManager.ROLE_CALL_SCREENING)
    }

    /**
     * Refreshes the current screening role status.
     * Call this from LaunchedEffect or onResume.
     */
    fun refreshStatus(context: Context? = null) {
        if (context != null) {
            _uiState.update { it.copy(isDefaultScreeningApp = isDefaultScreeningApp(context), errorMessage = null) }
        }
    }

    // Overload for Compose usage where context is provided via LaunchedEffect
    fun refreshStatus() {
        // Status will be refreshed when context is available via the Composable
    }

    /**
     * Builds the intent to request the ROLE_CALL_SCREENING role from the system.
     * Returns null if the device does not support the role.
     */
    fun buildRoleRequestIntent(context: Context): Intent? {
        val roleManager = context.getSystemService(RoleManager::class.java) ?: return null
        return if (!roleManager.isRoleHeld(RoleManager.ROLE_CALL_SCREENING)) {
            roleManager.createRequestRoleIntent(RoleManager.ROLE_CALL_SCREENING)
        } else null
    }

    /**
     * Request the default call screening role from the given Activity.
     * The result should be handled via ActivityResultLauncher in the Composable.
     */
    fun requestDefaultRole(activity: Activity) {
        val roleManager = activity.getSystemService(RoleManager::class.java) ?: run {
            _uiState.update { it.copy(errorMessage = "RoleManager not available on this device.") }
            return
        }
        if (roleManager.isRoleHeld(RoleManager.ROLE_CALL_SCREENING)) {
            _uiState.update { it.copy(isDefaultScreeningApp = true) }
            return
        }
        _uiState.update { it.copy(isLoading = true, errorMessage = null) }
        val intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_CALL_SCREENING)
        activity.startActivityForResult(intent, REQUEST_CODE_CALL_SCREENING_ROLE)
    }

    /**
     * Call this with the result from the role request activity.
     */
    fun onRoleRequestResult(granted: Boolean) {
        _uiState.update {
            it.copy(
                isDefaultScreeningApp = granted,
                isLoading = false,
                errorMessage = if (!granted) "Permission not granted. Please try again." else null
            )
        }
    }

    companion object {
        const val REQUEST_CODE_CALL_SCREENING_ROLE = 1001
    }
}

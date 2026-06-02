package com.scamshield.le.navigation

import android.content.Intent
import android.net.Uri
import android.util.Log
import androidx.navigation.NavController
import androidx.navigation.NavDeepLinkRequest
import androidx.navigation.NavOptions

object DeepLinkHandler {
    private const val TAG = "DeepLinkHandler"
    const val SCHEME = "scamshield"

    fun buildRequest(uri: Uri): NavDeepLinkRequest? {
        if (uri.scheme != SCHEME) { Log.w(TAG, "Bad scheme: ${uri.scheme}"); return null }
        return when (uri.host) {
            "alert"      -> NavDeepLinkRequest.Builder.fromUri(uri).build()
            "incident"   -> uri.pathSegments.firstOrNull()?.let { id ->
                NavDeepLinkRequest.Builder.fromUri(Uri.parse("scamshield://incident/${id}")).build()
            }.also { if (it == null) Log.w(TAG, "Incident URI missing ID: ${uri}") }
            "history"    -> NavDeepLinkRequest.Builder.fromUri(Uri.parse("scamshield://history")).build()
            "monitoring" -> NavDeepLinkRequest.Builder.fromUri(Uri.parse("scamshield://monitoring")).build()
            else         -> { Log.w(TAG, "Unknown host: ${uri.host}"); null }
        }
    }

    fun handleIntent(intent: Intent?, navController: NavController): Boolean {
        val request = intent?.data?.let { buildRequest(it) } ?: return false
        return try {
            navController.navigate(request,
                NavOptions.Builder().setLaunchSingleTop(true).setRestoreState(true).build())
            true
        } catch (e: IllegalArgumentException) { Log.e(TAG, "Navigation failed", e); false }
    }

    fun extractAlertId(uri: Uri)    = uri.getQueryParameter("alertId")
    fun extractIncidentId(uri: Uri) = uri.pathSegments.firstOrNull()
}
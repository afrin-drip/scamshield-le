package com.scamshield.le.ui.navigation
import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.scamshield.le.ui.agencies.AgencyDirectoryScreen
import com.scamshield.le.ui.alert.AlertScreen
import com.scamshield.le.ui.family.FamilyScreen
import com.scamshield.le.ui.history.HistoryScreen
import com.scamshield.le.ui.home.HomeScreen
import com.scamshield.le.ui.monitoring.MonitoringScreen
import com.scamshield.le.ui.report.ReportScreen
import com.scamshield.le.ui.settings.SettingsScreen
import com.scamshield.le.ui.analytics.AnalyticsScreen
object Routes { const val HOME = "home"; const val MONITORING = "monitoring"; const val ALERT = "alert"; const val HISTORY = "history"; const val AGENCIES = "agencies"; const val SETTINGS = "settings"; const val FAMILY = "family"; const val REPORT = "report/{incidentId}"; fun report(id: Long) = "report/$id" }
@Composable fun AppNavigation() {
    val nav = rememberNavController()
    NavHost(nav, startDestination = Routes.HOME) {
        composable(Routes.HOME) { HomeScreen(onStartMonitoring = { nav.navigate(Routes.MONITORING) }, onViewHistory = { nav.navigate(Routes.HISTORY) }, onSettings = { nav.navigate(Routes.SETTINGS) }) }
        composable(Routes.MONITORING) { MonitoringScreen(onAlertTriggered = { nav.navigate(Routes.ALERT) }, onStop = { nav.popBackStack() }) }
        composable(Routes.ALERT { AlertScreen(onDismiss = { nav.navigate(Routes.HOME) { popUpTo(Routes.HOME) { inclusive = true } } }, onViewAgencies = { nav.navigate(Routes.AGENCIES) }, onReportScam = { nav.navigate(Routes.HOME) { popUpTo(Routes.HOME) { inclusive = true } } }) }
        composable(Routes.HISTORY) { HistoryScreen(onBack = { nav.popBackStack() }, onReport = { id -> nav.navigate(Routes.report(id)) }) }
        composable(Routes.AGENCIES) { AgencyDirectoryScreen(onBack = { nav.popBackStack() }) }
        composable(Routes.SETTINGS) { SettingsScreen(onBack = { nav.popBackStack() }, onManageFamily = { nav.navigate(Routes.FAMILY) }) }
        composable(Routes.FAMILY) { FamilyScreen(onBack = { nav.popBackStack() }) }
        composable(Routes.REPORT, arguments = listOf(navArgument("incidentId") { type = NavType.LongType })) { val id = it.arguments?.getLong("incidentId") ?: return@composable; ReportScreen(incidentId = id, onBack = { nav.popBackStack() }) }
    }
}
        composable("analytics") {
            AnalyticsScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }


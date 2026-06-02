package com.scamshield.le.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import androidx.navigation.navDeepLink
import com.scamshield.le.ui.screens.AlertScreen
import com.scamshield.le.ui.screens.HistoryScreen
import com.scamshield.le.ui.screens.HomeScreen
import com.scamshield.le.ui.screens.IncidentDetailScreen
import com.scamshield.le.ui.screens.MonitoringScreen

object Destinations {
    const val HOME            = "home"
    const val ALERT           = "alert?alertId={alertId}"
    const val INCIDENT_DETAIL = "incident/{incidentId}"
    const val HISTORY         = "history"
    const val MONITORING      = "monitoring"
}

@Composable
fun AppNavigation(navController: NavHostController) {
    NavHost(navController = navController, startDestination = Destinations.HOME) {

        composable(Destinations.HOME) {
            HomeScreen(navController = navController)
        }

        composable(
            route = Destinations.ALERT,
            arguments = listOf(navArgument("alertId") { type = NavType.StringType; nullable = true; defaultValue = null }),
            deepLinks = listOf(
                navDeepLink { uriPattern = "scamshield://alert?alertId={alertId}" },
                navDeepLink { uriPattern = "scamshield://alert" }
            )
        ) { back ->
            AlertScreen(navController = navController, alertId = back.arguments?.getString("alertId"))
        }

        composable(
            route = Destinations.INCIDENT_DETAIL,
            arguments = listOf(navArgument("incidentId") { type = NavType.StringType }),
            deepLinks = listOf(navDeepLink { uriPattern = "scamshield://incident/{incidentId}" })
        ) { back ->
            IncidentDetailScreen(navController = navController,
                incidentId = back.arguments?.getString("incidentId") ?: "")
        }

        composable(
            route = Destinations.HISTORY,
            deepLinks = listOf(navDeepLink { uriPattern = "scamshield://history" })
        ) {
            HistoryScreen(navController = navController)
        }

        composable(
            route = Destinations.MONITORING,
            deepLinks = listOf(navDeepLink { uriPattern = "scamshield://monitoring" })
        ) {
            MonitoringScreen(navController = navController)
        }
    }
}
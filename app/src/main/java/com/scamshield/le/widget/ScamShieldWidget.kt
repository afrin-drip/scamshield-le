package com.scamshield.le.widget

import android.content.Context
import android.content.Intent
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.action.actionStartActivity
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.*
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import com.scamshield.le.MainActivity
import dagger.hilt.android.EntryPointAccessors
import java.text.SimpleDateFormat
import java.util.*

class ScamShieldWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val dataStore = EntryPointAccessors.fromApplication(
            context.applicationContext,
            WidgetEntryPoint::class.java
        ).widgetDataStore()

        val isActive = dataStore.isPassiveActive
        val lastDate = dataStore.lastIncidentDate
        val dateText = if (lastDate == 0L) "No scams detected"
        else "Last: " + SimpleDateFormat("MMM d, yyyy", Locale.getDefault()).format(Date(lastDate))

        provideContent {
            WidgetContent(isActive, dateText, context)
        }
    }
}

@Composable
fun WidgetContent(isActive: Boolean, dateText: String, context: Context) {
    val bgColor = Color(0xFF1E1E1E)
    val redAccent = Color(0xFFD32F2F)
    val greenColor = Color(0xFF4CAF50)
    val orangeColor = Color(0xFFFF9800)
    val whiteColor = Color(0xFFFFFFFF)
    val grayColor = Color(0xFFAAAAAA)

    val launchIntent = Intent(context, MainActivity::class.java).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK
    }

    Box(
        modifier = GlanceModifier
            .fillMaxSize()
            .background(ColorProvider(bgColor))
            .clickable(actionStartActivity(launchIntent))
    ) {
        Column(
            modifier = GlanceModifier
                .fillMaxSize()
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.Vertical.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.Vertical.CenterVertically) {
                Text(
                    text = "🛡️ ScamShield LE",
                    style = TextStyle(
                        color = ColorProvider(whiteColor),
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                )
                Spacer(GlanceModifier.defaultWeight())
                Text(
                    text = if (isActive) "● PROTECTED" else "● TAP TO MONITOR",
                    style = TextStyle(
                        color = ColorProvider(if (isActive) greenColor else orangeColor),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                )
            }
            Spacer(GlanceModifier.height(4.dp))
            Text(
                text = dateText,
                style = TextStyle(
                    color = ColorProvider(grayColor),
                    fontSize = 11.sp
                )
            )
        }
    }
}

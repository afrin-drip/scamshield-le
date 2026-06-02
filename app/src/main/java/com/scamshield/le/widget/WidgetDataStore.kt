package com.scamshield.le.widget
import android.content.Context
import javax.inject.Inject; import javax.inject.Singleton
@Singleton class WidgetDataStore @Inject constructor(private val context: Context) {
    private val prefs get() = context.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
    var lastIncidentDate: Long get() = prefs.getLong("last_incident_date", 0L); set(v) = prefs.edit().putLong("last_incident_date", v).apply()
    var lastIncidentScore: Int get() = prefs.getInt("last_incident_score", 0); set(v) = prefs.edit().putInt("last_incident_score", v).apply()
    var isPassiveActive: Boolean get() = prefs.getBoolean("passive_active", false); set(v) = prefs.edit().putBoolean("passive_active", v).apply()
}
package com.scamshield.le.data.repository
import android.content.Context; import javax.inject.Inject; import javax.inject.Singleton
@Singleton class SettingsRepository @Inject constructor(context: Context) {
    private val prefs = context.getSharedPreferences("scamshield_prefs", Context.MODE_PRIVATE)
    var passiveDetectionEnabled: Boolean get() = prefs.getBoolean("passive_detection", false); set(v) = prefs.edit().putBoolean("passive_detection", v).apply()
    var familyModeEnabled: Boolean get() = prefs.getBoolean("family_mode", false); set(v) = prefs.edit().putBoolean("family_mode", v).apply()
    var alertSoundEnabled: Boolean get() = prefs.getBoolean("alert_sound", true); set(v) = prefs.edit().putBoolean("alert_sound", v).apply()
    var alertVibrationEnabled: Boolean get() = prefs.getBoolean("alert_vibration", true); set(v) = prefs.edit().putBoolean("alert_vibration", v).apply()
    var minimumRiskThreshold: Int get() = prefs.getInt("risk_threshold", 90); set(v) = prefs.edit().putInt("risk_threshold", v).apply()
    var guardianPhoneNumber: String get() = prefs.getString("guardian_phone", "") ?: ""; set(v) = prefs.edit().putString("guardian_phone", v).apply()
    var guardianName: String get() = prefs.getString("guardian_name", "") ?: ""; set(v) = prefs.edit().putString("guardian_name", v).apply()
}

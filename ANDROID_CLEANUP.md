# Android Package Cleanup Notes

## Summary

Three package naming inconsistencies were audited. One was a true duplicate requiring action; two were NOT duplicates and should remain as-is.

---

## 1. `notification/` vs `notifications/` — RESOLVED

**Issue:** Two packages with nearly identical names contained overlapping classes, including two copies of `ScamShieldMessagingService`.

**Winning package:** `com.scamshield.le.notification`
- Referenced in `AndroidManifest.xml`: `android:name=".notification.ScamShieldMessagingService"`
- More complete implementation (handles 3 FCM message types, uses NotificationChannelManager, deep links)

**Action taken:**
- `FamilyNotificationManager.kt` from `notifications/` was **migrated** to `notification/` with updated package declaration
- Files in `notifications/` were **replaced with deprecation stubs**

**Still needed (manual step):**
- Delete `app/src/main/java/com/scamshield/le/notifications/` directory and its two stub files
- OneDrive-synced files cannot be deleted from the build sandbox; delete manually or via `git rm` after cloning

---

## 2. `monitoring/` vs `ui/monitoring/` — NOT A DUPLICATE

These serve different architectural layers:
- `monitoring/` (top-level): infrastructure classes — `AnalyticsTracker`, `CrashReporter`, `PerformanceTracker`
- `ui/monitoring/`: UI layer — `MonitoringScreen.kt`

**No action needed.** The naming follows standard Android architecture separation (data/domain/ui).

---

## 3. `navigation/` vs `ui/navigation/` — NOT A DUPLICATE

- `navigation/` (top-level): `DeepLinkHandler.kt` — resolves incoming deep link URIs
- `ui/navigation/`: `AppNavigation.kt` — Compose navigation graph

**No action needed.** These are complementary, not conflicting.

---

## Final `notification/` Package Contents

| File | Description |
|---|---|
| `FCMTokenManager.kt` | Manages FCM token registration and Firestore sync |
| `FamilyNotificationManager.kt` | Shows local scam alert notifications to family guardians |
| `GuardianNotificationOrchestrator.kt` | Coordinates guardian alert dispatch |
| `NotificationChannelManager.kt` | Creates and manages Android notification channels |
| `ScamShieldMessagingService.kt` | FCM service (registered in manifest) |
| `TwilioSmsManager.kt` | Twilio SMS fallback for alerts |

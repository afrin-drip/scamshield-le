# Firebase Crashlytics & Performance Setup

## Android

### 1. Project-level `build.gradle.kts`

Add the Google Services and Crashlytics Gradle plugins to your root `build.gradle.kts`:

```kotlin
plugins {
    id("com.google.gms.google-services") version "4.4.2" apply false
    id("com.google.firebase.crashlytics") version "3.0.2" apply false
}
```

### 2. `google-services.json`

Download `google-services.json` from the [Firebase Console](https://console.firebase.google.com)
for the **ScamShieldLE** project and place it at `app/google-services.json`.

### 3. App-level `app/build.gradle.kts`

The Crashlytics plugin and Firebase BOM dependencies are already added by this PR.

### 4. Enable Crashlytics in Firebase Console

1. Open Firebase Console → your project → Crashlytics
2. Click **Enable Crashlytics**
3. Build a release build; call `FirebaseCrashlytics.getInstance().crash()` once to send a test event
4. Confirm it appears in the dashboard within ~5 minutes

### 5. ProGuard / R8

The Crashlytics Gradle plugin automatically uploads mapping files. No extra config needed.

---

## iOS

### 1. Add Firebase via Swift Package Manager

In Xcode:

1. **File → Add Package Dependencies…**
2. URL: `https://github.com/firebase/firebase-ios-sdk`
3. Version rule: **Up to Next Major** from `10.0.0`
4. Add to the **ScamShieldLE** target:
   - `FirebaseCrashlytics`
   - `FirebaseAnalytics`
   - `FirebasePerformance`

### 2. `GoogleService-Info.plist`

Download from Firebase Console and drag into the Xcode target (check **Copy items if needed**).

### 3. Initialize in `ScamShieldLEApp.swift`

```swift
import Firebase

@main
struct ScamShieldLEApp: App {
    init() {
        FirebaseApp.configure()
        #if DEBUG
        Crashlytics.crashlytics().setCrashlyticsCollectionEnabled(false)
        #endif
    }
    var body: some Scene { WindowGroup { ContentView() } }
}
```

### 4. Activate `CrashReporter.swift`

Replace all `// TODO:` stubs in `ios/ScamShieldLE/Monitoring/CrashReporter.swift`
with the real Crashlytics calls shown in each comment.

### 5. dSYM Upload Run Script Phase

Xcode → Target → Build Phases → **+** → New Run Script Phase:

```sh
"${BUILD_DIR%/Build/*}/SourcePackages/checkouts/firebase-ios-sdk/Crashlytics/run"
```

Input files:
```
${DWARF_DSYM_FOLDER_PATH}/${DWARF_DSYM_FILE_NAME}/Contents/Resources/DWARF/${TARGET_NAME}
$(SRCROOT)/$(BUILT_PRODUCTS_DIR)/$(INFOPLIST_PATH)
```

---

## Verification Checklist

| Step | Android | iOS |
|------|---------|-----|
| Force test crash | `FirebaseCrashlytics.getInstance().crash()` | `fatalError("test")` |
| Non-fatal event | `CrashReporter.logScamDetected(...)` | `CrashReporter.shared.logScamDetected(...)` |
| Performance trace | `PerformanceTracker.traceScamAnalysis()` | Firebase Performance iOS SDK |
| Analytics event | `AnalyticsTracker.logMonitoringStarted()` | Firebase Analytics iOS SDK |

# ScamShield LE — Shared KMM Module

Kotlin Multiplatform Mobile module providing shared business logic for Android and iOS.

## What's Inside

- **RiskEngine** — Analyzes text for scam signals using keyword detection
- **ScamSignal / RiskAssessment** — Sealed class hierarchy for risk scoring
- **AgencyDirectory** — 10 federal agencies for scam reporting
- **ScamScripts** — 5 realistic scam simulation scripts for training
- **ScamReport** — Shared data model for persisting assessments
- **RiskScoreFormatter** — Utility formatters for UI display

## Usage

### Android

Add to your root `settings.gradle.kts`:
```kotlin
include(":shared")
```

Add to your app's `build.gradle.kts`:
```kotlin
dependencies {
    implementation(project(":shared"))
}
```

### iOS

Build the XCFramework:
```bash
./gradlew :shared:assembleSharedXCFramework
```

Then add `shared/build/XCFrameworks/release/shared.xcframework` to your Xcode project.

### SKIE (Recommended for iOS)

We recommend [SKIE](https://skie.touchlab.co) for improved Swift interop — it transforms Kotlin sealed classes, flows, and coroutines into idiomatic Swift.

Add to `shared/build.gradle.kts`:
```kotlin
plugins {
    id("co.touchlab.skie") version "0.6.2"
}
```

## Example

```kotlin
val result = RiskEngine.analyze("This is the IRS. Pay immediately via gift card or you will be arrested.")
println(result.level)       // CRITICAL
println(result.totalScore)  // 90
println(result.signals)     // [ImpersonationTactic, UrgencyLanguage, PaymentPressure, ThreatLanguage]
```

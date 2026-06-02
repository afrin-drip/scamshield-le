# ScamShield LE — iOS

SwiftUI companion to the Android (Kotlin/Jetpack Compose) app. Detects scam-call patterns in real time using on-device speech recognition.

## Requirements

- Xcode 15+
- iOS 17+ (SwiftData requires iOS 17)
- Physical device for microphone / speech recognition (simulator has limited support)

## Project Structure

```
ios/ScamShieldLE/
├── ScamShieldLEApp.swift
├── ContentView.swift
├── Info.plist
├── Models/
│   ├── ScamSignal.swift        # Signal enum (score, label, icon)
│   ├── RiskAssessment.swift    # Assessment struct + RiskLevel enum
│   ├── Incident.swift          # SwiftData @Model
│   └── Agency.swift            # Agency struct + AgencyDirectory singleton
├── Detection/
│   ├── RiskEngine.swift               # Keyword scoring (port of RiskEngine.kt)
│   ├── SpeechRecognitionManager.swift # SFSpeechRecognizer w/ auto-restart
│   └── CallAnalysisCoordinator.swift  # Orchestrator ObservableObject
├── Views/
│   ├── HomeView.swift
│   ├── MonitoringView.swift    # Live gauge, transcript, signal chips
│   ├── AlertView.swift         # Full-screen alert on high/critical risk
│   ├── AgencyDirectoryView.swift
│   ├── HistoryView.swift
│   └── SettingsView.swift
├── Data/
│   ├── IncidentStore.swift     # ModelContainer singleton
│   └── SettingsStore.swift     # @AppStorage wrappers
├── Alert/
│   └── AlertManager.swift      # Haptics, TTS, local notifications
└── Simulation/
    ├── ScamScripts.swift        # 5 test scenarios
    ├── SimulationViewModel.swift
    └── SimulationView.swift
```

## Setup

1. Open `ios/ScamShieldLE.xcodeproj` in Xcode 15+
2. Set your **Team** in Signing & Capabilities
3. Change **Bundle Identifier** (e.g. `com.yourorg.scamshieldle`)
4. Run on a physical iPhone (iOS 17+)
5. Grant microphone and speech recognition permissions when prompted

## Architecture

| Layer | Technology |
|---|---|
| UI | SwiftUI + NavigationStack |
| State | `@MainActor` ObservableObject + Combine |
| Persistence | SwiftData (`@Model`, `ModelContainer`) |
| Speech | `SFSpeechRecognizer` continuous w/ auto-restart |
| Detection | Pure Swift keyword engine (port of `RiskEngine.kt`) |
| Alerts | `UINotificationFeedbackGenerator` + `AVSpeechSynthesizer` + `UNUserNotificationCenter` |

## Risk Scoring (mirrors Android exactly)

| Signal | Score |
|---|---|
| Gift Card Payment | 30 |
| Impersonation | 25 |
| Unusual Payment Method | 25 |
| Arrest Threat | 25 |
| Payment Demand | 20 |
| Threat Language | 20 |
| Secrecy Instruction | 20 |
| Legal Threat | 20 |
| Urgency/Pressure | 15 |
| Personal Info Request | 15 |

Scores cap at 100. Alert fires at High (≥60) or Critical (≥80).

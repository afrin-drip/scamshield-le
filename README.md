# ð¨ ScamShield LE

**Real-time protection against law enforcement impersonation scams**

[![Platform](https://img.shields.io/badge/Platform-Android%2026+-green.svg)](https://developer.android.com)
[![Language](https://img.shields.io/badge/Language-Kotlin-blue.svg)](https://kotlinlang.org)
[![AI](https://img.shields.io/badge/AI-Claude%20API-orange.svg)](https://console.anthropic.com)
[![License](https://img.shields.io/badge/License-TBD-lightgrey.svg)](#license)

---

## Quick Start

1. Clone repo + run `gradle wrapper --gradle-version 8.7`
2. Add `CLAUDE_API_KEY=sk-ant-...` to `local.properties`
3. Place `google-services.json` from Firebase in `app/`
4. Open in Android Studio → sync → run on device (API 26+)
5. Test with Settings → Simulation Mode → FBI Warrant script

See [FIRST_BUILD_GUIDE.md](FIRST_BUILD_GUIDE.md) for full details.

---

## Overview

ScamShield LE is a fully-featured Android app that protects users from one of the fastest-growing fraud vectors: **law enforcement impersonation scams**. Scammers pose as police, FBI agents, U.S. Marshals, or court officials and pressure victims into sending money via gift cards, crypto, or wire transfer.

The app monitors calls in real time using two layered AI systems, fires an immediate full-screen alert when scam patterns are detected, connects users to verified agency numbers, and helps report incidents to the FTC and FBI.

> **Core Rule:** Real law enforcement does NOT demand immediate payment over the phone to avoid arrest. If that happens â hang up.

---

## Features

### ð¤ Two-Layer Real-Time Detection
**Layer 1 â Android SpeechRecognizer (Primary)**
Fast, free, on-device transcription. Feeds text into the rules engine instantly with zero latency.

**Layer 2 â Claude API Enhancement (Backup)**
Kicks in when STT confidence drops below 60%, on STT errors, or every 100 words for a deep semantic scan. Catches manipulation tactics, indirect threats, and edge cases that keyword matching misses.

The monitoring screen shows which layer is active in real time ("android_stt (82% conf)" or "claude_enhanced (91% conf)").

### ð§  Rules Engine + Risk Scoring

| Signal | Score |
|---|---|
| Law enforcement claim (police, FBI, marshal, DEAâ¦) | +25 |
| Warrant / arrest language | +20 |
| Request for money | +40 |
| Suspicious payment method (gift card, crypto, Zelle, wireâ¦) | +60 |
| Urgency / pressure ("don't hang up", "stay on the line") | +20 |

**Risk Levels:** 40+ â ï¸ Suspicious Â· 70+ ð¨ Likely Scam Â· 90+ ð¨ð¨ Critical Alert

### ð± App Screens
- **Home** â Start monitoring, view history, access settings
- **Monitoring** â Live risk meter, real-time transcript, signal chips, analysis source indicator
- **Alert** â Full-screen red alert with hang-up instruction, verified agency callback, FTC/FBI reporting
- **History** â Incident log with risk scores, signals, timestamps, one-tap reporting
- **Agency Directory** â 10 verified federal agencies with direct call and website buttons, filterable by category
- **Report Screen** â FTC/IC3 report workflow with optional details, share report summary
- **Settings** â Passive detection toggle, alert threshold slider, sound/vibration, family mode
- **Family Protection** â Add/manage family members with per-member monitoring and notification toggles
- **Analytics Dashboard** â Canvas bar chart, risk distribution, signal frequency rankings
- **Simulation Mode** â 5 realistic scam scripts (FBI warrant, IRS arrest, Sheriff deputy, U.S. Marshal, court summons) with live risk scoring
- **Onboarding** â 4-step animated first-run flow with permission request and key rule explanation

### ð¡ï¸ Passive Detection
Enable in Settings to automatically monitor all incoming calls without manually tapping "Start Monitoring." Uses Android's `TelephonyManager` and runs as a foreground service.

> â ï¸ Check your state's call recording laws before enabling passive detection.

### ð¨âð©âð§ Family Protection Mode
Add family members (name, phone, relationship). When a scam is detected on their monitored line, a push notification fires to the guardian with the risk score and transcript excerpt. Powered by Firebase Cloud Messaging.

### ð CallScreeningService (API 29+)
ScamShield can be set as your default call screening app via Android's `RoleManager`. This enables true call interception â no speakerphone required, cleaner audio, runs before you even answer.

### ð Scam Analytics
Track your personal scam history: total incidents, most common signals, calls over time, risk score distribution.

### ð­ Demo / Simulation Mode
Built-in scam call simulator with 5 realistic scripts. Perfect for demos, investor pitches, or training family members â watch the risk meter climb in real time without needing a real scam call.

### ðï¸ Verified Agency Directory
10 verified federal agency contacts with one-tap calling:
- FTC (1-877-382-4357)
- FBI / IC3 (1-800-CALL-FBI)
- U.S. Marshals (1-877-869-3869)
- DEA, IRS CI, SSA OIG, CFPB, and more

### ð FTC / IC3 Reporting
From any incident in history, tap "Report" to open a form with optional details (caller name, phone number, amount requested), then submit directly to FTC's ReportFraud.gov or FBI's IC3.gov with one tap. Or share a formatted incident summary via the Android share sheet.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Kotlin |
| UI | Jetpack Compose + Material3 (dark theme) |
| DI | Hilt |
| Database | Room (incidents + family members) |
| Preferences | SharedPreferences (settings) |
| AI â Primary | Android SpeechRecognizer |
| AI â Enhancement | Claude API (`claude-3-5-haiku-20241022`) |
| Audio | Android `AudioRecord` (16kHz, mono, PCM) |
| Notifications | Firebase Cloud Messaging (FCM) |
| Network | OkHttp |
| Architecture | MVVM + StateFlow + Coroutines |

---

## Setup

### Requirements
- Android Studio Hedgehog (2023.1.1+)
- JDK 17
- Android SDK API 26+
- Claude API key â [console.anthropic.com](https://console.anthropic.com)
- Firebase project (for family notifications) â [console.firebase.google.com](https://console.firebase.google.com)

### Quick Start

**1. Clone the repo**
```bash
git clone https://github.com/afrin-drip/scamshield-le.git
cd scamshield-le
```

**2. Generate Gradle wrapper** (one-time, required)
```bash
gradle wrapper --gradle-version 8.7
```

**3. Configure API keys** â create/edit `local.properties`:
```
sdk.dir=/path/to/your/android/sdk
CLAUDE_API_KEY=sk-ant-your-key-here
FIREBASE_SERVER_KEY=your-firebase-server-key
```

**4. Add Firebase config**
Download `google-services.json` from your Firebase project and place it in the `app/` folder.
See `FIREBASE_SETUP.md` for full instructions.

**5. Open in Android Studio â sync â run**
Run on a physical device (API 26+) or emulator. Grant microphone permission when prompted.

---

## Permissions

| Permission | Reason |
|---|---|
| `RECOQDE_AUDIO` | Capture call audio for analysis |
| `FOREGROUND_SERVICE_MICROPHONE` | Keep monitoring active during call |
| `INTERNET` | Send transcript to Claude API, FCM notifications |
| `VIBRATE` | Alert vibration pattern |
| `POST_NOTIFICATIONS` | Heads-up and full-screen alerts |
| `READ_PHONE_STATE` | Detect call state for passive detection |
| `BIND_SCREENING_APP_SERVICE` | CallScreeningService for API 29+ |

---

## Privacy

- Monitoring is **user-initiated** by default â no background recording without explicit opt-in
- Audio is captured only during active monitoring sessions
- Transcripts are sent transiently to Claude API for analysis and **not stored by Anthropic**
- No audio or transcripts are permanently stored â only risk scores and signal summaries
- Family member data is stored **locally only** on the device
- Designed for one-party consent compliance (e.g., Texas)

See `PRIVACY_POLICY.md` for full policy.

---

## Roadmap

| Phase | Features | Status |
|---|---|---|
| 1 | Core UI, rules engine, audio capture, Claude API, Room DB, alert system | â Complete |
| 2 | Android SpeechRecognizer (Layer 1) + Claude semantic enhancement (Layer 2) | â Complete |
| 3 | Verified agency directory, FTC/IC3 reporting workflow | â Complete |
| 4 | Family protection mode, passive background detection, settings screen | â Complete |
| 5A | Onboarding flow, app icon, Play Store prep | â Complete |
| 5B | Smart family notifications via FCM | â Complete |
| 5C | Android CallScreeningService (API 29+) | â Complete |
| 5D | Scam analytics dashboard | â Complete |
| 5E | Demo/simulation mode with 5 scam scripts | â Complete |
| 6A | Google Play Billing (subscription tiers) | ✅ Complete |
| 6B | KMM Shared Module (RiskEngine, AgencyDirectory, ScamScripts shared) | ✅ Complete |
| 6C | Android Unit Tests (70+ test cases) | ✅ Complete |
| 6D | iOS Unit Tests (XCTest suite) | ✅ Complete |
| 6E | iOS StoreKit 2 (in-app subscriptions) | ✅ Complete |
| 6F | Firestore sync (real-time web dashboard) | ✅ Complete |
| 6G | Firebase Crashlytics + Performance + Analytics | ✅ Complete |
| 6H | Deep Linking + FCM Notifications | ✅ Complete |
| 6I | Accessibility (TalkBack, Spanish/French localization) | ✅ Complete |
| 6J | Android Glance Widget | ✅ Complete |
| 6K | Web Dashboard (Next.js 14) | ✅ Complete |
| 6L | iOS CallKit integration | ✅ Complete |

---

## Monetization

- **Free** â Manual monitoring, basic alert, agency directory
- **Pro ($2.99/mo)** â Passive detection, analytics dashboard, simulation mode
- **Family ($4.99/mo)** â 5 protected numbers, guardian notifications, full history
- **Enterprise** â White-label for county sheriff offices, banks, senior living facilities

See `MONETIZATION.md` for full strategy and `BUSINESS_PLAN.md` for investor materials.

---

## Documentation

| File | Contents |
|---|---|
| `FIREBASE_SETUP.md` | Step-by-step Firebase + FCM setup guide |
| `GRADLE_SETUP.md` | Gradle wrapper, API keys, first build |
| `PLAY_STORE_LISTING.md` | App title, description, keywords |
| `PRIVACY_POLICY.md` | Full privacy policy |
| `RELEASE_CHECKLIST.md` | Play Store submission checklist |
| `SIGNING_INSTRUCTIONS.md` | Keystore generation and signing config |
| `IOS_PORT_PLAN.md` | Full iOS/SwiftUI port plan |
| `IOS_MVP_SPEC.md` | iOS MVP spec with SwiftUI stubs |
| `KMM_OPTION.md` | Kotlin Multiplatform analysis |
| `BUSINESS_PLAN.md` | Investor-ready business plan |
| `MONETIZATION.md` | Detailed monetization strategy |
| `PITCH_DECK_OUTLINE.md` | 12-slide pitch deck outline |
| `FIRST_BUILD_GUIDE.md` | Complete device setup and first build walkthrough |
| `DEVICE_TESTING_CHECKLIST.md` | Quick verification checklist |
| `CRASHLYTICS_SETUP.md` | Firebase Crashlytics setup for both platforms |

---

## Project Structure

```
app/                  Android app module
shared/               Kotlin Multiplatform shared module (RiskEngine, AgencyDirectory, ScamScripts)
web/                  Next.js 14 family dashboard
ios/ScamShieldLE/     iOS SwiftUI app
ios/ScamShieldLETests/ XCTest suite
```

---

## Contributing

We welcome developers, security researchers, law enforcement professionals, and designers.

Areas most needed:
- iOS SwiftUI port
- Kotlin Multiplatform shared module (RiskEngine, AgencyDirectory)
- Additional scam script types
- State-specific legal compliance review
- Accessibility improvements

---

## License

TBD

---

## Final Note

> *"Law enforcement does not demand immediate payment over the phone to avoid arrest. Do not pay. Hang up and call the agency from an official number."*
> â FTC, FBI, U.S. Marshals Service

**ScamShield LE â stop the scam before it happens.**

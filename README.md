# 🚨 ScamShield LE

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

ScamShield LE is a fully-featured Android app that protects users from **law enforcement impersonation scams**. Scammers pose as police, FBI agents, U.S. Marshals, or court officials and pressure victims into sending money via gift cards, crypto, or wire transfer.

> **Core Rule:** Real law enforcement does NOT demand immediate payment over the phone to avoid arrest. If that happens — hang up.

---

## Features

### 🎤 Two-Layer Real-Time Detection
**Layer 1 — Android SpeechRecognizer (Primary)**
Fast, free, on-device transcription with zero latency.

**Layer 2 — Claude API Enhancement (Backup)**
Kicks in when STT confidence is low. Catches manipulation tactics, indirect threats, and edge cases keyword matching misses.

### 🧠 Detection Logic

| Signal | Score |
|---|---|
| Law enforcement claim (police, FBI, marshal…) | +25 |
| Warrant / arrest language | +20 |
| Request for money | +40 |
| Suspicious payment method (gift card, crypto, Zelle, wire…) | +60 |
| Urgency / pressure ("don't hang up", "stay on the line") | +20 |

**Risk Levels:** 40+ ⚠️ Suspicious · 70+ 🚨 Likely Scam · 90+ 🚨🚨 Critical Alert

### 📱 App Screens
- **Home** — Start monitoring, view history, access settings
- **Monitoring** — Live risk meter, real-time transcript, signal chips, analysis source indicator
- **Alert** — Full-screen red alert with hang-up instruction, verified agency callback, FTC/FBI reporting
- **History** — Incident log with risk scores, signals, timestamps, one-tap reporting
- **Agency Directory** — 10 verified federal agencies with direct call and website buttons
- **Report Screen** — FTC/IC3 report workflow with optional details, share report summary
- **Settings** — Passive detection toggle, alert threshold slider, sound/vibration, family mode
- **Family Protection** — Add/manage family members with per-member monitoring and notification toggles
- **Analytics Dashboard** — Canvas bar chart, risk distribution, signal frequency rankings
- **Simulation Mode** — 5 realistic scam scripts with live risk scoring
- **Onboarding** — 4-step animated first-run flow

### 🛡️ Passive Detection
Enable in Settings to automatically monitor all incoming calls without tapping "Start Monitoring."

> ⚠️ Check your state's call recording laws before enabling.

### 👨‍👩‍👧 Family Protection Mode
Add family members and receive push notifications when a scam is detected on their call. Powered by Firebase Cloud Messaging.

### 📞 CallScreeningService (API 29+)
Set ScamShield as your default call screening app via Android's RoleManager — no speakerphone required.

### 📊 Scam Analytics
Track total incidents, most common signals, calls over time, risk score distribution.

### 🎭 Demo / Simulation Mode
5 built-in scam scripts for demos, investor pitches, or family training.

### 🏛️ Verified Agency Directory
10 verified federal agency contacts with one-tap calling: FTC, FBI/IC3, U.S. Marshals, DEA, IRS CI, SSA OIG, CFPB, and more.

### 📋 FTC / IC3 Reporting
From any incident, tap "Report" to submit directly to FTC's ReportFraud.gov or FBI's IC3.gov.
### 🔢 Scam Number Intelligence
Cross-references incoming calls against a crowd-sourced database of known scam numbers. Warns before you even answer — no monitoring needed. Integrates with CallScreeningService to auto-block high-confidence numbers.

### 🏛️ Law Enforcement Data API
ScamShield shares anonymized scam incident data with registered law enforcement agencies via a secure REST API. Agencies can query incident patterns, trending signals, and area code hotspots to prioritize investigations. See `api/` for the full backend.

### 📱 SMS Backup Alerts (Twilio)
When FCM push notifications fail, ScamShield falls back to SMS via Twilio to ensure family guardians are always notified, even without an internet connection.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Kotlin |
| UI | Jetpack Compose + Material3 (dark theme) |
| DI | Hilt |
| Database | Room (incidents + family members) |
| AI — Primary | Android SpeechRecognizer |
| AI — Enhancement | Claude API (`claude-3-5-haiku-20241022`) |
| Audio | Android `AudioRecord` (16kHz, mono, PCM) |
| Notifications | Firebase Cloud Messaging (FCM) |
| Sync | Firestore (real-time web dashboard) |
| Billing | Google Play Billing 6.x |
| Shared Logic | Kotlin Multiplatform (RiskEngine, AgencyDirectory) |
| Network | OkHttp |
| Architecture | MVVM + StateFlow + Coroutines |

---

## Project Structure

```
scamshield-le/
├── app/                    # Android app (Kotlin/Compose)
├── shared/                 # Kotlin Multiplatform shared module
│   └── commonMain/         # RiskEngine, AgencyDirectory, ScamScripts
├── ios/                    # iOS app (SwiftUI)
│   ├── ScamShieldLE/       # Main iOS source
│   └── ScamShieldLETests/  # XCTest suite
└── web/                    # Next.js 14 family dashboard
```

---

## Setup

### Requirements
- Android Studio Hedgehog (2023.1.1+)
- JDK 17
- Android SDK API 26+
- Claude API key — [console.anthropic.com](https://console.anthropic.com)
- Firebase project — [console.firebase.google.com](https://console.firebase.google.com)

### Quick Setup
```bash
git clone https://github.com/afrin-drip/scamshield-le.git
cd scamshield-le
gradle wrapper --gradle-version 8.7   # required — generates wrapper jar
```

Add to `local.properties`:
```
CLAUDE_API_KEY=sk-ant-your-key-here
FIREBASE_SERVER_KEY=your-firebase-server-key
```

Place `google-services.json` (from Firebase) in the `app/` folder, then open in Android Studio and run.

## Architecture

```
ScamShield Platform
├── Android App (Kotlin/Compose) ─── Real-time detection
├── iOS App (SwiftUI) ─────────────── iOS parity
├── KMM Shared Module ─────────────── Shared business logic
├── Web Dashboard (Next.js) ───────── Family monitoring
└── LE Data API (Node.js/Express) ─── Law enforcement integration
         │
         └── Firebase Platform
               ├── Firestore ──── Data sync + LE data
               ├── Auth ─────────── User identity
               ├── FCM ──────────── Push notifications
               └── Crashlytics ─── Crash reporting
```

---

## Roadmap

| Phase | Features | Status |
|---|---|---|
| 1 | Core UI, rules engine, audio capture, Claude API, Room DB, alert system | ✅ Complete |
| 2 | Android SpeechRecognizer (Layer 1) + Claude semantic enhancement (Layer 2) | ✅ Complete |
| 3 | Verified agency directory, FTC/IC3 reporting workflow | ✅ Complete |
| 4 | Family protection mode, passive background detection, settings screen | ✅ Complete |
| 5A | Onboarding flow, app icon, Play Store prep | ✅ Complete |
| 5B | Smart family notifications via FCM | ✅ Complete |
| 5C | Android CallScreeningService (API 29+) | ✅ Complete |
| 5D | Scam analytics dashboard | ✅ Complete |
| 5E | Demo/simulation mode with 5 scam scripts | ✅ Complete |
| 6A | Google Play Billing (Free / Pro $2.99 / Family $4.99) | ✅ Complete |
| 6B | KMM Shared Module (RiskEngine + AgencyDirectory shared with iOS) | ✅ Complete |
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
| 7A | Law Enforcement Data Sharing API (Node.js/Express backend) | ✅ Complete |
| 7B | Scam Number Intelligence Database (crowd-sourced + auto-blocking) | ✅ Complete |
| 7C | Twilio SMS Backup Notifications | ✅ Complete |
| 7D | iOS App Store Submission Preparation | ✅ Complete |
| 8A | WatchOS companion app | 🔜 Planned |
| 8B | CISA/FTC live data feed integration | 🔜 Planned |
| 8C | Multi-tenant enterprise dashboard | 🔜 Planned |

---

## Monetization

- **Free** — Manual monitoring, basic alert, agency directory
- **Pro ($2.99/mo)** — Passive detection, analytics dashboard, simulation mode
- **Family ($4.99/mo)** — 5 protected numbers, guardian notifications, full history
- **Enterprise** — White-label for county sheriff offices, banks, senior living facilities

---

## Documentation

| File | Contents |
|---|---|
| `FIRST_BUILD_GUIDE.md` | Complete device setup and first build walkthrough |
| `DEVICE_TESTING_CHECKLIST.md` | Quick verification checklist |
| `FIREBASE_SETUP.md` | Step-by-step Firebase + FCM setup guide |
| `GRADLE_SETUP.md` | Gradle wrapper, API keys, first build |
| `PLAY_STORE_LISTING.md` | App title, description, keywords |
| `PRIVACY_POLICY.md` | Full privacy policy |
| `RELEASE_CHECKLIST.md` | Play Store submission checklist |
| `SIGNING_INSTRUCTIONS.md` | Keystore generation and signing config |
| `CRASHLYTICS_SETUP.md` | Firebase Crashlytics setup for both platforms |
| `IOS_PORT_PLAN.md` | Full iOS/SwiftUI port plan |
| `IOS_MVP_SPEC.md` | iOS MVP spec with SwiftUI stubs |
| `KMM_OPTION.md` | Kotlin Multiplatform analysis |
| `BUSINESS_PLAN.md` | Investor-ready business plan |
| `MONETIZATION.md` | Detailed monetization strategy |
| `PITCH_DECK_OUTLINE.md` | 12-slide pitch deck outline |
| `api/README.md` | Law Enforcement API documentation and endpoint reference |
| `TWILIO_SETUP.md` | Twilio SMS backup notification setup |
| `IOS_APP_STORE_SUBMISSION.md` | Complete iOS App Store submission guide |

---

## Privacy

- Monitoring is **user-initiated** by default — no background recording without explicit opt-in
- Transcripts sent transiently to Claude API and **not stored by Anthropic**
- Family member data stored **locally only** on device
- Designed for one-party consent compliance (e.g., Texas)

---

## Contributing

Areas most needed: iOS SwiftUI polish, Kotlin Multiplatform refinement, additional scam script types, state-specific legal compliance review, accessibility improvements.

---

## License

TBD

---

> *"Law enforcement does not demand immediate payment over the phone to avoid arrest. Do not pay. Hang up and call the agency from an official number."*
> — FTC, FBI, U.S. Marshals Service

**ScamShield LE — stop the scam before it happens.**

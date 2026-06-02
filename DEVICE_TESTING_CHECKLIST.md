# ScamShield LE — Device Testing Checklist

Use this after a fresh install to verify the app is working correctly end-to-end.
Each item should take under 30 seconds to check. Work through them in order.

---

## Setup Verification

- [ ] **App launches without crash**
  Open ScamShield LE. The home screen should appear within 3 seconds with no error dialogs.

- [ ] **Microphone permission granted**
  Settings > Apps > ScamShield LE > Permissions > Microphone > Allow.
  (Or grant it when the app prompts on first launch.)

---

## Core Functionality

- [ ] **Home screen shows "Start Monitoring" button**
  The main screen should display a prominent "Start Monitoring" button and an idle risk meter at 0.

- [ ] **Simulation mode triggers CRITICAL alert at 90+ score**
  Settings > Simulation Mode > select "FBI Warrant" > Run Simulation.
  The risk score should climb to 90 or above and display CRITICAL status.

- [ ] **Alert screen shows red full-screen overlay with hang-up button**
  When the simulation reaches CRITICAL, the full-screen red alert should fire automatically.
  A prominent hang-up / end call button should be visible.

---

## Settings & Controls

- [ ] **Settings screen opens correctly**
  Tap the gear icon. The Settings screen should open with options for passive detection, simulation mode, sensitivity, and notification preferences.

- [ ] **Passive detection toggle works**
  In Settings, toggle "Passive Detection" off and back on. The toggle should respond and the home screen should reflect the state change.

---

## History & Data

- [ ] **History screen shows past incidents after running simulation**
  After the simulation completes, tap the History tab. The simulated "FBI Warrant" incident should appear as an entry with a timestamp and risk score.

---

## Reference Features

- [ ] **Agency directory shows agencies with call buttons**
  Open the Agency Directory (shield/contacts icon). You should see at least 10 agencies (FTC, FBI, IRS TIGTA, Social Security OIG, etc.), each with a working "Call" button that dials the agency's real fraud hotline.

---

## OS Integration

- [ ] **Widget appears on home screen**
  Long-press your Android home screen > Add Widget > scroll to ScamShield LE.
  The widget should be available and placeable. It should show the current monitoring status.

- [ ] **Notification fires when simulation reaches CRITICAL**
  (Requires Firebase setup — see FIREBASE_SETUP.md if this step fails.)
  Run the simulation again. When CRITICAL is reached, a push notification should appear in the notification shade even if the app is in the background.

---

## Battery & Background Behaviour (Physical Device Only)

- [ ] **App survives screen-off for 5 minutes while monitoring**
  Start monitoring, lock the screen, wait 5 minutes, unlock — the app should still show monitoring active.
  If it does not: Settings > Battery > ScamShield LE > set to **Unrestricted**.

---

## Pass Criteria

**All boxes checked** — Build is production-ready for field testing.
**Notification box unchecked only** — Acceptable without Firebase setup; all core detection features work.
**Any other box unchecked** — Investigate before distributing to testers.

---

*Run this checklist after every significant code change before sharing a build.*

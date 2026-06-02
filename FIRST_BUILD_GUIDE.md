# ScamShield LE — First Build Guide

> **Hand this to anyone with Android Studio and zero prior project context.**
> Follow every step in order. Do not skip Step 2.

---

## Prerequisites Checklist

Before opening Android Studio, confirm you have everything:

- [ ] **Android Studio Hedgehog (2023.1.1) or newer**
  Download: https://developer.android.com/studio
  *(Hedgehog ships with JDK 17 bundled — no separate JDK install needed)*

- [ ] **JDK 17** — bundled with Android Studio Hedgehog+; no action required if using the bundled JDK

- [ ] **Android device (strongly recommended) OR emulator**
  - Device must run **Android 8.0 (API 26) or higher**
  - Physical device is strongly preferred — microphone access is more reliable and passive call detection works properly on real hardware
  - Emulator works for UI testing but microphone input requires extra AVD configuration (see Troubleshooting)

- [ ] **USB cable** (if using a physical device)

- [ ] **A Claude API key** — get one at https://console.anthropic.com — API Keys — Create Key

- [ ] **Firebase project** (for push notifications) — https://console.firebase.google.com
  *(Can be skipped for a first smoke-test; app will run without it but notifications will not fire)*

---

## Step 1 — Clone & Open the Project

Open a terminal and run:

```bash
git clone https://github.com/afrin-drip/scamshield-le.git
cd scamshield-le
```

Then open in Android Studio:

1. Launch Android Studio
2. **File > Open**
3. Navigate to and select the scamshield-le folder you just cloned
4. Click **OK**
5. Wait for the IDE to index the project (progress bar at the bottom)

> If Android Studio asks to use the Gradle wrapper, click **OK**. If it errors immediately, proceed to Step 2.

---

## Step 2 — Generate the Gradle Wrapper (ONE-TIME REQUIRED)

**Why this is necessary:** GitHub does not allow pushing binary .jar files, so gradle/wrapper/gradle-wrapper.jar is excluded from the repository. Without it, Android Studio cannot build the project. You must generate it locally once.

In the terminal inside Android Studio (View > Tool Windows > Terminal) or any terminal in the project root:

```bash
gradle wrapper --gradle-version 8.7
```

> **Prerequisite:** Gradle must be installed on your system. Install via:
> - macOS: brew install gradle
> - Windows: https://gradle.org/install/ — binary-only zip — add to PATH
> - Linux: sudo apt install gradle or use SDKMAN

After the command completes, you should see:

```
BUILD SUCCESSFUL in Xs
1 actionable task: 1 executed
```

Then **File > Sync Project with Gradle Files** in Android Studio (or click the elephant icon).

---

## Step 3 — Create local.properties

Create a file named local.properties in the **project root** (same level as settings.gradle.kts).

**Never commit this file — it contains secret keys and is already in .gitignore.**

```properties
# macOS
sdk.dir=/Users/YOUR_NAME/Library/Android/sdk

# Windows (use one or the other, not both)
# sdk.dir=C:\Users\YOUR_NAME\AppData\Local\Android\Sdk

CLAUDE_API_KEY=sk-ant-api03-YOUR_KEY_HERE
FIREBASE_SERVER_KEY=YOUR_FIREBASE_SERVER_KEY_HERE
```

Replace the placeholders:

| Placeholder | Where to get it |
|---|---|
| YOUR_NAME | Your system username |
| YOUR_KEY_HERE | https://console.anthropic.com — API Keys — Create Key |
| YOUR_FIREBASE_SERVER_KEY_HERE | https://console.firebase.google.com — Project Settings — Cloud Messaging — Server key |

Android Studio auto-creates local.properties with just sdk.dir when you open a project — if it already exists, simply add the two API key lines to it.

---

## Step 4 — Firebase Configuration (Push Notifications)

> Skip this step for a basic first run. The app will build and run without Firebase, but push notifications will not fire.

1. Go to https://console.firebase.google.com
2. Create a new project (or select an existing one)
3. Click **Add app > Android**
4. Enter package name: com.scamshield.le
5. Click **Register app**
6. Download google-services.json
7. Move google-services.json into the app/ folder (same level as app/build.gradle.kts)
8. Back in Android Studio: **File > Sync Project with Gradle Files**

For full Firebase setup details (Cloud Messaging, notification channels, etc.) see FIREBASE_SETUP.md.

---

## Step 5 — Connect Your Device & Build

### Enable Developer Options on your Android device

1. Open **Settings > About Phone**
2. Tap **Build Number** 7 times rapidly
3. Enter your PIN/password if prompted
4. You will see "You are now a developer!"
5. Go back to **Settings > Developer Options**
6. Enable **USB Debugging**

### Connect and run

1. Connect your device to your computer via USB
2. On the device, tap **Allow** when asked "Allow USB debugging from this computer?"
3. In Android Studio, look at the device selector in the toolbar — your device should appear (e.g., Samsung Galaxy S23)
4. Click **Run** (Shift+F10)
5. Android Studio will build and install the APK — this takes 2-5 minutes on first build
6. The app will launch automatically on your device
7. When prompted, **grant microphone permission**

---

## Step 6 — First Test (No Real Scam Call Needed!)

You do not need an actual scam call to verify the app is working. Use Simulation Mode:

1. Open the app — tap **Start Monitoring**
2. Tap the **Settings** icon (gear, top-right)
3. Select **Simulation Mode**
4. Choose the **FBI Warrant** script from the list
5. Tap **Run Simulation**
6. Watch the risk meter climb — it should reach **CRITICAL (90+ score)**
7. The full-screen red alert should fire with a hang-up button

If all of the above happens, your build is fully functional.

---

## Troubleshooting

**Gradle sync failed immediately on open**
You have not generated the wrapper yet. Run: gradle wrapper --gradle-version 8.7 in the project root (Step 2).

**gradle: command not found**
Gradle is not installed on your system. See Step 2 prerequisites for install instructions.

**CLAUDE_API_KEY not found / build error referencing missing key**
Confirm local.properties is in the **project root**, not inside app/. Open the file and verify the key is spelled exactly CLAUDE_API_KEY.

**google-services.json not found / build fails at :app:processDebugGoogleServices**
Place google-services.json in the app/ folder, then File > Sync Project with Gradle Files.

**Build failed: Cannot find symbol FirebaseApp or similar Firebase errors**
Either google-services.json is missing, is in the wrong folder, or uses a different package name. Confirm the package name in Firebase console matches com.scamshield.le.

**Device not appearing in Android Studio device selector**
Check USB Debugging is enabled. Try a different cable. On Windows, install the manufacturer USB driver. Run adb devices in terminal — if the device shows as unauthorized, check the device screen for the allow dialog.

**App installs but crashes on launch**
Check **Logcat** in Android Studio (View > Tool Windows > Logcat) and filter by ScamShield. Most common cause: local.properties keys are missing or malformed.

**Samsung / OnePlus: passive detection stops working in background**
The OS is killing the background service. Fix: Settings > Battery > App Battery Usage > ScamShield > Unrestricted. Path varies by manufacturer; search "battery optimization" in Settings.

**Emulator microphone not working**
When creating an AVD in Android Studio, go to **Advanced Settings** and set **Microphone** to **Virtual microphone uses host audio input**. Then re-create the AVD.

**Simulation mode does not trigger alert**
Ensure microphone permission is granted (Settings > Apps > ScamShield > Permissions > Microphone). Simulation Mode still requires the permission to be granted even though it uses synthetic audio.

---

## What is Next

Once the app is running, refer to:

- **DEVICE_TESTING_CHECKLIST.md** — systematically verify all features work
- **FIREBASE_SETUP.md** — complete Firebase/FCM setup for push notifications
- **ARCHITECTURE.md** — codebase overview before making changes

---

*ScamShield LE — protecting people from government impersonation scams.*

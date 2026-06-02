# ScamShield LE — iOS

## CallKit Integration

### Overview

ScamShield LE uses Apple's **CallKit** framework to provide caller-ID labeling and number blocking on iOS. This is fundamentally different from the Android implementation — see [iOS vs Android](#ios-vs-android-audio-interception) below.

---

### Xcode Project Setup

#### 1. Add the Call Directory Extension target

1. File → New → Target → **Call Directory Extension**
2. Product Name: `CallDirectoryExtension`
3. Bundle ID: `com.verreauxgroup.scamshield-le.CallDirectoryExtension`
4. Replace the generated `CallDirectoryHandler.swift` with `ios/CallDirectoryExtension/CallDirectoryHandler.swift` from this repo.

#### 2. CallKit Entitlement

The **host app** target requires the `com.apple.developer.callkit.enabled` entitlement in its `.entitlements` file:

```xml
<key>com.apple.developer.callkit.enabled</key>
<true/>
```

> This entitlement must be present in your provisioning profile. Add it in the **Signing & Capabilities** tab → **+Capability** → **CallKit**.

The extension target does **not** need this entitlement separately — it inherits authorization through the host app.

#### 3. App Group Setup

Both the host app and the extension must share an **App Group** so blocked numbers written by the app are readable by the extension.

1. In Xcode, select the **ScamShieldLE** target → Signing & Capabilities → **+Capability** → **App Groups**.
2. Add: `group.com.verreauxgroup.scamshield-le`
3. Repeat for the **CallDirectoryExtension** target.
4. Blocked numbers are stored as `[Int64]` under the key `"blockedNumbers"` in `UserDefaults(suiteName: "group.com.verreauxgroup.scamshield-le")`.

After writing new numbers, call `CallKitManager.shared.reloadExtension()` to sync them with iOS.

---

### Architecture

| File | Role |
|---|---|
| `CallDirectoryExtension/CallDirectoryHandler.swift` | `CXCallDirectoryProvider` subclass. Reads blocked numbers from shared UserDefaults; flags suspicious area codes (202, 206, 212, 213, 310, 404, 415, 602, 702, 800, 888). |
| `CallDirectoryExtension/Info.plist` | Extension bundle metadata; declares `com.apple.callkit.call-directory` extension point. |
| `ScamShieldLE/CallKit/CallKitManager.swift` | `@MainActor` singleton wrapping `CXCallDirectoryManager`. Exposes `checkAuthorizationStatus()`, `reloadExtension()`, and `isExtensionEnabled`. |
| `ScamShieldLE/CallKit/CallMonitor.swift` | `@Observable` class using `CXCallObserver`. Tracks `isOnCall` and `currentCallUUID`; posts `Notification.Name.scamShieldCallConnected` on connect. |
| `ScamShieldLE/CallKit/CallKitSetupView.swift` | SwiftUI settings view; explains capabilities & limitations, shows status, deep-links to Settings. |
| `ScamShieldLE/Views/SettingsView.swift` | Main settings screen; includes "Call Identification" section with status badge and navigate-to-configure button. |

---

### iOS vs Android Audio Interception

| Feature | Android (ScamShield LE) | iOS (ScamShield LE) |
|---|---|---|
| Live call audio analysis | ✅ Via Accessibility Service | ❌ Not permitted by Apple |
| Caller ID labeling | ✅ | ✅ Via CallKit |
| Number blocking | ✅ | ✅ Via CallKit |
| Works without app open | Partial | ✅ CallKit extension runs in background |
| Requires user permission | Accessibility permission | Phone → Call Blocking & Identification |

**Why iOS cannot intercept audio:**
Apple's security model sandboxes all apps strictly. There is no public API equivalent to Android's `MediaProjection` or Accessibility audio capture for standard cellular calls. VoIP-based calls (via `CXProvider`) can be processed, but regular PSTN calls are off-limits. ScamShield LE's iOS build therefore relies solely on database-driven caller ID to warn users before they answer.

---

### User Flow

1. User installs ScamShieldLE.
2. Opens **Settings → Call Identification → Configure**.
3. `CallKitSetupView` explains capabilities and taps **Open Settings**.
4. User navigates to **Settings → Phone → Call Blocking & Identification** and enables ScamShield.
5. `CXCallDirectoryManager` authorization status becomes `.enabled`.
6. `CallDirectoryHandler` is invoked by iOS whenever its database needs refreshing; it writes identification entries for suspicious area codes and any user-blocked numbers.
7. Incoming calls from flagged numbers show the ScamShield label in the system call UI.

---

### Running Locally

```bash
# Open in Xcode
open ios/ScamShieldLE.xcodeproj

# Build & run on a physical device (CallKit requires real hardware)
# Simulator does not support CXCallDirectoryManager reloads.
```

> **Note:** CallKit extensions cannot be tested on the iOS Simulator. Use a physical device with a valid provisioning profile that includes the App Group and CallKit entitlements.

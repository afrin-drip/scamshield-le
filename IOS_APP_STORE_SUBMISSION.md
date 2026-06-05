# iOS App Store Submission Guide — ScamShield LE

## 1. Apple Developer Account Setup
- Enroll at https://developer.apple.com/programs/ ($99/year)
- Accept latest Developer Program License Agreement
- Confirm account type: Individual or Organization (Organization requires D-U-N-S number)

## 2. Bundle ID Registration
1. Sign in to https://developer.apple.com/account
2. Go to Certificates, Identifiers & Profiles → Identifiers
3. Click + → App IDs → App
4. Description: ScamShield LE
5. Bundle ID (Explicit): `com.scamshield.le`
6. Capabilities to enable: Push Notifications, Sign In with Apple (if used)
7. Click Continue → Register

## 3. App Store Connect — Create App Record
1. Go to https://appstoreconnect.apple.com
2. My Apps → + → New App
3. Platform: iOS
4. Name: ScamShield LE
5. Primary Language: English (U.S.)
6. Bundle ID: com.scamshield.le
7. SKU: scamshield-le-001
8. User Access: Full Access
9. Click Create

## 4. Privacy Nutrition Labels
Navigate to App Privacy section in App Store Connect and declare:

| Data Type | Collected? | Linked to User? | Used for Tracking? |
|-----------|-----------|-----------------|-------------------|
| Audio | Yes — microphone used for live call analysis | No — not stored or transmitted | No |
| Identifiers (Device ID) | Yes — for analytics | No | No |
| Crash Data | Yes | No | No |

**Privacy Policy URL required.** Host a privacy policy that covers:
- Microphone usage (live analysis only, not recorded or stored)
- No sale of personal data
- Data retention policy

## 5. Age Rating
- Rating: **4+**
- No objectionable content
- This is a safety/fraud-protection utility app
- No user-generated content, no social features, no gambling

Complete the age rating questionnaire in App Store Connect:
- Cartoon or Fantasy Violence: None
- Realistic Violence: None
- Sexual Content: None
- Profanity: None
- Mature/Suggestive Themes: None
- Simulated Gambling: No
- Horror/Fear Themes: None

## 6. Keywords (100 character limit)
```
scam detector,fraud protection,law enforcement scam,call protection,elder fraud
```

## 7. App Description Template
**Short Description (30 chars):**
Detect & block scam calls live

**Full Description:**
ScamShield LE protects you and your loved ones from sophisticated phone scams — including those impersonating law enforcement, government agencies, and financial institutions.

Real-time call analysis alerts you the moment a call shows signs of fraud, so you can hang up before any damage is done. Designed especially to protect seniors and vulnerable populations from elder fraud.

Features:
• Live scam detection during calls
• Law enforcement impersonation alerts
• Government agency spoofing detection
• Detailed scam reports for authorities
• Offline protection — no call data leaves your device

## 8. App Review Notes
Include these notes when submitting for review:

```
Reviewer Notes for ScamShield LE:

Microphone Usage:
This app uses the microphone to analyze live phone calls in real time for scam 
indicators. Audio is processed on-device only and is never recorded, stored, or 
transmitted. The microphone permission is required for the core functionality of 
the app and cannot be made optional.

App Category:
Utilities — fraud/scam protection tool designed to help users identify and avoid 
phone scams, particularly those impersonating law enforcement agencies.

Test Account:
No account required for basic functionality. 
TestFlight build includes a demo mode accessible from Settings → Demo Mode.

Known Limitations in Review Build:
Live call detection requires an active phone call. Use the built-in demo in 
Settings → Demo Mode to test detection without a real call.
```

## 9. TestFlight Beta Testing Workflow
1. After Fastlane `beta` lane runs, the build appears in TestFlight (processing takes 5–30 min)
2. In App Store Connect → TestFlight:
   - **Internal Testing**: Add up to 100 testers from your team (immediate, no Apple review)
   - **External Testing**: Add up to 10,000 external testers (requires Beta App Review, ~1–2 days)
3. Invite testers by email or public link
4. Testers install TestFlight app, then accept invite
5. Collect feedback via TestFlight feedback mechanism or crash reports

## 10. Required Secrets for GitHub Actions
Set these in repo Settings → Secrets and Variables → Actions:

| Secret | Description |
|--------|-------------|
| `APP_STORE_CONNECT_API_KEY_ID` | Key ID from App Store Connect |
| `APP_STORE_CONNECT_ISSUER_ID` | Issuer ID from App Store Connect |
| `APP_STORE_CONNECT_API_KEY_CONTENT` | Base64-encoded .p8 key file |
| `CERTIFICATE_BASE64` | Base64-encoded .p12 distribution certificate |
| `CERTIFICATE_PASSWORD` | Password for .p12 file |
| `KEYCHAIN_PASSWORD` | Any strong password for temporary keychain |
| `PROVISIONING_PROFILE_BASE64` | Base64-encoded .mobileprovision file |

**Generate API Key:**
1. App Store Connect → Users and Access → Keys
2. Click + → Name: CI Key, Access: Developer
3. Download .p8 file (one-time download)
4. `base64 -i AuthKey_XXXXXXXX.p8 | pbcopy` — paste as `APP_STORE_CONNECT_API_KEY_CONTENT`

## 11. Submission Checklist

### Before First Submission
- [ ] Apple Developer account active ($99/year paid)
- [ ] Bundle ID registered: com.scamshield.le
- [ ] App record created in App Store Connect
- [ ] Distribution certificate + provisioning profile created
- [ ] GitHub Actions secrets configured
- [ ] Privacy policy URL live and accessible
- [ ] App icons at all required sizes (use Xcode asset catalog)
- [ ] Launch screen / splash screen configured

### App Store Connect Metadata
- [ ] App name: ScamShield LE
- [ ] Subtitle (30 chars max): Real-Time Scam Protection
- [ ] Description written
- [ ] Keywords entered (under 100 chars)
- [ ] Support URL provided
- [ ] Privacy Policy URL provided
- [ ] Screenshots for: iPhone 6.7", iPhone 6.5", iPad Pro 12.9" (required)
- [ ] App Preview video (optional but recommended)
- [ ] Age rating questionnaire complete (4+)
- [ ] Privacy nutrition labels declared
- [ ] Pricing set (Free or paid tier)
- [ ] Availability countries selected

### Build & Review
- [ ] Minimum iOS version set (recommend iOS 16.0+)
- [ ] TestFlight internal testing completed
- [ ] External beta testing completed (optional)
- [ ] Build uploaded via Fastlane `release` lane
- [ ] Build selected in App Store Connect version
- [ ] App Review notes written (explain microphone use)
- [ ] Export compliance answered (No encryption beyond iOS defaults)
- [ ] Click "Submit for Review"

### Post-Approval
- [ ] Monitor for approval (typically 1–3 business days)
- [ ] Set release: automatic or manual on specific date
- [ ] Prepare release notes / What's New text
- [ ] Monitor crash reports and reviews after launch

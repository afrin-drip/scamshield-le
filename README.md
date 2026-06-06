# ð¡ ScamShield LE

> Real-time scam call detection and intelligence platform for law enforcement agencies, senior living facilities, and families.

![Build](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Android](https://img.shields.io/badge/platform-Android-green) ![iOS](https://img.shields.io/badge/platform-iOS-lightgrey) ![Web](https://img.shields.io/badge/platform-Web-blue)

---

## Overview

ScamShield LE uses a two-layer detection engine â on-device speech recognition plus Claude API semantic analysis â to identify scam calls in real time. Anonymized signals are reported to law enforcement agencies and senior care facilities through dedicated portals, while families get push notifications and a shared dashboard.

**Three audiences, one platform:**
- ð® **Law enforcement** â jurisdiction-level incident maps, pattern analysis, exportable case data
- ð  **Senior living facilities** â per-resident monitoring, staff alert feeds, family notifications
- ð¨âð©âð§ **Families** â real-time notifications when a protected member receives a high-risk call

---

## Architecture

| Module | Tech | Port | Status |
|--------|------|------|--------|
| `app/` | Android Â· Kotlin Â· Jetpack Compose | â | â Production-ready |
| `ios/` | iOS Â· SwiftUI Â· CallKit | â | â Complete |
| `shared/` | Kotlin Multiplatform (KMM) | â | â Complete |
| `api/` | Node.js Â· Express Â· Firestore | 4000 | â Complete |
| `le-portal/` | Next.js 14 Â· Mapbox GL | 3001 | â Complete |
| `retirement-portal/` | Next.js 14 Â· Tailwind | 3002 | â Complete |
| `web/` | Next.js 14 Â· Firebase Auth | 3000 | â ï¸ Basic |
| `landing/` | Next.js 14 Â· Tailwind | â | â Complete |

---

## Features

### Android App
- **Two-layer detection:** SpeechRecognizer (Layer 1) + Claude API semantic analysis (Layer 2)
- **Risk scoring:** Law enforcement claims, warrant language, payment requests, urgency phrases
- **Risk thresholds:** Low <40 Â· Medium 40â70 Â· High 70â90 Â· Critical >90
- **CallScreeningService** (API 29+): auto-blocks >0.8 confidence, silences >0.5
- **PassiveDetectionService** for always-on background monitoring
- **Scam Number Intelligence:** local Room DB synced every 6 hours from the cloud
- **Screens:** Home, Monitoring, Alert, History, Agency Directory, Report, Settings, Family, Analytics, Simulation, Onboarding, Subscription
- **Infrastructure:** Hilt DI, Room DB, Firestore sync, FCM, Twilio SMS fallback, Google Play Billing 6.x (Free/Pro/Family), Glance widget, deep links, accessibility, Spanish + French localization, 70+ unit tests

### iOS App
- SwiftUI with CallKit caller ID labeling and number blocking
- StoreKit 2 in-app subscriptions
- Firebase Crashlytics, Performance, Analytics, FCM

### LE Portal
- Mapbox GL dark map with 341 US area code markers (Critical / Likely Scam / Suspicious)
- Heatmap layer, state GeoJSON overlay, time filters (7d/30d/90d/All)
- Incidents table with CSV export, incident detail modal with risk gauge
- Pattern analysis: signal trends, peak-hours heatmap, script clusters
- Real-time alert feed, report generation, agency management (super-admin)

### Retirement Home Portal
- Multi-tenant: each facility is isolated by `facilityId` from JWT claims
- Role-based auth: `super_admin` Â· `facility_admin` Â· `staff` (read-only)
- Resident table with risk badges, protection status, app-installed indicator
- Real-time alert feed with acknowledge workflow (auto-refreshes every 30s)
- Per-resident family contact management + per-contact notification toggles
- Monthly/quarterly CSV report export
- Facilities view (super-admin: all tenants)

### CISA/FTC Live Feed
| Feed | Source | Schedule |
|------|--------|----------|
| FTC DNC Complaints | api.ftc.gov/v0/dnc-complaints | Weekdays 13:00 UTC |
| CISA Advisories | cisa.gov/uscert/ncas/all.xml | Every 6 hours |

---

## Quick Start

### Prerequisites
- Node.js 20+, npm 10+
- Android Studio (for `app/`)
- Xcode 15+ (for `ios/`)
- Docker + Docker Compose (optional, for full-stack local dev)
- Firebase project with Firestore enabled
- Mapbox token (for LE Portal map)

### Clone & install
```bash
git clone https://github.com/afrin-drip/scamshield-le.git
cd scamshield-le
```

### Run individual modules
```bash
cd api && npm install && npm run dev          # API on :4000
cd le-portal && npm install && npm run dev    # LE Portal on :3001
cd retirement-portal && npm install && npm run dev  # Retirement on :3002
cd web && npm install && npm run dev          # Family dashboard on :3000
cd landing && npm install && npm run dev      # Landing site
```

### Docker Compose (all services)
```bash
cp .env.example .env  # fill in your values
make dev              # or: docker compose up --build
```

| Service | URL |
|---------|-----|
| API | http://localhost:4000 |
| LE Portal | http://localhost:3001 |
| Retirement Portal | http://localhost:3002 |
| Family Dashboard | http://localhost:3000 |

---

## Environment Variables

### API (`api/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | â | Secret for signing JWTs |
| `FIRESTORE_PROJECT_ID` | â | GCP project ID |
| `PORT` | â | Server port (default 4000) |
| `FTC_API_KEY` | â ï¸ recommended | Free key from api.data.gov |

### LE Portal (`le-portal/.env.local`)
| Variable | Required | Description |
|----------|----------|-------------|
| `LE_API_URL` | â | Base URL of the LE API |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | â | Mapbox GL access token |

### Retirement Portal (`retirement-portal/.env.local`)
| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | â | Must match API JWT_SECRET |
| `LE_API_URL` | â | Base URL of the LE API |

### Landing (`landing/.env.local`)
| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | â | Resend API key for contact form |
| `TO_EMAIL` | â | Destination email for submissions |

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /health | None | Service health + uptime |
| GET | /incidents | JWT | Paginated incidents, CSV export |
| GET | /patterns | JWT | Script clusters, peak hours heatmap |
| GET | /stats | JWT | Weekly + state-level statistics |
| POST | /agencies | JWT | Register a new agency |
| GET | /agencies | JWT (admin) | List all agencies |
| GET | /feeds/status | JWT | CISA/FTC sync status + record counts |
| POST | /feeds/sync | JWT | Manually trigger feed ingest |

> **Privacy:** area codes only (never full phone numbers), 100-char transcript excerpts, one-way anonymized call IDs.

---

## Deployment

### Vercel (web modules)
```bash
cd le-portal && npx vercel --prod          # â le-portal.scamshieldle.com
cd retirement-portal && npx vercel --prod  # â care.scamshieldle.com
cd web && npx vercel --prod                # â app.scamshieldle.com
cd landing && npx vercel --prod            # â scamshieldle.com
```

### Cloud Run (API)
```bash
gcloud builds submit ./api --tag gcr.io/YOUR_PROJECT/scamshield-api
gcloud run deploy scamshield-api \
  --image gcr.io/YOUR_PROJECT/scamshield-api \
  --region us-central1 \
  --platform managed \
  --set-env-vars JWT_SECRET=...,FIRESTORE_PROJECT_ID=...
```

Grant the Cloud Run service account `roles/datastore.user` on your GCP project.

---

## Contributing

1. Fork and create a branch: `feature/your-feature` or `fix/issue-description`
2. Keep changes scoped to one module per PR when possible
3. New API endpoints must include auth middleware and rate limiting
4. Privacy constraint: never log or store full phone numbers â area codes only
5. Run `make test` before submitting

**Good first issues:** contact form styling, iOS audit simulation screen, family dashboard analytics, Android package cleanup (notification/ vs notifications/)

---

## License

MIT Â© ScamShield LE Contributors â see [LICENSE](LICENSE)

---

## 🗺 Build Roadmap — Phase by Phase

> For contributors and investors: a full breakdown of every phase of ScamShield LE, what was built, what's live, and what's next.

---

### Phase 1 — Android Core Detection Engine ✅
**Goal:** Real-time scam call detection on Android.

- `CallAnalysisCoordinator.kt` — orchestrates two-layer detection pipeline
- `SpeechRecognitionManager.kt` — Layer 1: on-device Android SpeechRecognizer, streams live call audio to text
- `ClaudeAudioAnalyzer.kt` — Layer 2: sends transcript chunks to Claude API for semantic scam detection
- `RiskEngine` (KMM shared) — scores transcripts against 6 signal categories: law enforcement impersonation, warrant language, payment demands, gift card requests, urgency phrases, suspicious payment methods
- Risk thresholds: Low <40 · Medium 40–70 · High 70–90 · Critical >90
- `CallScreeningService.kt` — Android CallScreeningService (API 29+): auto-blocks calls scoring >0.8, silences >0.5
- `PassiveDetectionService.kt` — foreground service for always-on background monitoring

---

### Phase 2 — Android Data Layer & Persistence ✅
**Goal:** Local storage, repositories, and cloud sync.

- Room database with DAOs for calls, incidents, blocked numbers, agency data
- `ScamNumberDatabase.kt` — local Room DB of known scam numbers
- `ScamIntelligenceManager.kt` — coordinates number lookup and confidence scoring
- `NumberIntelligenceWorker.kt` — WorkManager periodic job (every 6 hours) syncing cloud scam number list to local Room DB
- Firestore real-time sync for family dashboard and LE portal data sharing
- Hilt dependency injection throughout — all repositories, services, and ViewModels properly scoped
- Repository pattern enforced: ViewModels never touch DAOs directly

---

### Phase 3 — Android UI (Jetpack Compose) ✅
**Goal:** Full screen stack for end users.

- **Home** — risk summary, recent activity, quick actions
- **Monitoring** — live risk meter with animated gauge, real-time transcript feed, signal type breakdown
- **Alert** — full-screen high-risk alert with call details, block/allow actions
- **History** — paginated call history with risk badges and filter
- **Agency Directory** — searchable list of law enforcement agencies using ScamShield
- **Report** — submit anonymous scam reports with signal tagging
- **Family Protection** — add/manage family members, view their protection status
- **Analytics Dashboard** — charts for blocked calls, scam types, risk trends over time
- **Simulation** — demo mode to test detection without a live call
- **Onboarding** — multi-step permission setup and tutorial
- **Settings** — notification prefs, detection sensitivity, account management
- **Subscription** — Google Play Billing 6.x upgrade flow (Free/Pro/Family tiers)

---

### Phase 4 — Android Infrastructure & Platform ✅
**Goal:** Production-grade mobile infrastructure.

- Firebase Crashlytics, Performance Monitoring, Analytics
- FCM push notifications — `ScamShieldMessagingService.kt`, `FCMTokenManager.kt`
- `GuardianNotificationOrchestrator.kt` — routes alerts to correct family members
- `TwilioSmsManager.kt` — SMS fallback when push is unavailable
- Google Play Billing 6.x — `BillingManager.kt`, `BillingRepository.kt`, `SubscriptionTier.kt`
- Glance home screen widget — live risk status without opening the app
- Deep link handling for FCM notification tap-throughs
- Accessibility: TalkBack support, content descriptions throughout
- Localization: English, Spanish (es), French (fr)
- 70+ unit tests covering detection engine, scoring, and repository layer

---

### Phase 5 — iOS App (SwiftUI) ✅
**Goal:** Full iOS parity with CallKit integration.

- SwiftUI app matching Android feature set
- **CallKit** — `CallDirectoryHandler.swift` flags suspicious area codes for caller ID; `CallKitManager.swift` + `CallMonitor.swift` (CXCallObserver) tracks live call state
- Shared App Group between main app and CallKit extension for number database access
- `ClaudeAPIService.swift` — Claude API integration (architecture present; limited by Apple sandbox — live audio interception not permitted by iOS)
- StoreKit 2 in-app subscriptions
- Firebase Crashlytics, Performance, Analytics; FCM push notifications; deep linking
- Views: Alert, Analytics, Family, Monitoring, Report, Simulation, Subscription
- `AlertManager.swift`, `AnalyticsStore.swift`, `FamilyStore.swift`, `ReportGenerator.swift`

---

### Phase 6 — Kotlin Multiplatform (KMM) Shared Module ✅
**Goal:** Share business logic between Android and iOS.

- `RiskEngine` — unified scoring algorithm used by both platforms
- `RiskScoreFormatter` — formats risk scores for display consistently across platforms
- Shared agency data models (`agencies/`)
- Shared simulation logic (`simulation/`)
- Shared detection models (`detection/`, `model/`)
- Enables future WatchOS/Wear OS without rewriting core logic

---

### Phase 7 — LE Data API (Node.js/Express) ✅
**Goal:** Privacy-first REST API for law enforcement data access.

**Privacy design:** area codes only (never full phone numbers), 100-char transcript excerpts, one-way anonymized call IDs, rate limiting on all endpoints.

- `GET /health` — uptime, Firestore probe, feed scheduler status
- `GET /incidents` — paginated, multi-filter, CSV export
- `GET /patterns` — area-code rollups, signal-type queries, script clustering, peak-hours heatmap
- `GET /stats` — weekly stats, state-level rankings, trending patterns
- `POST /agencies` — agency self-registration with API key issuance
- `GET /agencies` — agency management (super-admin only)
- `GET /feeds/status` — CISA/FTC sync status and record counts
- `POST /feeds/sync` — manual feed ingest trigger
- JWT authentication middleware on all protected routes
- `validateEnv.ts` — startup environment validation
- Docker + Cloud Run deployment configuration

---

### Phase 8 — LE Portal (Next.js 14) ✅
**Goal:** Web dashboard for law enforcement agencies.

- Login: Agency ID + API Key → JWT; session cookie
- **Dashboard** — KPI cards (incidents, agencies, high-risk area codes, scam types), trend charts
- **Map** — Mapbox GL dark map, 341 US area code centroids with Critical/Likely/Suspicious markers, heatmap layer, state GeoJSON overlay, click-to-popup, time filters (7d/30d/90d/All)
- **Incidents** — sortable/filterable table, incident detail modal with risk gauge, CSV export
- **Patterns** — signal trend area charts, peak-hours heatmap, script cluster analysis
- **Alerts** — real-time alert feed (live polling)
- **Reports** — generate and download PDF/CSV reports
- **Agencies** — agency management, API key rotation (super-admin)
- `LiveFeedStatusCard` component — shows CISA/FTC sync status inline on dashboard

---

### Phase 9 — Family Web Dashboard (Next.js 14) ✅
**Goal:** Web interface for families monitoring protected members.

- Firebase Auth (Google sign-in) + Firestore real-time sync
- Dashboard with incident summary and risk timeline
- Incident detail pages with signal breakdown
- Family member management (add/remove protected members)
- Components: RiskBadge, IncidentCard, SignalChip, FamilyMemberRow
- ⚠️ Expansion planned: analytics, subscription management, notification preferences

---

### Phase 10 — Retirement Home Portal (Next.js 14) ✅
**Goal:** Multi-tenant B2B dashboard for senior living facilities.

- **Multi-tenancy** — every data access scoped to `facilityId` from JWT claims; super-admins see all tenants
- **Role-based auth** — `super_admin` · `facility_admin` · `staff` (read-only)
- **Auth middleware** — protects all routes, redirects to `/login?next=...` on expired token
- **Dashboard** — live KPI cards (residents protected, incidents this week, calls blocked, unack'd alerts), recharts bar chart, recent alert feed
- **Residents** — searchable table with risk badges, protection status, app-installed indicator, subscription tier; click-through to resident detail
- **Resident Detail** — full incident history, family contacts with per-contact notification toggles
- **Alerts** — real-time feed (30s auto-refresh), acknowledge workflow, severity filters
- **Family** — per-resident family contact management with notification toggles (alert / report / min risk level)
- **Reports** — monthly/quarterly CSV export, facility-wide or per-resident scope
- **Settings** — facility info, notification prefs, user and role management
- **Facilities** — super-admin view of all tenant organizations
- Deployed separately from LE Portal at port 3002

---

### Phase 11 — CISA/FTC Live Intelligence Feed ✅
**Goal:** Ingest government scam data to enrich the platform intelligence.

- `CisaFtcFeedService.ts` — polls FTC DNC Complaints API (`api.ftc.gov/v0/dnc-complaints`) and CISA Advisories RSS (`cisa.gov/uscert/ncas/all.xml`)
- FTC feed normalizes phone complaints to ScamShield incident schema with risk scoring
- CISA feed filters for vishing/phone-scam/gov-impersonation advisories and maps to `gov_impersonation` signal type
- `feedScheduler.ts` — node-cron: FTC weekdays 13:00 UTC, CISA every 6 hours
- `FeedRecordRepository.ts` — Firestore batch upsert (500 records/batch), idempotent by record ID
- `/feeds/status` and `/feeds/sync` API endpoints
- `LiveFeedStatusCard` — React component showing sync health on LE Portal dashboard
- `FEED_SETUP.md` — full setup guide; FTC API key free from api.data.gov

---

### Phase 12 — Developer Tooling & Infrastructure ✅
**Goal:** Make the project runnable, deployable, and maintainable.

- `docker-compose.yml` — all 4 web services with health checks, named volumes, and service dependencies
- `api/Dockerfile` — multi-stage build (TypeScript compile → production image), non-root user
- `Makefile` — `make dev` · `make build` · `make test` · `make seed` · `make deploy-*` with self-documenting `make help`
- `api/src/scripts/seed.ts` — idempotent Firestore seeder (agencies, incidents, patterns)
- `api/src/scripts/validateEnv.ts` — startup env validation; throws on missing required vars, warns on optional
- `landing/app/api/contact/route.ts` — contact form backend via Resend with input validation and HTML escaping
- `MIT LICENSE` — open source license added

---

### Phase 13 — Landing Site (scamshieldle.com) ✅
**Goal:** Public marketing and acquisition site.

- `landing/app/page.tsx` — full marketing page (~43KB, multiple sections)
- Privacy policy page (`/privacy`)
- Contact page with form wired to Resend email backend
- `landing/.env.example` — RESEND_API_KEY, TO_EMAIL documented
- Next.js 14 with Tailwind CSS

---

### 🔮 Phase 14 — Planned (Not Started)
| Feature | Priority | Notes |
|---------|----------|-------|
| WatchOS companion app | High | Show live resident risk level on caregiver's wrist |
| Android package cleanup | Medium | Resolve `notification/` vs `notifications/`, top-level `monitoring/`+`navigation/` duplicates |
| iOS on-device ML audio | Medium | Replace inert ClaudeAPIService with Core ML model for live audio |
| Family dashboard expansion | Medium | Analytics, subscription management, notification prefs |
| Retirement portal Firestore | High | Replace mock data with real Firestore queries |
| Multi-language LE Portal | Low | Spanish, French translations |
| Enterprise SSO | Low | SAML/OIDC for large facility operators |


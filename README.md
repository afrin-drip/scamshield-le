# Ã°ÂÂÂ¡ ScamShield LE

> Real-time scam call detection and intelligence platform for law enforcement agencies, senior living facilities, and families.

![Build](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Android](https://img.shields.io/badge/platform-Android-green) ![iOS](https://img.shields.io/badge/platform-iOS-lightgrey) ![Web](https://img.shields.io/badge/platform-Web-blue)

---

## Overview

ScamShield LE uses a two-layer detection engine Ã¢ÂÂ on-device speech recognition plus Claude API semantic analysis Ã¢ÂÂ to identify scam calls in real time. Anonymized signals are reported to law enforcement agencies and senior care facilities through dedicated portals, while families get push notifications and a shared dashboard.

**Three audiences, one platform:**
- Ã°ÂÂÂ® **Law enforcement** Ã¢ÂÂ jurisdiction-level incident maps, pattern analysis, exportable case data
- Ã°ÂÂÂ  **Senior living facilities** Ã¢ÂÂ per-resident monitoring, staff alert feeds, family notifications
- Ã°ÂÂÂ¨Ã¢ÂÂÃ°ÂÂÂ©Ã¢ÂÂÃ°ÂÂÂ§ **Families** Ã¢ÂÂ real-time notifications when a protected member receives a high-risk call


---

## Completed Features at a Glance

| # | Feature | Module | Status | Key Files |
|---|---------|--------|--------|-----------|
| 1 | Two-layer scam detection (SpeechRecognizer + Claude API) | Android | Complete | `CallAnalysisCoordinator`, `ClaudeAudioAnalyzer`, `SpeechRecognitionManager` |
| 2 | Risk scoring engine (6 signal categories) | KMM Shared | Complete | `RiskEngine`, `RiskScoreFormatter` |
| 3 | CallScreeningService — auto-block/silence | Android | Complete | `CallScreeningServiceImpl`, `PassiveDetectionService` |
| 4 | Scam Number Intelligence (6-hour cloud sync) | Android | Complete | `ScamIntelligenceManager`, `NumberIntelligenceWorker`, `ScamNumberDatabase` |
| 5 | Full Compose UI (12 screens) | Android | Complete | Home, Monitoring, Alert, History, Agency Directory, Report, Family, Analytics, Simulation, Onboarding, Settings, Subscription |
| 6 | Google Play Billing 6.x (Free/Pro/Family) | Android | Complete | `BillingManager`, `BillingRepository`, `SubscriptionTier` |
| 7 | FCM push + Twilio SMS fallback | Android | Complete | `ScamShieldMessagingService`, `GuardianNotificationOrchestrator`, `TwilioSmsManager` |
| 8 | Glance home screen widget | Android | Complete | `ScamShieldWidget`, `ScamShieldWidgetReceiver` |
| 9 | Firestore real-time sync | Android | Complete | `sync/` package, Firestore DAOs |
| 10 | 70+ unit tests + localization (EN/ES/FR) | Android | Complete | `test/`, `res/values-es/`, `res/values-fr/` |
| 11 | CallKit caller ID + number blocking | iOS | Complete | `CallDirectoryHandler`, `CallKitManager`, `CallMonitor` |
| 12 | StoreKit 2 in-app subscriptions | iOS | Complete | `SubscriptionView`, `BillingManager` (iOS) |
| 13 | JWT-authenticated REST API | API | Complete | `index.ts`, `middleware/auth.ts`, all route files |
| 14 | Incident API (paginated + CSV export) | API | Complete | `routes/incidents.ts` |
| 15 | Pattern analysis API (clusters, heatmap) | API | Complete | `routes/patterns.ts` |
| 16 | Stats API (weekly + state-level) | API | Complete | `routes/stats.ts` |
| 17 | Agency management API | API | Complete | `routes/agencies.ts` |
| 18 | Health check endpoint | API | Complete | `routes/health.ts` |
| 19 | CISA/FTC live data feed ingest | API | Complete | `services/cisaFtcFeedService.ts`, `jobs/feedScheduler.ts` |
| 20 | Feed status + manual sync endpoints | API | Complete | `routes/feeds.ts`, `repositories/feedRecordRepository.ts` |
| 21 | Mapbox GL dark map (341 area codes) | LE Portal | Complete | Mapbox component, GeoJSON overlay, heatmap layer |
| 22 | Incident table + CSV export | LE Portal | Complete | Incidents page, export handler |
| 23 | Pattern analysis (trends, heatmap, clusters) | LE Portal | Complete | Patterns page |
| 24 | Real-time alert feed | LE Portal | Complete | Alerts page |
| 25 | Report generation | LE Portal | Complete | Reports page |
| 26 | Agency management (super-admin) | LE Portal | Complete | Agencies page |
| 27 | Live feed status card | LE Portal | Complete | `LiveFeedStatusCard.tsx` |
| 28 | Multi-tenant retirement home portal | Retirement Portal | Complete | All pages + API routes |
| 29 | Role-based auth (super_admin / facility_admin / staff) | Retirement Portal | Complete | `middleware.ts`, `lib/auth.ts` |
| 30 | Resident monitoring table + detail | Retirement Portal | Complete | `residents/page.tsx`, `residents/[id]/page.tsx` |
| 31 | Real-time alert feed + acknowledge workflow | Retirement Portal | Complete | `alerts/page.tsx`, `components/AlertCard.tsx` |
| 32 | Family contact + notification management | Retirement Portal | Complete | `family/page.tsx` |
| 33 | Monthly/quarterly CSV report export | Retirement Portal | Complete | `reports/page.tsx` |
| 34 | Family web dashboard | Web | Complete | Firebase Auth + Firestore, 5 pages |
| 35 | Marketing landing site | Landing | Complete | `landing/app/page.tsx` (43KB) |
| 36 | Contact form backend (Resend) | Landing | Complete | `app/api/contact/route.ts` |
| 37 | Docker Compose (all services) | DevOps | Complete | `docker-compose.yml` |
| 38 | API Dockerfile (multi-stage) | DevOps | Complete | `api/Dockerfile` |
| 39 | Makefile (dev/build/seed/deploy) | DevOps | Complete | `Makefile` |
| 40 | Firestore seed script | DevOps | Complete | `api/src/scripts/seed.ts` |
| 41 | Environment validator | DevOps | Complete | `api/src/scripts/validateEnv.ts` |
| 42 | MIT License | Repo | Complete | `LICENSE` |


---

## Architecture

| Module | Tech | Port | Status |
|--------|------|------|--------|
| `app/` | Android ÃÂ· Kotlin ÃÂ· Jetpack Compose | Ã¢ÂÂ | Ã¢ÂÂ Production-ready |
| `ios/` | iOS ÃÂ· SwiftUI ÃÂ· CallKit | Ã¢ÂÂ | Ã¢ÂÂ Complete |
| `shared/` | Kotlin Multiplatform (KMM) | Ã¢ÂÂ | Ã¢ÂÂ Complete |
| `api/` | Node.js ÃÂ· Express ÃÂ· Firestore | 4000 | Ã¢ÂÂ Complete |
| `le-portal/` | Next.js 14 ÃÂ· Mapbox GL | 3001 | Ã¢ÂÂ Complete |
| `retirement-portal/` | Next.js 14 ÃÂ· Tailwind | 3002 | Ã¢ÂÂ Complete |
| `web/` | Next.js 14 ÃÂ· Firebase Auth | 3000 | Ã¢ÂÂ Ã¯Â¸Â Basic |
| `landing/` | Next.js 14 ÃÂ· Tailwind | Ã¢ÂÂ | Ã¢ÂÂ Complete |

---

## Features

### Android App
- **Two-layer detection:** SpeechRecognizer (Layer 1) + Claude API semantic analysis (Layer 2)
- **Risk scoring:** Law enforcement claims, warrant language, payment requests, urgency phrases
- **Risk thresholds:** Low <40 ÃÂ· Medium 40Ã¢ÂÂ70 ÃÂ· High 70Ã¢ÂÂ90 ÃÂ· Critical >90
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
- Role-based auth: `super_admin` ÃÂ· `facility_admin` ÃÂ· `staff` (read-only)
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
| `JWT_SECRET` | Ã¢ÂÂ | Secret for signing JWTs |
| `FIRESTORE_PROJECT_ID` | Ã¢ÂÂ | GCP project ID |
| `PORT` | Ã¢ÂÂ | Server port (default 4000) |
| `FTC_API_KEY` | Ã¢ÂÂ Ã¯Â¸Â recommended | Free key from api.data.gov |

### LE Portal (`le-portal/.env.local`)
| Variable | Required | Description |
|----------|----------|-------------|
| `LE_API_URL` | Ã¢ÂÂ | Base URL of the LE API |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Ã¢ÂÂ | Mapbox GL access token |

### Retirement Portal (`retirement-portal/.env.local`)
| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | Ã¢ÂÂ | Must match API JWT_SECRET |
| `LE_API_URL` | Ã¢ÂÂ | Base URL of the LE API |

### Landing (`landing/.env.local`)
| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Ã¢ÂÂ | Resend API key for contact form |
| `TO_EMAIL` | Ã¢ÂÂ | Destination email for submissions |

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
cd le-portal && npx vercel --prod          # Ã¢ÂÂ le-portal.scamshieldle.com
cd retirement-portal && npx vercel --prod  # Ã¢ÂÂ care.scamshieldle.com
cd web && npx vercel --prod                # Ã¢ÂÂ app.scamshieldle.com
cd landing && npx vercel --prod            # Ã¢ÂÂ scamshieldle.com
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
4. Privacy constraint: never log or store full phone numbers Ã¢ÂÂ area codes only
5. Run `make test` before submitting

**Good first issues:** contact form styling, iOS audit simulation screen, family dashboard analytics, Android package cleanup (notification/ vs notifications/)

---

## License

MIT ÃÂ© ScamShield LE Contributors Ã¢ÂÂ see [LICENSE](LICENSE)

---

## ðº Build Roadmap â Phase by Phase

> For contributors and investors: a full breakdown of every phase of ScamShield LE, what was built, what's live, and what's next.

---

### Phase 1 â Android Core Detection Engine â
**Goal:** Real-time scam call detection on Android.

- `CallAnalysisCoordinator.kt` â orchestrates two-layer detection pipeline
- `SpeechRecognitionManager.kt` â Layer 1: on-device Android SpeechRecognizer, streams live call audio to text
- `ClaudeAudioAnalyzer.kt` â Layer 2: sends transcript chunks to Claude API for semantic scam detection
- `RiskEngine` (KMM shared) â scores transcripts against 6 signal categories: law enforcement impersonation, warrant language, payment demands, gift card requests, urgency phrases, suspicious payment methods
- Risk thresholds: Low <40 Â· Medium 40â70 Â· High 70â90 Â· Critical >90
- `CallScreeningService.kt` â Android CallScreeningService (API 29+): auto-blocks calls scoring >0.8, silences >0.5
- `PassiveDetectionService.kt` â foreground service for always-on background monitoring

---

### Phase 2 â Android Data Layer & Persistence â
**Goal:** Local storage, repositories, and cloud sync.

- Room database with DAOs for calls, incidents, blocked numbers, agency data
- `ScamNumberDatabase.kt` â local Room DB of known scam numbers
- `ScamIntelligenceManager.kt` â coordinates number lookup and confidence scoring
- `NumberIntelligenceWorker.kt` â WorkManager periodic job (every 6 hours) syncing cloud scam number list to local Room DB
- Firestore real-time sync for family dashboard and LE portal data sharing
- Hilt dependency injection throughout â all repositories, services, and ViewModels properly scoped
- Repository pattern enforced: ViewModels never touch DAOs directly

---

### Phase 3 â Android UI (Jetpack Compose) â
**Goal:** Full screen stack for end users.

- **Home** â risk summary, recent activity, quick actions
- **Monitoring** â live risk meter with animated gauge, real-time transcript feed, signal type breakdown
- **Alert** â full-screen high-risk alert with call details, block/allow actions
- **History** â paginated call history with risk badges and filter
- **Agency Directory** â searchable list of law enforcement agencies using ScamShield
- **Report** â submit anonymous scam reports with signal tagging
- **Family Protection** â add/manage family members, view their protection status
- **Analytics Dashboard** â charts for blocked calls, scam types, risk trends over time
- **Simulation** â demo mode to test detection without a live call
- **Onboarding** â multi-step permission setup and tutorial
- **Settings** â notification prefs, detection sensitivity, account management
- **Subscription** â Google Play Billing 6.x upgrade flow (Free/Pro/Family tiers)

---

### Phase 4 â Android Infrastructure & Platform â
**Goal:** Production-grade mobile infrastructure.

- Firebase Crashlytics, Performance Monitoring, Analytics
- FCM push notifications â `ScamShieldMessagingService.kt`, `FCMTokenManager.kt`
- `GuardianNotificationOrchestrator.kt` â routes alerts to correct family members
- `TwilioSmsManager.kt` â SMS fallback when push is unavailable
- Google Play Billing 6.x â `BillingManager.kt`, `BillingRepository.kt`, `SubscriptionTier.kt`
- Glance home screen widget â live risk status without opening the app
- Deep link handling for FCM notification tap-throughs
- Accessibility: TalkBack support, content descriptions throughout
- Localization: English, Spanish (es), French (fr)
- 70+ unit tests covering detection engine, scoring, and repository layer

---

### Phase 5 â iOS App (SwiftUI) â
**Goal:** Full iOS parity with CallKit integration.

- SwiftUI app matching Android feature set
- **CallKit** â `CallDirectoryHandler.swift` flags suspicious area codes for caller ID; `CallKitManager.swift` + `CallMonitor.swift` (CXCallObserver) tracks live call state
- Shared App Group between main app and CallKit extension for number database access
- `ClaudeAPIService.swift` â Claude API integration (architecture present; limited by Apple sandbox â live audio interception not permitted by iOS)
- StoreKit 2 in-app subscriptions
- Firebase Crashlytics, Performance, Analytics; FCM push notifications; deep linking
- Views: Alert, Analytics, Family, Monitoring, Report, Simulation, Subscription
- `AlertManager.swift`, `AnalyticsStore.swift`, `FamilyStore.swift`, `ReportGenerator.swift`

---

### Phase 6 â Kotlin Multiplatform (KMM) Shared Module â
**Goal:** Share business logic between Android and iOS.

- `RiskEngine` â unified scoring algorithm used by both platforms
- `RiskScoreFormatter` â formats risk scores for display consistently across platforms
- Shared agency data models (`agencies/`)
- Shared simulation logic (`simulation/`)
- Shared detection models (`detection/`, `model/`)
- Enables future WatchOS/Wear OS without rewriting core logic

---

### Phase 7 â LE Data API (Node.js/Express) â
**Goal:** Privacy-first REST API for law enforcement data access.

**Privacy design:** area codes only (never full phone numbers), 100-char transcript excerpts, one-way anonymized call IDs, rate limiting on all endpoints.

- `GET /health` â uptime, Firestore probe, feed scheduler status
- `GET /incidents` â paginated, multi-filter, CSV export
- `GET /patterns` â area-code rollups, signal-type queries, script clustering, peak-hours heatmap
- `GET /stats` â weekly stats, state-level rankings, trending patterns
- `POST /agencies` â agency self-registration with API key issuance
- `GET /agencies` â agency management (super-admin only)
- `GET /feeds/status` â CISA/FTC sync status and record counts
- `POST /feeds/sync` â manual feed ingest trigger
- JWT authentication middleware on all protected routes
- `validateEnv.ts` â startup environment validation
- Docker + Cloud Run deployment configuration

---

### Phase 8 â LE Portal (Next.js 14) â
**Goal:** Web dashboard for law enforcement agencies.

- Login: Agency ID + API Key â JWT; session cookie
- **Dashboard** â KPI cards (incidents, agencies, high-risk area codes, scam types), trend charts
- **Map** â Mapbox GL dark map, 341 US area code centroids with Critical/Likely/Suspicious markers, heatmap layer, state GeoJSON overlay, click-to-popup, time filters (7d/30d/90d/All)
- **Incidents** â sortable/filterable table, incident detail modal with risk gauge, CSV export
- **Patterns** â signal trend area charts, peak-hours heatmap, script cluster analysis
- **Alerts** â real-time alert feed (live polling)
- **Reports** â generate and download PDF/CSV reports
- **Agencies** â agency management, API key rotation (super-admin)
- `LiveFeedStatusCard` component â shows CISA/FTC sync status inline on dashboard

---

### Phase 9 â Family Web Dashboard (Next.js 14) â
**Goal:** Web interface for families monitoring protected members.

- Firebase Auth (Google sign-in) + Firestore real-time sync
- Dashboard with incident summary and risk timeline
- Incident detail pages with signal breakdown
- Family member management (add/remove protected members)
- Components: RiskBadge, IncidentCard, SignalChip, FamilyMemberRow
- â ï¸ Expansion planned: analytics, subscription management, notification preferences

---

### Phase 10 â Retirement Home Portal (Next.js 14) â
**Goal:** Multi-tenant B2B dashboard for senior living facilities.

- **Multi-tenancy** â every data access scoped to `facilityId` from JWT claims; super-admins see all tenants
- **Role-based auth** â `super_admin` Â· `facility_admin` Â· `staff` (read-only)
- **Auth middleware** â protects all routes, redirects to `/login?next=...` on expired token
- **Dashboard** â live KPI cards (residents protected, incidents this week, calls blocked, unack'd alerts), recharts bar chart, recent alert feed
- **Residents** â searchable table with risk badges, protection status, app-installed indicator, subscription tier; click-through to resident detail
- **Resident Detail** â full incident history, family contacts with per-contact notification toggles
- **Alerts** â real-time feed (30s auto-refresh), acknowledge workflow, severity filters
- **Family** â per-resident family contact management with notification toggles (alert / report / min risk level)
- **Reports** â monthly/quarterly CSV export, facility-wide or per-resident scope
- **Settings** â facility info, notification prefs, user and role management
- **Facilities** â super-admin view of all tenant organizations
- Deployed separately from LE Portal at port 3002

---

### Phase 11 â CISA/FTC Live Intelligence Feed â
**Goal:** Ingest government scam data to enrich the platform intelligence.

- `CisaFtcFeedService.ts` â polls FTC DNC Complaints API (`api.ftc.gov/v0/dnc-complaints`) and CISA Advisories RSS (`cisa.gov/uscert/ncas/all.xml`)
- FTC feed normalizes phone complaints to ScamShield incident schema with risk scoring
- CISA feed filters for vishing/phone-scam/gov-impersonation advisories and maps to `gov_impersonation` signal type
- `feedScheduler.ts` â node-cron: FTC weekdays 13:00 UTC, CISA every 6 hours
- `FeedRecordRepository.ts` â Firestore batch upsert (500 records/batch), idempotent by record ID
- `/feeds/status` and `/feeds/sync` API endpoints
- `LiveFeedStatusCard` â React component showing sync health on LE Portal dashboard
- `FEED_SETUP.md` â full setup guide; FTC API key free from api.data.gov

---

### Phase 12 â Developer Tooling & Infrastructure â
**Goal:** Make the project runnable, deployable, and maintainable.

- `docker-compose.yml` â all 4 web services with health checks, named volumes, and service dependencies
- `api/Dockerfile` â multi-stage build (TypeScript compile â production image), non-root user
- `Makefile` â `make dev` Â· `make build` Â· `make test` Â· `make seed` Â· `make deploy-*` with self-documenting `make help`
- `api/src/scripts/seed.ts` â idempotent Firestore seeder (agencies, incidents, patterns)
- `api/src/scripts/validateEnv.ts` â startup env validation; throws on missing required vars, warns on optional
- `landing/app/api/contact/route.ts` â contact form backend via Resend with input validation and HTML escaping
- `MIT LICENSE` â open source license added

---

### Phase 13 â Landing Site (scamshieldle.com) â
**Goal:** Public marketing and acquisition site.

- `landing/app/page.tsx` â full marketing page (~43KB, multiple sections)
- Privacy policy page (`/privacy`)
- Contact page with form wired to Resend email backend
- `landing/.env.example` â RESEND_API_KEY, TO_EMAIL documented
- Next.js 14 with Tailwind CSS

---

### ð® Phase 14 â Planned (Not Started)
| Feature | Priority | Notes |
|---------|----------|-------|
| WatchOS companion app | High | Show live resident risk level on caregiver's wrist |
| Android package cleanup | Medium | Resolve `notification/` vs `notifications/`, top-level `monitoring/`+`navigation/` duplicates |
| iOS on-device ML audio | Medium | Replace inert ClaudeAPIService with Core ML model for live audio |
| Family dashboard expansion | Medium | Analytics, subscription management, notification prefs |
| Retirement portal Firestore | High | Replace mock data with real Firestore queries |
| Multi-language LE Portal | Low | Spanish, French translations |
| Enterprise SSO | Low | SAML/OIDC for large facility operators |


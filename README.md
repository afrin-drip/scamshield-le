# ScamShield LE

> Real-time scam call detection and intelligence platform for law enforcement agencies, senior living facilities, and families.

![Build](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Android](https://img.shields.io/badge/platform-Android-green) ![iOS](https://img.shields.io/badge/platform-iOS-lightgrey) ![Web](https://img.shields.io/badge/platform-Web-blue)

---

## Overview

ScamShield LE uses a two-layer detection engine -- on-device speech recognition plus Claude API semantic analysis -- to identify scam calls in real time. Anonymized signals are reported to law enforcement agencies and senior care facilities through dedicated portals, while families get push notifications and a shared dashboard.

Three audiences, one platform:
- Law enforcement -- jurisdiction-level incident maps, pattern analysis, exportable case data
- Senior living facilities -- per-resident monitoring, staff alert feeds, family notifications
- Families -- real-time notifications when a protected member receives a high-risk call

---

## Completed Features at a Glance

| # | Feature | Module | Status | Key Files |
|---|---------|--------|--------|-----------|
| 1 | Two-layer scam detection (SpeechRecognizer + Claude API) | Android | Complete | CallAnalysisCoordinator, ClaudeAudioAnalyzer, SpeechRecognitionManager |
| 2 | Risk scoring engine (6 signal categories) | KMM Shared | Complete | RiskEngine, RiskScoreFormatter |
| 3 | CallScreeningService -- auto-block/silence | Android | Complete | CallScreeningServiceImpl, PassiveDetectionService |
| 4 | Scam Number Intelligence (6-hour cloud sync) | Android | Complete | ScamIntelligenceManager, NumberIntelligenceWorker, ScamNumberDatabase |
| 5 | Full Compose UI (12 screens) | Android | Complete | Home, Monitoring, Alert, History, Agency Directory, Report, Family, Analytics, Simulation, Onboarding, Settings, Subscription |
| 6 | Google Play Billing 6.x (Free/Pro/Family) | Android | Complete | BillingManager, BillingRepository, SubscriptionTier |
| 7 | FCM push + Twilio SMS fallback | Android | Complete | ScamShieldMessagingService, GuardianNotificationOrchestrator, TwilioSmsManager |
| 8 | Glance home screen widget | Android | Complete | ScamShieldWidget, ScamShieldWidgetReceiver |
| 9 | Firestore real-time sync | Android | Complete | sync/ package |
| 10 | 70+ unit tests + localization (EN/ES/FR) | Android | Complete | test/, res/values-es/, res/values-fr/ |
| 11 | CallKit caller ID + number blocking | iOS | Complete | CallDirectoryHandler, CallKitManager, CallMonitor |
| 12 | StoreKit 2 in-app subscriptions | iOS | Complete | SubscriptionView, BillingManager (iOS) |
| 13 | JWT-authenticated REST API | API | Complete | index.ts, middleware/auth.ts |
| 14 | Incident API (paginated + CSV export) | API | Complete | routes/incidents.ts |
| 15 | Pattern analysis API (clusters, heatmap) | API | Complete | routes/patterns.ts |
| 16 | Stats API (weekly + state-level) | API | Complete | routes/stats.ts |
| 17 | Agency management API | API | Complete | routes/agencies.ts |
| 18 | Health check endpoint | API | Complete | routes/health.ts |
| 19 | CISA/FTC live data feed ingest | API | Complete | services/cisaFtcFeedService.ts, jobs/feedScheduler.ts |
| 20 | Feed status + manual sync endpoints | API | Complete | routes/feeds.ts, repositories/feedRecordRepository.ts |
| 21 | Mapbox GL dark map (341 area codes) | LE Portal | Complete | Mapbox component, GeoJSON overlay, heatmap layer |
| 22 | Incident table + CSV export | LE Portal | Complete | Incidents page, export handler |
| 23 | Pattern analysis (trends, heatmap, clusters) | LE Portal | Complete | Patterns page |
| 24 | Real-time alert feed | LE Portal | Complete | Alerts page |
| 25 | Report generation | LE Portal | Complete | Reports page |
| 26 | Agency management (super-admin) | LE Portal | Complete | Agencies page |
| 27 | Live feed status card | LE Portal | Complete | LiveFeedStatusCard.tsx |
| 28 | Multi-tenant retirement home portal | Retirement Portal | Complete | All pages + API routes |
| 29 | Role-based auth (super_admin / facility_admin / staff) | Retirement Portal | Complete | middleware.ts, lib/auth.ts |
| 30 | Resident monitoring table + detail | Retirement Portal | Complete | residents/page.tsx, residents/[id]/page.tsx |
| 31 | Real-time alert feed + acknowledge workflow | Retirement Portal | Complete | alerts/page.tsx, components/AlertCard.tsx |
| 32 | Family contact + notification management | Retirement Portal | Complete | family/page.tsx |
| 33 | Monthly/quarterly CSV report export | Retirement Portal | Complete | reports/page.tsx |
| 34 | Family web dashboard | Web | Complete | Firebase Auth + Firestore, 5 pages |
| 35 | Marketing landing site | Landing | Complete | landing/app/page.tsx |
| 36 | Contact form backend (Resend) | Landing | Complete | app/api/contact/route.ts |
| 37 | Docker Compose (all services) | DevOps | Complete | docker-compose.yml |
| 38 | API Dockerfile (multi-stage) | DevOps | Complete | api/Dockerfile |
| 39 | Makefile (dev/build/seed/deploy) | DevOps | Complete | Makefile |
| 40 | Firestore seed script | DevOps | Complete | api/src/scripts/seed.ts |
| 41 | Environment validator | DevOps | Complete | api/src/scripts/validateEnv.ts |
| 42 | MIT License | Repo | Complete | LICENSE |

---

## Architecture

| Module | Tech | Port | Status |
|--------|------|------|--------|
| app/ | Android / Kotlin / Jetpack Compose | -- | Complete |
| ios/ | iOS / SwiftUI / CallKit | -- | Complete |
| shared/ | Kotlin Multiplatform (KMM) | -- | Complete |
| api/ | Node.js / Express / Firestore | 4000 | Complete |
| le-portal/ | Next.js 14 / Mapbox GL | 3001 | Complete |
| retirement-portal/ | Next.js 14 / Tailwind | 3002 | Complete |
| web/ | Next.js 14 / Firebase Auth | 3000 | Basic |
| landing/ | Next.js 14 / Tailwind | -- | Complete |

---

## Features

### Android App
- Two-layer detection: SpeechRecognizer (Layer 1) + Claude API semantic analysis (Layer 2)
- Risk scoring: law enforcement claims, warrant language, payment requests, urgency phrases
- Risk thresholds: Low <40 / Medium 40-70 / High 70-90 / Critical >90
- CallScreeningService (API 29+): auto-blocks >0.8 confidence, silences >0.5
- PassiveDetectionService for always-on background monitoring
- Scam Number Intelligence: local Room DB synced every 6 hours from the cloud
- Screens: Home, Monitoring, Alert, History, Agency Directory, Report, Settings, Family, Analytics, Simulation, Onboarding, Subscription
- Infrastructure: Hilt DI, Room DB, Firestore sync, FCM, Twilio SMS fallback, Google Play Billing 6.x (Free/Pro/Family), Glance widget, deep links, accessibility, Spanish + French localization, 70+ unit tests

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
- Multi-tenant: each facility isolated by facilityId from JWT claims
- Role-based auth: super_admin / facility_admin / staff (read-only)
- Auth middleware: protects all routes, redirects to /login?next=... on expired token
- Residents table with risk badges, protection status, app-installed indicator
- Real-time alerts feed with acknowledge workflow (auto-refreshes every 30s)
- Per-resident family contact management with per-contact notification toggles
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
- Android Studio (for app/)
- Xcode 15+ (for ios/)
- Docker + Docker Compose (optional)
- Firebase project with Firestore enabled
- Mapbox token (for LE Portal map)

### Clone and install
```bash
git clone https://github.com/afrin-drip/scamshield-le.git
cd scamshield-le
```

### Run individual modules
```bash
cd api && npm install && npm run dev           # API on :4000
cd le-portal && npm install && npm run dev    # LE Portal on :3001
cd retirement-portal && npm install && npm run dev  # Retirement on :3002
cd web && npm install && npm run dev          # Family dashboard on :3000
cd landing && npm install && npm run dev      # Landing site
```

### Docker Compose (all services)
```bash
cp .env.example .env   # fill in your values
make dev               # or: docker compose up --build
```

| Service | URL |
|---------|-----|
| API | http://localhost:4000 |
| LE Portal | http://localhost:3001 |
| Retirement Portal | http://localhost:3002 |
| Family Dashboard | http://localhost:3000 |

---

## Environment Variables

### API (api/.env)
| Variable | Required | Description |
|----------|----------|-------------|
| JWT_SECRET | Yes | Secret for signing JWTs |
| FIRESTORE_PROJECT_ID | Yes | GCP project ID |
| PORT | Yes | Server port (default 4000) |
| FTC_API_KEY | Recommended | Free key from api.data.gov |

### LE Portal (le-portal/.env.local)
| Variable | Required | Description |
|----------|----------|-------------|
| LE_API_URL | Yes | Base URL of the LE API |
| NEXT_PUBLIC_MAPBOX_TOKEN | Yes | Mapbox GL access token |

### Retirement Portal (retirement-portal/.env.local)
| Variable | Required | Description |
|----------|----------|-------------|
| JWT_SECRET | Yes | Must match API JWT_SECRET |
| LE_API_URL | Yes | Base URL of the LE API |

### Landing (landing/.env.local)
| Variable | Required | Description |
|----------|----------|-------------|
| RESEND_API_KEY | Yes | Resend API key for contact form |
| TO_EMAIL | Yes | Destination email for submissions |

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

Privacy: area codes only (never full phone numbers), 100-char transcript excerpts, one-way anonymized call IDs.

---

## Deployment

### Vercel (web modules)
```bash
cd le-portal && npx vercel --prod
cd retirement-portal && npx vercel --prod
cd web && npx vercel --prod
cd landing && npx vercel --prod
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

Grant the Cloud Run service account roles/datastore.user on your GCP project.

---

## Build Roadmap -- Phase by Phase

For contributors and investors: a full breakdown of every phase of ScamShield LE, what was built, what is live, and what is next.

---

### Phase 1 -- Android Core Detection Engine [Complete]
Goal: Real-time scam call detection on Android.

- CallAnalysisCoordinator.kt -- orchestrates two-layer detection pipeline
- SpeechRecognitionManager.kt -- Layer 1: on-device SpeechRecognizer, streams live call audio to text
- ClaudeAudioAnalyzer.kt -- Layer 2: sends transcript chunks to Claude API for semantic scam detection
- RiskEngine (KMM shared) -- scores transcripts against 6 signal categories: law enforcement impersonation, warrant language, payment demands, gift card requests, urgency phrases, suspicious payment methods
- Risk thresholds: Low <40 / Medium 40-70 / High 70-90 / Critical >90
- CallScreeningService.kt -- Android CallScreeningService (API 29+): auto-blocks calls scoring >0.8, silences >0.5
- PassiveDetectionService.kt -- foreground service for always-on background monitoring

### Phase 2 -- Android Data Layer and Persistence [Complete]
Goal: Local storage, repositories, and cloud sync.

- Room database with DAOs for calls, incidents, blocked numbers, agency data
- ScamNumberDatabase.kt -- local Room DB of known scam numbers
- ScamIntelligenceManager.kt -- coordinates number lookup and confidence scoring
- NumberIntelligenceWorker.kt -- WorkManager periodic job (every 6 hours) syncing cloud scam number list to local DB
- Firestore real-time sync for family dashboard and LE portal data sharing
- Hilt dependency injection throughout
- Repository pattern enforced: ViewModels never touch DAOs directly

### Phase 3 -- Android UI (Jetpack Compose) [Complete]
Goal: Full screen stack for end users.

- Home -- risk summary, recent activity, quick actions
- Monitoring -- live risk meter with animated gauge, real-time transcript feed, signal type breakdown
- Alert -- full-screen high-risk alert with call details, block/allow actions
- History -- paginated call history with risk badges and filters
- Agency Directory -- searchable list of law enforcement agencies using ScamShield
- Report -- submit anonymous scam reports with signal tagging
- Family Protection -- add/manage family members, view their protection status
- Analytics Dashboard -- charts for blocked calls, scam types, risk trends over time
- Simulation -- demo mode to test detection without a live call
- Onboarding -- multi-step permission setup and tutorial
- Settings -- notification prefs, detection sensitivity, account management
- Subscription -- Google Play Billing 6.x upgrade flow (Free/Pro/Family tiers)

### Phase 4 -- Android Infrastructure and Platform [Complete]
Goal: Production-grade mobile infrastructure.

- Firebase Crashlytics, Performance Monitoring, Analytics
- FCM push notifications -- ScamShieldMessagingService.kt, FCMTokenManager.kt
- GuardianNotificationOrchestrator.kt -- routes alerts to correct family members
- TwilioSmsManager.kt -- SMS fallback when push is unavailable
- Google Play Billing 6.x -- BillingManager.kt, BillingRepository.kt, SubscriptionTier.kt
- Glance home screen widget -- live risk status without opening the app
- Deep link handling for FCM notification tap-throughs
- Accessibility: TalkBack support, content descriptions throughout
- Localization: English, Spanish (es), French (fr)
- 70+ unit tests covering detection engine, scoring, and repository layer

### Phase 5 -- iOS App (SwiftUI) [Complete]
Goal: Full iOS parity with CallKit integration.

- SwiftUI app matching Android feature set
- CallKit -- CallDirectoryHandler.swift flags suspicious area codes for caller ID
- CallKitManager.swift + CallMonitor.swift (CXCallObserver) tracks live call state
- Shared App Group between main app and CallKit extension
- ClaudeAPIService.swift -- Claude API integration (limited by Apple sandbox -- live audio interception not permitted by iOS)
- StoreKit 2 in-app subscriptions
- Firebase Crashlytics, Performance, Analytics; FCM; deep linking

### Phase 6 -- Kotlin Multiplatform (KMM) Shared Module [Complete]
Goal: Share business logic between Android and iOS.

- RiskEngine -- unified scoring algorithm used by both platforms
- RiskScoreFormatter -- consistent score display across platforms
- Shared agency data models (agencies/)
- Shared simulation logic (simulation/)
- Shared detection models (detection/, model/)
- Enables future WatchOS/Wear OS without rewriting core logic

### Phase 7 -- LE Data API (Node.js/Express) [Complete]
Goal: Privacy-first REST API for law enforcement data access.

Privacy design: area codes only (never full phone numbers), 100-char transcript excerpts, one-way anonymized call IDs, rate limiting on all endpoints.

- GET /health -- uptime, Firestore probe, feed scheduler status
- GET /incidents -- paginated, multi-filter, CSV export
- GET /patterns -- area-code rollups, signal-type queries, script clustering, peak-hours heatmap
- GET /stats -- weekly stats, state-level rankings, trending patterns
- POST /agencies -- agency self-registration with API key issuance
- GET /agencies -- agency management (super-admin only)
- GET /feeds/status -- CISA/FTC sync status and record counts
- POST /feeds/sync -- manual feed ingest trigger
- JWT authentication middleware on all protected routes
- validateEnv.ts -- startup environment validation
- Docker + Cloud Run deployment configuration

### Phase 8 -- LE Portal (Next.js 14) [Complete]
Goal: Web dashboard for law enforcement agencies.

- Login: Agency ID + API Key to JWT session cookie
- Dashboard -- KPI cards, trend charts
- Map -- Mapbox GL dark map, 341 US area code centroids with Critical/Likely/Suspicious markers, heatmap, state GeoJSON overlay, time filters
- Incidents -- sortable/filterable table, detail modal with risk gauge, CSV export
- Patterns -- signal trend charts, peak-hours heatmap, script cluster analysis
- Alerts -- real-time alert feed (live polling)
- Reports -- generate and download reports
- Agencies -- agency management, API key rotation (super-admin)
- LiveFeedStatusCard component -- shows CISA/FTC sync status inline on dashboard

### Phase 9 -- Family Web Dashboard (Next.js 14) [Complete]
Goal: Web interface for families monitoring protected members.

- Firebase Auth (Google sign-in) + Firestore real-time sync
- Dashboard with incident summary and risk timeline
- Incident detail pages with signal breakdown
- Family member management (add/remove protected members)
- Components: RiskBadge, IncidentCard, SignalChip, FamilyMemberRow
- Expansion planned: analytics, subscription management, notification preferences

### Phase 10 -- Retirement Home Portal (Next.js 14) [Complete]
Goal: Multi-tenant B2B dashboard for senior living facilities.

- Multi-tenancy -- every data access scoped to facilityId from JWT claims; super-admins see all tenants
- Role-based auth -- super_admin / facility_admin / staff (read-only)
- Auth middleware -- protects all routes, redirects to /login?next=... on expired token
- Dashboard -- live KPI cards, recharts bar chart, recent alert feed
- Residents -- searchable table with risk badges, protection status, app-installed indicator
- Resident Detail -- full incident history, family contacts with per-contact notification toggles
- Alerts -- real-time feed (30s auto-refresh), acknowledge workflow, severity filters
- Family -- per-resident family contact management with notification toggles
- Reports -- monthly/quarterly CSV export, facility-wide or per-resident scope
- Settings -- facility info, notification prefs, user and role management
- Facilities -- super-admin view of all tenant organizations

### Phase 11 -- CISA/FTC Live Intelligence Feed [Complete]
Goal: Ingest government scam data to enrich platform intelligence.

- CisaFtcFeedService.ts -- polls FTC DNC Complaints API and CISA Advisories RSS
- FTC feed normalizes phone complaints to ScamShield incident schema with risk scoring
- CISA feed filters for vishing/phone-scam/gov-impersonation advisories
- feedScheduler.ts -- node-cron: FTC weekdays 13:00 UTC, CISA every 6 hours
- FeedRecordRepository.ts -- Firestore batch upsert (500 records/batch), idempotent by record ID
- /feeds/status and /feeds/sync API endpoints
- LiveFeedStatusCard -- React component showing sync health on LE Portal dashboard
- FEED_SETUP.md -- full setup guide; FTC API key free from api.data.gov

### Phase 12 -- Developer Tooling and Infrastructure [Complete]
Goal: Make the project runnable, deployable, and maintainable.

- docker-compose.yml -- all 4 web services with health checks, named volumes, and service dependencies
- api/Dockerfile -- multi-stage build (TypeScript compile to production image), non-root user
- Makefile -- make dev / make build / make test / make seed / make deploy-* with self-documenting make help
- api/src/scripts/seed.ts -- idempotent Firestore seeder (agencies, incidents, patterns)
- api/src/scripts/validateEnv.ts -- startup env validation; throws on missing required vars
- landing/app/api/contact/route.ts -- contact form backend via Resend with input validation
- MIT LICENSE -- open source license added

### Phase 13 -- Landing Site (scamshieldle.com) [Complete]
Goal: Public marketing and acquisition site.

- landing/app/page.tsx -- full marketing page
- Privacy policy page (/privacy)
- Contact page with form wired to Resend email backend
- landing/.env.example -- RESEND_API_KEY, TO_EMAIL documented
- Next.js 14 with Tailwind CSS

### Phase 14 -- Planned (Not Started)

| Feature | Priority | Notes |
|---------|----------|-------|
| WatchOS companion app | High | Show live resident risk level on caregiver wrist |
| Android package cleanup | Medium | Resolve notification/ vs notifications/ duplicate packages |
| iOS on-device ML audio | Medium | Replace inert ClaudeAPIService with Core ML model for live audio |
| Family dashboard expansion | Medium | Analytics, subscription management, notification prefs |
| Retirement portal Firestore | High | Replace mock data with real Firestore queries |
| Multi-language LE Portal | Low | Spanish, French translations |
| Enterprise SSO | Low | SAML/OIDC for large facility operators |

---

## Contributing

1. Fork and create a branch: feature/your-feature or fix/issue-description
2. Keep changes scoped to one module per PR when possible
3. New API endpoints must include auth middleware and rate limiting
4. Privacy constraint: never log or store full phone numbers -- area codes only
5. Run make test before submitting

Good first issues: contact form styling, iOS audit simulation screen, family dashboard analytics, Android package cleanup (notification/ vs notifications/)

---

## License

MIT -- see LICENSE
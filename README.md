# 🛡 ScamShield LE

> Real-time scam call detection and intelligence platform for law enforcement agencies, senior living facilities, and families.

![Build](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Android](https://img.shields.io/badge/platform-Android-green) ![iOS](https://img.shields.io/badge/platform-iOS-lightgrey) ![Web](https://img.shields.io/badge/platform-Web-blue)

---

## Overview

ScamShield LE uses a two-layer detection engine — on-device speech recognition plus Claude API semantic analysis — to identify scam calls in real time. Anonymized signals are reported to law enforcement agencies and senior care facilities through dedicated portals, while families get push notifications and a shared dashboard.

**Three audiences, one platform:**
- 👮 **Law enforcement** — jurisdiction-level incident maps, pattern analysis, exportable case data
- 🏠 **Senior living facilities** — per-resident monitoring, staff alert feeds, family notifications
- 👨‍👩‍👧 **Families** — real-time notifications when a protected member receives a high-risk call

---

## Architecture

| Module | Tech | Port | Status |
|--------|------|------|--------|
| `app/` | Android · Kotlin · Jetpack Compose | — | ✅ Production-ready |
| `ios/` | iOS · SwiftUI · CallKit | — | ✅ Complete |
| `shared/` | Kotlin Multiplatform (KMM) | — | ✅ Complete |
| `api/` | Node.js · Express · Firestore | 4000 | ✅ Complete |
| `le-portal/` | Next.js 14 · Mapbox GL | 3001 | ✅ Complete |
| `retirement-portal/` | Next.js 14 · Tailwind | 3002 | ✅ Complete |
| `web/` | Next.js 14 · Firebase Auth | 3000 | ⚠️ Basic |
| `landing/` | Next.js 14 · Tailwind | — | ✅ Complete |

---

## Features

### Android App
- **Two-layer detection:** SpeechRecognizer (Layer 1) + Claude API semantic analysis (Layer 2)
- **Risk scoring:** Law enforcement claims, warrant language, payment requests, urgency phrases
- **Risk thresholds:** Low <40 · Medium 40–70 · High 70–90 · Critical >90
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
- Role-based auth: `super_admin` · `facility_admin` · `staff` (read-only)
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
| `JWT_SECRET` | ✅ | Secret for signing JWTs |
| `FIRESTORE_PROJECT_ID` | ✅ | GCP project ID |
| `PORT` | ✅ | Server port (default 4000) |
| `FTC_API_KEY` | ⚠️ recommended | Free key from api.data.gov |

### LE Portal (`le-portal/.env.local`)
| Variable | Required | Description |
|----------|----------|-------------|
| `LE_API_URL` | ✅ | Base URL of the LE API |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | ✅ | Mapbox GL access token |

### Retirement Portal (`retirement-portal/.env.local`)
| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | ✅ | Must match API JWT_SECRET |
| `LE_API_URL` | ✅ | Base URL of the LE API |

### Landing (`landing/.env.local`)
| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | ✅ | Resend API key for contact form |
| `TO_EMAIL` | ✅ | Destination email for submissions |

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
cd le-portal && npx vercel --prod          # → le-portal.scamshieldle.com
cd retirement-portal && npx vercel --prod  # → care.scamshieldle.com
cd web && npx vercel --prod                # → app.scamshieldle.com
cd landing && npx vercel --prod            # → scamshieldle.com
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
4. Privacy constraint: never log or store full phone numbers — area codes only
5. Run `make test` before submitting

**Good first issues:** contact form styling, iOS audit simulation screen, family dashboard analytics, Android package cleanup (notification/ vs notifications/)

---

## License

MIT © ScamShield LE Contributors — see [LICENSE](LICENSE)
# CISA/FTC Live Feed Setup

## What's Integrated

- **FTC DNC Complaints API** — reports of illegal robocalls and telemarketing calls filed with the FTC. Updates weekdays. Requires a free API key (see below) but falls back to FTC's daily CSV export if no key is set.
- **CISA Advisories RSS** — CISA's public advisory feed, filtered for vishing, phone scam, and government-impersonation content. No API key required.

## Get Your FTC API Key (free, ~1 minute)

1. Go to https://api.data.gov/signup/
2. Fill in name and email — you'll receive a key immediately
3. Add to your API .env: `FTC_API_KEY=your_key_here`

## Required Environment Variables

In `api/.env`:
```
FTC_API_KEY=your_api_data_gov_key   # Optional but recommended — enables JSON API vs CSV fallback
FIRESTORE_PROJECT_ID=your-gcp-project-id
```

## Wiring Up in api/src/app.ts

Add these 3 lines:

```typescript
// 1. Import
import feedsRouter from './routes/feeds';
import { startFeedScheduler } from './jobs/feedScheduler';

// 2. Mount router (with your existing routes)
app.use('/feeds', feedsRouter);

// 3. Start scheduler (after server starts)
startFeedScheduler();
```

## Install New Dependency

```bash
cd api && npm install node-cron xml2js && npm install -D @types/node-cron @types/xml2js
```

## Adding the Status Card to LE Portal Dashboard

In `le-portal/app/(dashboard)/dashboard/page.tsx`, import and add:

```tsx
import LiveFeedStatusCard from '../../components/LiveFeedStatusCard';

// Inside your dashboard grid:
<LiveFeedStatusCard />
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /feeds/status | Sync status, record counts, last error per source |
| POST | /feeds/sync | Manually trigger full ingest |

## Schedule

| Feed | Schedule |
|------|----------|
| FTC DNC | Weekdays at 13:00 UTC |
| CISA Advisories | Every 6 hours |

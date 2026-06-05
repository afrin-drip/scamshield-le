# ScamShield LE Portal

Secure law enforcement portal for scam incident data, GPS call-origin maps, and pattern analysis.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Mapbox GL JS · Recharts · Firebase Auth + JWT

---

## Setup

### 1. Get a Mapbox Token
Sign up at [mapbox.com](https://account.mapbox.com/) and create a public token.
Free tier covers **50,000 map loads/month**.

### 2. Configure Environment
```bash
cp .env.example .env.local
```
```env
NEXT_PUBLIC_LE_API_URL=https://your-scamshield-api.run.app
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...your-token
LE_JWT_SECRET=same-secret-as-your-api-server
```

### 3. Install & Run
```bash
cd le-portal
npm install
npm run dev
```

---

## Deploy to Vercel
```bash
npx vercel --prod
```
Set the same env vars in Vercel Dashboard → Project → Settings → Environment Variables.

---

## How Agencies Log In
1. Super-admin registers agency via the **Agencies** page (or API)
2. System issues an **Agency ID** and **API Key**
3. Agents visit the portal and enter Agency ID + API Key
4. JWT is stored in `localStorage`; agents are redirected to the dashboard

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Login |
| `/dashboard` | KPI cards, trend chart, recent incidents |
| `/map` | GPS heat map — scam call origin by area code |
| `/incidents` | Filterable incident table with CSV export |
| `/patterns` | Signal trends, peak hours heatmap, script clusters |
| `/agencies` | Agency management (super-admin only) |

---

## Map Features (`/map`)

- Circle markers at US area code centroids — 🔴 Critical · 🟠 Likely Scam · 🟡 Suspicious
- Marker size scales with incident count
- Click marker → popup: area code, city, incident count, top signal, last seen
- Heatmap density layer toggle
- Time filter: 7d / 30d / 90d / All
- State boundary GeoJSON overlay

---

## Security Notes

- All API calls require a valid JWT
- Deploy behind VPN or IP allowlist for production LE use
- `robots.txt` blocks all crawlers
- JWT secret must be ≥ 32 characters

---

*ScamShield LE v1.0 — Restricted to authorized law enforcement agencies*

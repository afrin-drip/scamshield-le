# Deploying ScamShield LE to Vercel

## Overview
There are two web apps to deploy:
- **Family Dashboard** (`web/`) — `scamshield-family-dashboard.vercel.app`
- **LE Portal** (`le-portal/`) — `scamshield-le-portal.vercel.app`

## Prerequisites
- Vercel account (free) — sign up at vercel.com with your GitHub account
- Firebase project set up (see FIREBASE_SETUP.md)
- Mapbox account (free) — sign up at mapbox.com for LE Portal map

## Step 1 — Install Vercel CLI
```bash
npm install -g vercel
vercel login
```

## Step 2 — Deploy Family Dashboard
```bash
cd web
cp .env.example .env.local
# Edit .env.local with your Firebase config
vercel
# Follow prompts — say YES to detected Next.js settings
# Set environment variables when prompted:
# NEXT_PUBLIC_FIREBASE_API_KEY → your Firebase API key
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN → your-project.firebaseapp.com
# NEXT_PUBLIC_FIREBASE_PROJECT_ID → your-project-id
```
Your dashboard will be live at: https://scamshield-family-dashboard.vercel.app

## Step 3 — Deploy LE Portal
```bash
cd ../le-portal
cp .env.example .env.local
# Edit .env.local with your API URL and Mapbox token
vercel
# Set environment variables:
# NEXT_PUBLIC_LE_API_URL → https://your-api.run.app (from Cloud Run)
# NEXT_PUBLIC_MAPBOX_TOKEN → pk.eyJ1... (from mapbox.com/account/access-tokens)
```
Your LE portal will be live at: https://scamshield-le-portal.vercel.app

## Step 4 — Add Custom Domain (Optional, ~$12/year)
```bash
vercel domains add scamshieldapp.com
vercel alias scamshield-le-portal.vercel.app le.scamshieldapp.com
vercel alias scamshield-family-dashboard.vercel.app family.scamshieldapp.com
```

## Step 5 — Deploy LE Backend API (Google Cloud Run)
```bash
cd ../api
npm install
npm run build
# Make sure Docker is installed
cd ..
bash api/deploy-cloudrun.sh
```
The API will be live at: https://scamshield-le-api-xxxx-uc.a.run.app

## Environment Variables Reference

### Family Dashboard (`web/.env.local`)
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
```

### LE Portal (`le-portal/.env.local`)
```
NEXT_PUBLIC_LE_API_URL=https://scamshield-le-api-xxxx-uc.a.run.app
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6...
LE_JWT_SECRET=same-secret-as-api-server
```

### LE API (`api/.env`)
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
LE_API_SECRET=generate-with-openssl-rand-base64-32
PORT=3000
ALLOWED_ORIGINS=https://scamshield-le-portal.vercel.app
```

## Mapbox Setup (Free)
1. Go to mapbox.com → Sign up free
2. Account → Access Tokens → Create a token
3. Copy the `pk.eyJ1...` token
4. Paste into `le-portal/.env.local` as NEXT_PUBLIC_MAPBOX_TOKEN
5. Free tier: 50,000 map loads/month (more than enough for LE use)

## Auto-Deploy on Push
Once connected to Vercel, every push to the `main` branch automatically redeploys. To connect:
1. Go to vercel.com/dashboard
2. New Project → Import from GitHub → select `afrin-drip/scamshield-le`
3. Set Root Directory to `web` (for family dashboard) or `le-portal` (for LE portal)
4. Add environment variables
5. Deploy

## Verify Deployment
- Family Dashboard: visit your Vercel URL → should see "ScamShield LE — Family Dashboard" login
- LE Portal: visit your Vercel URL → should see "ScamShield LE — Law Enforcement Portal" login + map

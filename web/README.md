# ScamShield LE — Web Dashboard

Next.js 14 companion dashboard for the ScamShield LE mobile app.

## Prerequisites

- Node.js 18+
- A Firebase project with Firestore enabled
- The ScamShield LE Android app writing incidents to Firestore

## Setup

### 1. Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com) and create or open your project.
2. Enable **Authentication** → Google sign-in provider.
3. Enable **Firestore Database** in production mode.
4. Add Firestore security rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /incidents/{id} {
      allow read, write: if request.auth != null;
    }
    match /familyMembers/{id} {
      allow read, write: if request.auth != null;
    }
  }
}
```
5. Go to **Project Settings → Your apps** and copy the Firebase config object.

### 2. Environment Variables

Create `web/.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Install & Run

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub (already done).
2. Go to [vercel.com](https://vercel.com) → New Project → import this repo.
3. Set **Root Directory** to `web`.
4. Add the environment variables in Vercel project settings.
5. Deploy.

## Project Structure

```
web/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard/page.tsx
│   ├── incidents/[id]/page.tsx
│   └── family/page.tsx
├── components/
│   ├── RiskBadge.tsx
│   ├── IncidentCard.tsx
│   ├── SignalChip.tsx
│   └── FamilyMemberRow.tsx
└── lib/
    ├── firebase.ts
    ├── types.ts
    └── api.ts
```

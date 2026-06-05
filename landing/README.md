# ScamShield LE — Landing Page

Public-facing marketing site for [scamshieldle.com](https://scamshieldle.com).

**Stack:** Next.js 14 · TypeScript · Tailwind CSS

## Quick Start

```bash
cd landing
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

```bash
npm i -g vercel
cd landing
vercel --prod
```

In the Vercel dashboard: add domain `scamshieldle.com` and set DNS CNAME → `cname.vercel-dns.com`.

## Pages

| Route | File |
|-------|------|
| `/` | `app/page.tsx` |
| `/privacy` | `app/privacy/page.tsx` |
| `/contact` | `app/contact/page.tsx` |

## Contact form

Wire `app/contact/page.tsx` → `handleSubmit` to your email provider by adding
`app/api/contact/route.ts`.

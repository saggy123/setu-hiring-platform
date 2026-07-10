# Setu — Hiring Platform Prototype

A two-sided hiring platform prototype (recruiter + applicant) built with React, Vite, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the prompts (accept the defaults — Vercel auto-detects Vite).

### Option B — GitHub + Vercel dashboard
1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com/new and import the repo.
3. Vercel will auto-detect the Vite framework, set:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click Deploy.

No environment variables are needed — this is a static frontend prototype with in-memory demo data (nothing persists between page reloads).

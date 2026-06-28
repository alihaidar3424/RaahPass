# RaahPass

Bilingual driving test practice app for Pakistan. Learners take 20-question mock exams in **English** or **Urdu**, review answers, and read driving guidelines — no account required.

- **247 text MCQs** (Phase 1 — no sign images)
- **70% pass threshold** · server-side scoring · attempt persistence
- **PWA-ready** (installable, offline fallback)
- **Light & dark mode** · system preference + manual toggle
- **Full-stack Next.js** with PostgreSQL via Prisma

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| Backend | Next.js Server Actions |
| Database | PostgreSQL + Prisma 6 |
| Validation | Zod |
| Tests | Vitest |

## Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL)
- npm

## Local setup

```bash
# 1. Clone and install
git clone https://github.com/alihaidar3424/RaahPass.git
cd RaahPass
npm install

# 2. Environment
cp .env.example .env

# 3. Start PostgreSQL (host port 5433 — avoids conflict with other Postgres on 5432)
docker compose up -d

# 4. Apply schema and seed (247 questions + 19 guidelines)
npm run db:push
npm run db:seed

# 5. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm test` | Run unit tests |
| `npm run db:push` | Sync Prisma schema to database |
| `npm run db:migrate` | Create/apply migrations (dev) |
| `npm run db:migrate:deploy` | Apply migrations (production) |
| `npm run db:seed` | Seed questions and guidelines |
| `npm run db:studio` | Open Prisma Studio |

## Project structure

```
app/                  # Next.js pages (home, start, quiz, result, review, guidelines)
components/           # UI components (quiz, layout, PWA)
data/                 # Seed source: questions JSON + guidelines TS
lib/                  # Server actions, translations, validations
prisma/               # Schema, migrations, seed script
public/               # PWA icons, service worker
reference/            # Local-only source PDFs, images, design mocks (gitignored)
scripts/              # Build utilities (icon generation)
```

## App routes

| Route | Purpose |
|-------|---------|
| `/` | Home — language selection, start CTA |
| `/start` | Name, phone, privacy note → creates attempt |
| `/quiz/[attemptId]` | 20-question mock exam |
| `/result/[attemptId]` | Score and pass/fail |
| `/review/[attemptId]` | Per-question answer review |
| `/guidelines` | Driving guidelines index |
| `/guidelines/[slug]` | Guideline article |
| `/offline` | PWA offline fallback |
| `/api/health` | Database health check |

## Deployment (Vercel)

### Step 1 — Create a free PostgreSQL database

Pick one provider below, create a project, and copy the **connection string** (must include `?sslmode=require` for Neon).

### Step 2 — Push code to GitHub

Ensure `main` is pushed to https://github.com/alihaidar3424/RaahPass

### Step 3 — Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the **RaahPass** repository
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: `./` (default)

### Step 4 — Environment variables

In **Project → Settings → Environment Variables**, add:

| Name | Value | Environments |
|------|-------|--------------|
| `DATABASE_URL` | `postgresql://...` from Neon/Supabase | Production, Preview, Development |

### Step 5 — Deploy

Click **Deploy**. The build runs:

```text
prisma generate → generate icons → prisma migrate deploy → next build
```

### Step 6 — Seed production (one time)

From your machine (or Vercel CLI):

```bash
DATABASE_URL="your-production-connection-string" npm run db:seed
```

This loads **247 questions** and **19 guidelines**.

### Step 7 — Verify

- Open your Vercel URL (e.g. `https://raahpass.vercel.app`)
- Visit `/api/health` — should return `{ "status": "ok", "database": "connected" }`
- Take a full practice test

### Optional — Custom domain

Vercel → Project → **Settings → Domains** → add your domain and update DNS.

---

## Free PostgreSQL providers (recommended)

| Provider | Free tier | Best for | Notes |
|----------|-----------|----------|-------|
| **[Neon](https://neon.tech)** | 0.5 GB storage, 1 project | **Recommended for Vercel** | Serverless Postgres, auto-suspend, fast cold start, great Vercel integration |
| **[Supabase](https://supabase.com)** | 500 MB, 2 projects | Apps that may add auth later | Postgres + optional dashboard; use **direct connection** or **pooler** URL for Prisma |
| **[Vercel Postgres](https://vercel.com/storage/postgres)** | Via Neon partnership | Simplest Vercel setup | One-click from Vercel dashboard; sets `DATABASE_URL` automatically |
| **[Railway](https://railway.app)** | $5 trial credit / limited free | Quick experiments | Easy UI; free tier limited over time |
| **[ElephantSQL](https://www.elephantsql.com)** | Tiny free “Tiny Turtle” plan | Very small MVPs | 20 MB limit — too small for growth |
| **[Aiven](https://aiven.io)** | Free tier available | EU/regional hosting | Good if you need specific regions |

**Recommendation for RaahPass:** Use **Neon** or **Vercel Postgres**. Both work well with Prisma on Vercel serverless.

**Neon connection string example:**

```text
postgresql://user:password@ep-xxxx.region.aws.neon.tech/raahpass?sslmode=require
```

**Supabase pooler (for serverless):**

```text
postgresql://postgres.[ref]:[password]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |

See `.env.example` for local and production examples.

## Reference material

Source PDFs, sign images, design mocks, and dataset build scripts live in **`reference/`** (gitignored). The running app only needs `data/text-questions-bilingual.json` and `data/guidelines.ts`.

## License

Private — all rights reserved.

# Learn2Drive 🚗

Teen Driver Training Tracker — Missouri edition.

## Features

- **Driver Profiles** — Multiple drivers, each with 8-phase/95-skill checklist
- **16th Birthday Countdown** — Live countdown for each driver
- **Progress Tracking** — Per-skill status: not started / in progress / completed
- **Driving Log** — Log sessions with date, duration, location, notes
- **Notes** — Instructor notes per driver
- **Quiz Center** — 100 Missouri DMV questions across 13 topics, practice tests, topic drills

## Tech Stack

- **Next.js 16** (App Router, TypeScript, standalone output)
- **Prisma** ORM with **Neon Postgres** (pooled runtime URL + direct URL for migrations)
- **Fly.io** for the app
- **TailwindCSS** + custom CSS design system

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Paste your Neon connection strings:
#   DATABASE_URL  = pooled host (contains `-pooler`)
#   DIRECT_URL    = same credentials with `-pooler` removed from the hostname

# 3. Run database migrations
npx prisma migrate deploy

# 4. Seed quiz questions (safe to re-run; skips if questions already exist)
npx prisma db seed

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Creating a driver copies the 8-phase / 95-skill checklist into that driver's profile.

## Neon database

1. Create a project at [console.neon.tech](https://console.neon.tech).
2. Copy **both** connection strings from the dashboard:
   - **Pooled** → `DATABASE_URL` (hostname includes `-pooler`)
   - **Direct** → `DIRECT_URL` (same host without `-pooler`)
3. Keep `sslmode=require` on both.

Prisma Client uses the pooled URL. `prisma migrate` uses the direct URL.

If you are moving off Fly Postgres, dump the old database and restore into Neon before pointing the app at it:

```bash
# From a machine that can reach Fly Postgres
fly postgres connect -a learn2drive-db
pg_dump "$OLD_DATABASE_URL" --no-owner --no-acl > learn2drive.dump.sql
psql "$DIRECT_URL" < learn2drive.dump.sql
```

Then set the Fly app secrets to the Neon URLs (below). After a successful cutover you can destroy the Fly Postgres app.

## Deploy to Fly.io

```bash
# First time setup
fly apps create learn2drive

# Neon connection strings — do not attach Fly Postgres
fly secrets set \
  DATABASE_URL="postgresql://USER:PASSWORD@ep-xxx-pooler.REGION.aws.neon.tech/neondb?sslmode=require" \
  DIRECT_URL="postgresql://USER:PASSWORD@ep-xxx.REGION.aws.neon.tech/neondb?sslmode=require"

# Deploy (runs prisma migrate deploy as the release command)
fly deploy
```

Seed quiz questions from your laptop against Neon (uses `DIRECT_URL`). It is safe to re-run; it skips when questions already exist:

```bash
npx prisma db seed
```

## Database Schema

| Table | Purpose |
|-------|---------|
| `Driver` | Driver profiles (name, birthDate, startDate) |
| `Phase` | 8 training phases **per driver** |
| `Skill` | 95 skills across phases |
| `SkillProgress` | Per-driver skill status + notes/feedback |
| `DrivingLog` | Driving session logs |
| `QuizQuestion` | 100 DMV quiz questions |
| `QuizResult` | Quiz attempt history |

## Resetting the Database

```bash
# Local (destroys data)
npx prisma migrate reset
npx prisma db seed

# Production — avoid migrate reset. Restore from a Neon branch/backup instead.
```

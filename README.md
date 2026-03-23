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

- **Next.js 15** (App Router, TypeScript, standalone output)
- **Prisma** ORM with PostgreSQL (Neon)
- **Fly.io** deployment
- **TailwindCSS** + custom CSS design system

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# 3. Run database migrations
npx prisma db push

# 4. Seed the database (phases, skills, quiz questions)
npx prisma db seed

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Fly.io

```bash
# First time setup
fly apps create learn2drive
fly secrets set DATABASE_URL="your-neon-postgres-url"

# Deploy
fly deploy

# After first deploy — run seed on production
fly ssh console -C "npx prisma db seed" -a learn2drive
```

## Database Schema

| Table | Purpose |
|-------|---------|
| `Driver` | Driver profiles (name, birthDate, startDate) |
| `Phase` | 8 training phases |
| `Skill` | 95 skills across phases |
| `SkillProgress` | Per-driver skill status + notes/feedback |
| `DrivingLog` | Driving session logs |
| `DriverNote` | Instructor notes |
| `QuizQuestion` | 100 DMV quiz questions |
| `QuizResult` | Quiz attempt history |

## Resetting the Database

```bash
# Local
npx prisma db push --force-reset
npx prisma db seed

# Production
fly ssh console -a learn2drive
> npx prisma db push --force-reset
> npx prisma db seed
```

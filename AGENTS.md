<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

`learn2drive` is a single Next.js 16 (App Router, Turbopack, `output: 'standalone'`) app backed by Prisma + Neon Postgres. Standard scripts live in `package.json` (`dev`, `build`, `start`, `lint`, `seed`); DB workflow is documented in `README.md`. The update script already runs `npm ci` and `npx prisma generate` on startup, so those are done before you begin.

### Database is required and not auto-provisioned
The app will not run without a Postgres database. `lib/prisma.ts` throws if `DATABASE_URL` is unset, and every API route hits the DB.

- Prisma needs two env vars in `.env` (gitignored): `DATABASE_URL` (Neon **pooled** host, contains `-pooler`) and `DIRECT_URL` (same credentials with `-pooler` removed). `prisma migrate`/`db seed` use `DIRECT_URL`; the app runtime uses `DATABASE_URL`. See `.env.example`.
- No DB secrets are configured in this environment by default. If a user later adds persistent `DATABASE_URL`/`DIRECT_URL` secrets (a real Neon project), prefer those. Otherwise provision a throwaway Postgres in seconds with no signup:

  ```bash
  curl -s -X POST "https://neon.new/api/v1/database" -H "Content-Type: application/json" -d '{"ref":"agent-skills"}'
  ```

  Take the returned `connection_string` as `DATABASE_URL`, and make `DIRECT_URL` by deleting `-pooler` from the hostname. These claimable DBs expire after ~72h, so a fresh one is usually needed each session (the previous session's `.env` may be stale/expired).

### Bring the DB up to date before running
After `.env` exists, run these (they are NOT in the update script because they need a live DB):

```bash
npx prisma migrate deploy   # applies prisma/migrations
npx prisma db seed          # loads ~99 DMV quiz questions; safe to re-run
```

Creating a driver copies the 8-phase / 95-skill checklist (`lib/training-phases.ts`) into that driver's profile — that is why a new driver shows "95 remaining".

### Run / verify
- Dev server: `npm run dev` → http://localhost:3000 (Turbopack). Quick health checks: `curl localhost:3000/api/quiz/questions?count=1` and `curl localhost:3000/api/drivers`.
- Lint: `npm run lint`. Build (production): `npm run build`.
- Do not commit `.env` (contains DB credentials; already gitignored).

#!/bin/sh
set -eu

# Runs on every Fly deploy (see fly.toml release_command).
# Needs DATABASE_URL and DIRECT_URL from `fly secrets`.

if [ -z "${DIRECT_URL:-}" ]; then
  echo "DIRECT_URL is not set. Add it with: fly secrets set DIRECT_URL=..."
  exit 1
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is not set. Add it with: fly secrets set DATABASE_URL=..."
  exit 1
fi

prisma migrate deploy
tsx prisma/seed.ts

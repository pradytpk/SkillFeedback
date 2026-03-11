#!/bin/sh
set -e

echo "==> Applying database migrations..."
node_modules/.bin/prisma migrate deploy

echo "==> Seeding built-in skill categories and skills (idempotent)..."
node_modules/.bin/tsx prisma/seed.ts

echo "==> Starting SkillTracker..."
exec node .next/standalone/server.js

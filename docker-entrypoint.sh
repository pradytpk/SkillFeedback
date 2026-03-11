#!/bin/sh
set -e

echo "==> Applying database migrations..."
node_modules/.bin/prisma migrate deploy

echo "==> Checking if seed is needed..."
COUNT=$(node -e "
const { PrismaClient } = require('./src/generated/prisma/client');
const p = new PrismaClient();
p.skillCategory.count()
  .then(n => { process.stdout.write(String(n)); return p.\$disconnect(); })
  .catch(() => { process.stdout.write('0'); });
")

if [ "$COUNT" = "0" ]; then
  echo "==> Seeding built-in skill categories and skills..."
  node_modules/.bin/tsx prisma/seed.ts
else
  echo "==> Database already seeded ($COUNT categories found), skipping."
fi

echo "==> Starting SkillTracker..."
exec node .next/standalone/server.js

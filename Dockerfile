FROM node:20-alpine
WORKDIR /app

# Install native deps needed by Prisma on Alpine
RUN apk add --no-cache libc6-compat openssl

# Install all dependencies (including dev — needed for prisma CLI and tsx)
COPY package.json package-lock.json ./
RUN npm ci

# Copy full source
COPY . .

# Generate Prisma client into src/generated/prisma/
RUN npx prisma generate

# Build Next.js (standalone mode → produces .next/standalone/server.js)
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/app/data/dev.db"
RUN npm run build

# Copy static assets into the standalone bundle (required for standalone server)
RUN cp -r .next/static .next/standalone/.next/static && \
    cp -r public .next/standalone/public 2>/dev/null || true

# Persistent directory for the SQLite database (mounted as a Docker volume)
RUN mkdir -p /app/data

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/data/dev.db"

ENTRYPOINT ["./docker-entrypoint.sh"]

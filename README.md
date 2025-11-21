# TinyLink

TinyLink — Production-ready URL shortener built with Next.js (App Router), Neon (Postgres) and Prisma.

Quick Start (Windows PowerShell):

```powershell
# Install deps
npm install

# Create .env from .env.example and set DATABASE_URL and BASE_URL
notepad .env

# Generate prisma client and run dev migrate
npx prisma generate
npx prisma migrate dev --name init

# Run dev server
npm run dev
```

Endpoints:
- `POST /api/links` - create new link (body: `{ url, code? }`)
- `GET /api/links` - list
- `GET /api/links/:code` - get single link
- `DELETE /api/links/:code` - delete
- `GET /:code` - redirect (increments clicks)
- `GET /healthz` - health check

Env:
- `DATABASE_URL` (Postgres)
- `BASE_URL` (used by server-side code)

Notes:
- Deploy frontend + API to Vercel and DB to Neon.tech
- Prisma schema in `prisma/schema.prisma`.
# TinyLink

TinyLink — Minimal URL shortener built with Next.js (App Router), Neon (Postgres) and Prisma.

## Features

- Create short links with custom or auto-generated codes
- Click tracking and analytics
- Responsive web interface
- Form validation and error handling
- Health check endpoint
- Proper 404 handling for invalid links

## Quick Start

```powershell
# Install dependencies
npm install

# Create .env from .env.example and configure
copy .env.example .env
notepad .env

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev --name init

# Start development server
npm run dev

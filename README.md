# ESS India - Enterprise Digital Transformation Platform

A production-ready Enterprise Corporate Website and CMS platform built with Next.js 15, Drizzle ORM, Supabase, Redis, and deployed on a Linux VPS.

## 🚀 Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion, Shadcn UI
- **Backend APIs:** Native Next.js Server Actions/Route Handlers running strictly on YOUR VPS (No heavy Edge Functions)
- **Database:** PostgreSQL (via Supabase ONLY), Drizzle ORM
- **Authentication:** Supabase Auth (Client & Server via Session Cookies)
- **Media Storage:** Cloudflare R2 (S3-compatible Object Storage for media assets)
- **Caching & Rate Limiting:** Redis (Self-hosted via Docker)
- **Infrastructure:** Docker, Nginx, PM2, Ubuntu VPS (All Business Logic stays on your VPS)

## 📂 Architecture overview

- `src/app`: Next.js App Router with Route Groups (`(public)`, `(admin)`)
- `src/components/blocks`: Reusable CMS dynamic blocks (Hero, Services, Industries, etc.)
- `src/components/cms`: Section rendering engine for dynamic pages
- `src/components/ui`: Shadcn UI components
- `src/lib/db`: Database connection and Drizzle Schema (PostgreSQL)
- `src/lib/supabase`: Server and Browser clients for Supabase Auth + Middleware
- `src/lib/storage/r2.ts`: Cloudflare R2 Client (AWS S3 SDK) for media management
- `src/lib/redis`: Redis client setup with caching helpers
- `src/repositories`: Data access layer bridging DB with business logic exclusively running on your VPS

## 🛠️ Setup Instructions

### 1. Environment Variables

Create a `.env.local` for local development:
```env
# Database & Auth (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_postgresql_connection_string

# Caching & Session (Redis)
REDIS_URL=redis://localhost:6379

# Media Storage (Cloudflare R2)
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_key
CLOUDFLARE_R2_BUCKET_NAME=essind-media
NEXT_PUBLIC_R2_PUBLIC_URL=https://media.yourdomain.com
```

### 2. Local Development

```bash
# Install dependencies
npm install

# Start redis (requires Docker)
docker run --name essind-redis -p 6379:6379 -d redis:7-alpine

# Run DB Migrations
npm run db:push # Make sure to add this script: drizzle-kit push

# Start Dev Server
npm run dev
```

### 3. Production Deployment (Ubuntu VPS)

```bash
# Clone the repository to the VPS

# Create .env.production file
cp .env.local .env.production

# Run using docker-compose (Web + Redis + Nginx)
docker-compose up -d --build

# OR Deploy using PM2 directly on the host machine
npm run build
pm2 start ecosystem.config.js
pm2 save
```

## ✨ Enterprise Features
- **Dynamic SEO-friendly Slugs:** No page IDs in URL. Uses hierarchical slugs for unlimited nesting.
- **Section Builder:** Extendable `SectionRenderer` linking CMS data to React components.
- **Repository Pattern:** Separated DB access layer with integrated Redis caching.
- **Enterprise UI:** TailwindCSS with Framer Motion and scalable design system.

# GoGMGo Website — Database Guide

---

## Overview

The application uses **Prisma ORM** with either SQLite (development / simple production) or PostgreSQL (recommended production).

### Data models

| Model | Purpose | Records |
|-------|---------|---------|
| `AdminUser` | Admin panel login credentials | One per admin user |
| `SiteSettings` | Global CMS settings (SEO, analytics, integrations) | Always exactly one row (id = `"singleton"`) |
| `LegalPage` | Privacy Policy and Terms content | One per legal page (slug-keyed) |

---

## Schema Reference

```prisma
model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String           // bcrypt, 12 rounds
  createdAt    DateTime @default(now())
}

model SiteSettings {
  id                    String  @id @default(cuid())
  siteName              String  @default("GoGMGo")
  defaultSeoTitle       String
  defaultSeoDescription String
  hubspotPortalId       String  @default("")
  hubspotFormId         String  @default("")
  hubspotTrackingScript String  @default("")
  whatsappNumber        String  @default("")
  supportEmail          String  @default("")
  googleAnalyticsId     String  @default("")
  googleTagManagerId    String  @default("")
  metaPixelId           String  @default("")
  clarityProjectId      String  @default("")
}

model LegalPage {
  id             String   @id @default(cuid())
  slug           String   @unique   // "privacy-policy" | "terms-and-conditions"
  title          String
  content        String   @default("")   // HTML from rich text editor
  seoTitle       String   @default("")
  seoDescription String   @default("")
  updatedAt      DateTime @updatedAt
}
```

---

## Migrations

Migrations live in `prisma/migrations/`. They are applied in order and are idempotent (safe to run multiple times).

| Migration | What it does |
|-----------|-------------|
| `20260508031938_init` | Creates AdminUser, SiteSettings, LegalPage tables |
| `20260508111845_add_analytics_fields` | Adds googleAnalyticsId, googleTagManagerId, metaPixelId, clarityProjectId to SiteSettings |

### Apply migrations on a new database

```bash
npx prisma migrate deploy
```

This applies all pending migrations in order. Safe to run on first deployment and on every update.

---

## Seed Script

`prisma/seed.ts` initialises the minimum required data:

```
1. Admin user:     admin@gogmgo.com / admin123!   (change immediately)
2. SiteSettings:   singleton record with empty analytics/integration fields
3. LegalPage:      privacy-policy with placeholder content
4. LegalPage:      terms-and-conditions with placeholder content
```

Run once after first migration:

```bash
npx tsx prisma/seed.ts
```

The seed uses `upsert` — safe to run again without duplicating data.

---

## SQLite: Exporting & Importing Data

SQLite stores everything in a single file. For production:

### Backup (server → local)

```bash
# On the server — create a timestamped backup:
cp /var/www/gogmgo/data/gogmgo.db /var/www/gogmgo/data/gogmgo_$(date +%Y%m%d_%H%M).db

# Download to local machine:
scp user@SERVER:/var/www/gogmgo/data/gogmgo.db ~/gogmgo_backup.db
```

### Restore

```bash
# Stop the app first:
pm2 stop gogmgo-website

# Replace the database:
cp ~/gogmgo_backup.db /var/www/gogmgo/data/gogmgo.db

# Restart:
pm2 start gogmgo-website
```

### Migrate current settings from development

If you have settings configured in your local development database that you want to carry to production, use Prisma Studio to note the values and re-enter them through the admin panel on the production site. The database content (analytics IDs, HubSpot keys, legal content) is all manageable through the admin UI — no SQL required.

---

## Switching to PostgreSQL (Recommended for Production)

SQLite is fine for single-server deployments with low to moderate traffic. For higher traffic, multiple instances, or managed database services (AWS RDS, Supabase, PlanetScale etc.) use PostgreSQL.

### Step 1 — Provision a PostgreSQL database

On AWS RDS, Supabase, or a self-hosted Postgres instance. Note the connection string:
```
postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME?schema=public
```

### Step 2 — Update schema.prisma

```prisma
datasource db {
  provider = "postgresql"   // ← change from "sqlite"
  url      = env("DATABASE_URL")
}
```

### Step 3 — Update .env.local

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME?schema=public"
```

### Step 4 — Apply migrations

```bash
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

### Step 5 — Rebuild

```bash
npm run build
pm2 restart gogmgo-website
```

---

## Automated Backups (SQLite)

Add a daily cron job to back up the SQLite file:

```bash
crontab -e
```

Add:
```cron
# Daily backup of GoGMGo database at 2 AM, keep 30 days
0 2 * * * cp /var/www/gogmgo/data/gogmgo.db /var/backups/gogmgo/gogmgo_$(date +\%Y\%m\%d).db
# Clean up backups older than 30 days
5 2 * * * find /var/backups/gogmgo/ -name "*.db" -mtime +30 -delete
```

```bash
sudo mkdir -p /var/backups/gogmgo
sudo chown $USER:$USER /var/backups/gogmgo
```

---

*Generated: May 2026 — GoGMGo Website v1.0*

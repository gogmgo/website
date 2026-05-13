# GoGMGo Website — Technical Deployment Handoff
### For AWS / Server Administrators

**Document version:** May 2026  
**Prepared from:** Production codebase, verified against `npm run build`

---

## Table of Contents

1. [Full Tech Stack](#1-full-tech-stack)
2. [Environment Variables (Complete)](#2-environment-variables-complete)
3. [AWS Deployment Architecture Recommendation](#3-aws-deployment-architecture-recommendation)
4. [Step-by-Step Production Deployment](#4-step-by-step-production-deployment)
5. [SEO + SSR Verification](#5-seo--ssr-verification)
6. [Security Review](#6-security-review)
7. [Final Launch Checklist](#7-final-launch-checklist)

---

## 1. Full Tech Stack

### Framework
| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend framework | **Next.js** (App Router) | 16.2.5 |
| UI language | **TypeScript** | ^5.x |
| Runtime | **Node.js** | ≥20 LTS required (dev runs 23.7.0 — do NOT use 23.x in production) |
| Package manager | **npm** | bundled with Node |

### Frontend
| Concern | Library | Version |
|---------|---------|---------|
| Styling | **Tailwind CSS v4** (CSS-based config, `@theme` variables) | ^4.x |
| Animations / parallax | **Framer Motion** | 12.38.0 |
| PostCSS | `@tailwindcss/postcss` | ^4 |
| Fonts | **Geist Sans + Geist Mono** via `next/font` (Google-free, self-hosted by Next.js) | bundled |
| Image optimisation | `next/image` — WebP/AVIF auto-conversion, quality tiers 75/88/90 | built-in |

### Backend / API
| Concern | Technology | Notes |
|---------|-----------|-------|
| API routes | **Next.js Route Handlers** (`app/api/`) | Server-side, Node.js runtime |
| Authentication | **NextAuth v5 (Auth.js beta.31)** | JWT session strategy; Credentials provider with bcrypt |
| Password hashing | **bcryptjs** | 12 rounds |
| Database ORM | **Prisma** | 6.19.3 |
| Development DB | **SQLite** | Absolute file path required at runtime |
| Production DB | **PostgreSQL** (recommended) | Requires schema.prisma provider change |
| Rich text editor | **TipTap v3** | Admin panel only; extensions: StarterKit, Link, Table |
| Form submission | **HubSpot Forms API** | Proxied via `/api/contact` — avoids CORS, keeps portal ID server-side |
| Environment loading | **dotenv** | Used by Prisma seed script (`import "dotenv/config"`) |

### CMS / Admin
The admin panel (`/admin`) is a self-contained Next.js route group using:
- Route group `(protected)` with a layout that verifies NextAuth session
- `/admin/settings` — reads/writes `SiteSettings` singleton row in DB
- `/admin/legal/[slug]` — reads/writes `LegalPage` content (HTML from TipTap)
- All admin mutations go through `/api/admin/*` which re-verify session server-side

### Analytics / Tracking (all injected server-side when configured in admin)
| Platform | Injection method |
|----------|----------------|
| Google Analytics 4 | `<Script>` with `gtag.js` in `app/layout.tsx` |
| Google Tag Manager | Head `<noscript>` + body `<noscript>` in layout |
| Meta (Facebook) Pixel | `fbq` base code in layout |
| Microsoft Clarity | Clarity snippet in layout |
| HubSpot Tracking | `hs-script-loader` in layout |

None are bundled at build time — all are conditionally injected based on admin settings read from DB on each server request.

### SEO Infrastructure
| Feature | Implementation |
|---------|--------------|
| Page metadata | `generateMetadata()` — server-side per route, reads DB |
| Canonical URL | Set via `alternates.canonical` in metadata |
| Open Graph | OG title/description/image per page |
| OG Image | `app/opengraph-image.tsx` — Node.js `ImageResponse`, pre-rendered static 1200×630 |
| Structured data | 4 JSON-LD schemas injected in `<head>` (SoftwareApplication, FAQPage, Organization, WebSite) |
| Sitemap | `app/sitemap.ts` — static, pre-rendered at build |
| Robots.txt | `app/robots.ts` — static, pre-rendered at build |
| Language | `lang="en-SG"` on `<html>` |
| Reduced motion | `MotionConfig reducedMotion="user"` wraps all animations |

### Build Tooling
- **Turbopack** (enabled by default in Next.js 16) — used for both dev and build
- `npm run build` compiles TypeScript, generates static pages, and outputs to `.next/`
- `npm run start` serves the production build on port 3000

---

## 2. Environment Variables (Complete)

### File: `.env.local` (production server)

> All variables below must be set. There is no optional variable — omitting any will break either auth, DB access, or URL generation.

---

### DATABASE

```env
DATABASE_URL="file:/absolute/path/to/gogmgo.db"
```
| Field | Detail |
|-------|--------|
| **Required** | Yes |
| **Dev value** | `file:/Users/jaredgoldberg1/gogmgo-website/prisma/prisma/dev.db` |
| **Prod SQLite** | `file:/var/www/gogmgo/data/gogmgo.db` — **MUST be an absolute path**. Relative paths resolve differently between `npx prisma` and the Next.js runtime, causing `PrismaClientInitializationError`. |
| **Prod PostgreSQL** | `postgresql://USER:PASSWORD@HOST:5432/gogmgo_prod?schema=public` |
| **Note** | To switch to PostgreSQL: change `provider = "postgresql"` in `prisma/schema.prisma`, then run `npx prisma migrate deploy`. |

---

### AUTHENTICATION

```env
NEXTAUTH_SECRET="<64-char random string>"
NEXTAUTH_URL="https://yourdomain.com"
AUTH_URL="https://yourdomain.com"
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXTAUTH_SECRET` | **Yes — MUST change** | Signs JWT session tokens. Generate with `openssl rand -base64 32`. If this is wrong or missing, all admin logins fail with a 500 or redirect loop. |
| `NEXTAUTH_URL` | **Yes** | Full production origin (no trailing slash). Used by NextAuth for callback URL construction and CSRF. Also used by `app/sitemap.ts`, `app/robots.ts`, and `app/page.tsx` to build canonical and JSON-LD URLs. |
| `AUTH_URL` | **Yes** | Identical to `NEXTAUTH_URL`. Auth.js v5 requires both. If only one is set, callback URLs will be wrong. |

> **Dev vs prod difference:** In development, set both to `http://localhost:3000`. In production, both must be the live HTTPS domain.

---

### FULL VARIABLE REFERENCE

```env
# ── Database ──────────────────────────────────────────────────────────────────
DATABASE_URL="file:/var/www/gogmgo/data/gogmgo.db"

# ── Authentication ────────────────────────────────────────────────────────────
NEXTAUTH_SECRET="<openssl rand -base64 32>"
NEXTAUTH_URL="https://yourdomain.com"
AUTH_URL="https://yourdomain.com"
```

There are no other environment variables loaded by the Next.js application at runtime.

All other configuration (HubSpot keys, analytics IDs, WhatsApp number, support email, SEO title/description) is stored in the **database** `SiteSettings` table and managed via the admin panel at `/admin/settings`. This is intentional — it allows content changes without redeployment.

> **Important:** There is no `HUBSPOT_API_KEY`, no `GA_MEASUREMENT_ID`, no `META_PIXEL_ID` in `.env`. These are in the database. The admin panel writes them there and the layout reads them on each server request.

---

## 3. AWS Deployment Architecture Recommendation

### Recommended Stack: EC2 + RDS + CloudFront

This project is a **server-rendered Next.js application** — it is not a static site. Pages like `/privacy-policy`, `/terms-and-conditions`, `/admin/*` are dynamically rendered on each request. This rules out pure static hosts (S3-only, Amplify static mode).

#### Recommended Architecture

```
Internet
    │
    ▼
Route 53 (DNS)
    │
    ▼
CloudFront (CDN + SSL termination)
    │
    ├── /assets/* ──────────────────► S3 bucket (large images, optional offload)
    │
    └── Everything else ─────────────► Application Load Balancer (ALB)
                                              │
                                              ▼
                                    EC2 (t3.small/t3.medium)
                                    Ubuntu 22.04 LTS
                                    Node 20 LTS
                                    PM2 → next start :3000
                                    Nginx → reverse proxy :80/:443
                                              │
                                              ▼
                                    RDS PostgreSQL (db.t3.micro)
                                    Private subnet, no public access
```

---

### Component Decisions

#### Compute: EC2 (recommended over ECS/Amplify)

| Option | Assessment |
|--------|-----------|
| **EC2** ✅ | Full control, predictable cost, simple Node+PM2+Nginx setup. Ideal for a single-origin marketing site with modest traffic. |
| ECS/Fargate | Adds container orchestration complexity with no meaningful benefit at this scale. Recommended only if horizontal autoscaling becomes necessary. |
| AWS Amplify | Amplify Gen 2 supports SSR but has constraints on custom server middleware, environment variable management, and Prisma binary compatibility. Not recommended. |
| Vercel | Excellent fit for this stack — handles SSR, edge, image optimisation natively. If budget allows, Vercel Pro eliminates most of the complexity below. Cost: ~$20/month vs EC2 ~$15-20/month for t3.small. Vercel is the zero-ops alternative. |

**Recommended EC2 instance:** `t3.small` (2 vCPU, 2 GB RAM) — sufficient for a marketing site. Upgrade to `t3.medium` (4 GB RAM) if you run Prisma migrations and build on the same instance.

**Recommended OS:** Ubuntu 22.04 LTS

---

#### Database: RDS PostgreSQL (recommended over SQLite)

SQLite works for a single-instance deployment but has limitations:
- No concurrent write safety under load
- No managed backups, point-in-time restore
- File must be on the same instance as the app

**Recommended:** `db.t3.micro` PostgreSQL 15 on RDS
- Sits in a **private subnet** (no public IP)
- Security group allows inbound 5432 only from the EC2 security group
- Enable automated backups with 7-day retention
- Enable Multi-AZ if uptime SLA > 99.5% is needed

Switch: Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`, update `DATABASE_URL` to the RDS endpoint connection string, and run `npx prisma migrate deploy`.

---

#### CDN: CloudFront

**Required** for this project because:
- Next.js serves large images (2.5 MB hero images) — CloudFront edge caching dramatically reduces time-to-first-byte for international visitors
- SSL termination at edge reduces latency
- CloudFront can cache `/_next/static/*` assets with `Cache-Control: immutable` (Next.js sets these headers)

**CloudFront setup:**
- Origin: ALB (or EC2 Elastic IP with Nginx on :443)
- Cache behaviour: `/_next/static/*` → Cache, TTL 31536000s (1 year)
- Cache behaviour: `/assets/*` → Cache, TTL 86400s (1 day)
- Cache behaviour: `/*` (default) → Forward all headers, no cache (SSR responses are dynamic)
- SSL: ACM certificate (free) on the CloudFront distribution

---

#### SSL: AWS Certificate Manager (ACM)

- Request a public certificate in **us-east-1** (required for CloudFront even if your region is different)
- Add both `yourdomain.com` and `*.yourdomain.com`
- Validate via DNS (add CNAME records in Route 53)
- Attach to CloudFront distribution

If not using CloudFront, use Certbot on the EC2 instance directly (Let's Encrypt, free, auto-renewing).

---

#### Image Storage: Keep in `public/` (EC2) for now

The project's images are in `public/assets/` (14 background images, ~28 MB total). These are served by Next.js image optimisation which converts to WebP/AVIF automatically.

**Optional optimisation:** Move large images to S3 and update `next.config.ts` to add an `images.remotePatterns` entry for the S3 bucket URL. CloudFront then caches the optimised images at edge. Not strictly necessary at launch.

---

#### Process Manager: PM2 (recommended over Docker)

Docker adds complexity (Prisma binary platform targeting, volume management for SQLite, secrets injection) without meaningful benefit for a single-instance deployment.

PM2 is simpler, battle-tested, and directly supported by Next.js documentation.

---

#### CI/CD: GitHub Actions (recommended)

Simple pipeline:
1. Push to `main` branch
2. GitHub Actions runs `npm run lint && npm run build`
3. On success: SSH into EC2, `git pull`, `npm install`, `npx prisma migrate deploy`, `npm run build`, `pm2 restart gogmgo-website`

---

#### Node Version for Production

**Node 20 LTS** — do not use 23.x in production (experimental). Install via NVM:

```bash
nvm install 20
nvm use 20
nvm alias default 20
```

---

## 4. Step-by-Step Production Deployment

### 4.1 Server Provisioning (EC2)

```bash
# 1. Launch EC2 instance
#    - AMI: Ubuntu 22.04 LTS (64-bit x86)
#    - Instance: t3.small minimum
#    - Storage: 20 GB gp3 SSD
#    - Security Group inbound rules:
#        22   (SSH)   — your IP only
#        80   (HTTP)  — 0.0.0.0/0 (redirected to 443 by Nginx)
#        443  (HTTPS) — 0.0.0.0/0
#    - Assign Elastic IP

# 2. SSH in and update system
sudo apt update && sudo apt upgrade -y

# 3. Install Node 20 via NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20 && nvm use 20 && nvm alias default 20
node --version  # must print v20.x.x

# 4. Install PM2 and Nginx
npm install -g pm2
sudo apt install nginx -y
sudo systemctl enable nginx

# 5. Create app directory
sudo mkdir -p /var/www/gogmgo
sudo chown -R $USER:$USER /var/www/gogmgo

# 6. Create data directory for SQLite (or skip if using RDS)
mkdir -p /var/www/gogmgo/data
```

---

### 4.2 Upload Source Code

```bash
# Option A: rsync from local machine
rsync -avz --exclude 'node_modules/' --exclude '.next/' --exclude '.env*' \
  ./gogmgo-website/ ubuntu@YOUR_EC2_IP:/var/www/gogmgo/

# Option B: git clone (if repo is private, use deploy key)
cd /var/www/gogmgo
git clone git@github.com:your-org/gogmgo-website.git .
```

---

### 4.3 Environment Variables

```bash
cd /var/www/gogmgo
cp .env.example .env.local
nano .env.local
```

Fill in exactly these values:

```env
DATABASE_URL="file:/var/www/gogmgo/data/gogmgo.db"
NEXTAUTH_SECRET="<output of: openssl rand -base64 32>"
NEXTAUTH_URL="https://yourdomain.com"
AUTH_URL="https://yourdomain.com"
```

Secure the file:
```bash
chmod 600 .env.local
```

---

### 4.4 Install Dependencies

```bash
cd /var/www/gogmgo
npm install
```

---

### 4.5 Generate Prisma Client (REQUIRED on every new server)

```bash
npx prisma generate
```

> This step is **mandatory**. The Prisma query engine binary is platform-specific. The Mac ARM64 binary shipped in `lib/generated/prisma/` will not function on a Linux x86 server. This command regenerates the correct binary for the server's OS and CPU architecture.

---

### 4.6 Run Database Migrations

```bash
npx prisma migrate deploy
```

This applies all migrations in order (`20260508031938_init` then `20260508111845_add_analytics_fields`). Safe to run on an empty database. Creates all three tables: `AdminUser`, `SiteSettings`, `LegalPage`.

---

### 4.7 Seed Initial Data

```bash
npx tsx prisma/seed.ts
```

Creates:
- Admin account: `admin@gogmgo.com` / `admin123!`
- `SiteSettings` singleton row (id=`"singleton"`)
- Placeholder Privacy Policy and Terms pages

> **CRITICAL:** Change the admin password immediately after first login. See Section 6 for instructions.

---

### 4.8 Production Build

```bash
npm run build
```

Expected: `✓ Generating static pages (14/14)` with zero TypeScript or lint errors.

**Build time:** ~30–60 seconds depending on instance size.

---

### 4.9 PM2 Configuration

Create `/var/www/gogmgo/ecosystem.config.js`:

```js
module.exports = {
  apps: [
    {
      name: "gogmgo-website",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/var/www/gogmgo",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "400M",
      error_file: "/var/log/gogmgo/error.log",
      out_file: "/var/log/gogmgo/out.log",
    },
  ],
}
```

```bash
sudo mkdir -p /var/log/gogmgo
sudo chown $USER:$USER /var/log/gogmgo

pm2 start ecosystem.config.js
pm2 save
pm2 startup   # follow the printed systemd command
```

Test:
```bash
curl http://localhost:3000   # should return HTML
pm2 status                   # should show "online"
```

---

### 4.10 Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/gogmgo
```

```nginx
# HTTP → HTTPS redirect
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # ── Next.js static assets — immutable, cache 1 year ──────────────
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # ── Public assets — cache 1 day ───────────────────────────────────
    location /assets/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }

    location /brand/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }

    # ── All other requests → Next.js ─────────────────────────────────
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 30s;
    }

    client_max_body_size 20M;

    # Rate limiting for admin and API routes
    limit_req_zone $binary_remote_addr zone=admin:10m rate=10r/m;
    location /admin/ {
        limit_req zone=admin burst=5 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    location /api/ {
        limit_req zone=admin burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/gogmgo /etc/nginx/sites-enabled/
sudo nginx -t   # must print "syntax is ok" and "test is successful"
sudo systemctl reload nginx
```

---

### 4.11 SSL — Let's Encrypt (Certbot)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
# Follow prompts. Certbot auto-edits Nginx config with certificate paths.

# Verify auto-renewal
sudo certbot renew --dry-run
```

Certbot installs a cron job (or systemd timer) that auto-renews before expiry. Certificates expire every 90 days.

---

### 4.12 DNS

In Route 53 (or your DNS provider):

| Record | Type | Value |
|--------|------|-------|
| `yourdomain.com` | A | EC2 Elastic IP |
| `www.yourdomain.com` | A | EC2 Elastic IP (Nginx redirects www → root) |

DNS propagation: 5 minutes (Route 53) to 48 hours (other providers).

---

### 4.13 First Admin Login

1. Browse to `https://yourdomain.com/admin/login`
2. Login: `admin@gogmgo.com` / `admin123!`
3. Go to Settings — configure:
   - HubSpot Portal ID + Form ID
   - WhatsApp number (E.164 format, e.g. `6591234567`)
   - Support email
   - GA4 / GTM / Meta Pixel / Clarity IDs
4. Update Privacy Policy and Terms content
5. **Change admin password immediately** (see Section 6.1)

---

### 4.14 Deploying Updates

```bash
cd /var/www/gogmgo

# 1. Pull latest code
git pull origin main        # or re-rsync from local

# 2. Install any new dependencies
npm install

# 3. Regenerate Prisma client (if schema changed)
npx prisma generate

# 4. Apply any new migrations (safe to run; skips already-applied)
npx prisma migrate deploy

# 5. Rebuild
npm run build

# 6. Zero-downtime restart
pm2 reload gogmgo-website   # graceful restart — drains existing connections first
```

> `pm2 reload` (not `pm2 restart`) performs a graceful reload with zero-downtime by starting a new process before killing the old one. Use `pm2 restart` only if `reload` doesn't pick up config changes.

---

## 5. SEO + SSR Verification

### Rendering Mode per Route

| Route | Mode | Notes |
|-------|------|-------|
| `/` | **Static** (pre-rendered at build) | Metadata generated at build via `generateMetadata()` which reads DB at build time |
| `/privacy-policy` | **Dynamic SSR** | Rendered on each request; content from DB |
| `/terms-and-conditions` | **Dynamic SSR** | Rendered on each request; content from DB |
| `/sitemap.xml` | **Static** | Pre-rendered at build; uses `NEXTAUTH_URL` for base URL |
| `/robots.txt` | **Static** | Pre-rendered at build; uses `NEXTAUTH_URL` for sitemap URL |
| `/opengraph-image` | **Static** | Pre-rendered 1200×630 PNG at build time |
| `/icon.png` | **Static** | Pre-rendered at build |
| `/apple-icon.png` | **Static** | Pre-rendered at build |
| `/admin/*` | **Dynamic SSR** | Auth-protected; never indexed |
| `/api/*` | **Dynamic** (serverless function equivalent) | Never indexed |

### Homepage metadata: Fully server-side ✅

`app/page.tsx` exports `generateMetadata()`, an async function that:
1. Reads `SiteSettings` from DB
2. Returns `title`, `description`, `alternates.canonical`, and `openGraph` metadata
3. This runs at **build time** for the homepage (since `/ ` is static)

> **Important implication:** If you change SEO settings in the admin panel after deployment, the homepage's `<title>` and `<meta description>` will NOT update until the next `npm run build`. The legal pages (`/privacy-policy`, `/terms-and-conditions`) ARE dynamic and pick up DB changes immediately.

**Workaround:** Convert `/ ` to dynamic rendering by adding `export const dynamic = "force-dynamic"` to `app/page.tsx`. This adds ~50–100ms per homepage request but makes admin SEO changes take effect immediately without rebuild.

### JSON-LD: Fully server-rendered ✅

All four JSON-LD schemas (`SoftwareApplication`, `FAQPage`, `Organization`, `WebSite`) are rendered as `<script type="application/ld+json">` tags in `app/page.tsx`. Since the homepage is statically pre-rendered, these are present in the raw HTML before any JavaScript executes.

Googlebot does not need to execute JavaScript to read them.

### Google crawlability without JavaScript ✅

Every public page sends complete HTML in the initial response:
- All marketing copy, headlines, section text are in the HTML
- Navigation links are standard `<a href>` elements
- Legal page content is server-rendered HTML from DB
- `sr-only` semantic content provides AI/crawler descriptions of interactive diagrams
- Product descriptions, partner names, features: all in raw HTML

The only content requiring JavaScript is:
- Scroll-triggered animations (degrade gracefully — content is still in DOM, just not animated)
- Product popup modals (triggered by user interaction — content accessible via `sr-only` elements)
- The 4-Hands SVG diagram (mobile fallback shows plain text lists)

### SEO deployment considerations

1. **Update hardcoded `https://gogmgo.com` references** in `app/page.tsx` JSON-LD schemas (Organization, WebSite, SoftwareApplication `"url"` and `"@id"` fields) to your actual domain before going live.

2. **`NEXTAUTH_URL` drives canonical URLs, sitemap, and robots.txt.** Set this correctly or Google will index wrong canonical URLs.

3. **OG image path:** `app/page.tsx` references `/opengraph-image` which resolves to `https://yourdomain.com/opengraph-image`. This is pre-rendered at build — verify it loads correctly after deployment.

4. **Submit sitemap** to Google Search Console: `https://yourdomain.com/sitemap.xml`

---

## 6. Security Review

### 6.1 Admin Panel

**Change default admin password immediately after first login.**

There is no password-reset UI. Change via Prisma or direct DB:

```bash
# Generate new bcrypt hash (12 rounds)
node -e "
const b = require('bcryptjs');
b.hash('YourNewSecurePassword!', 12).then(h => console.log(h));
"

# Update in SQLite
sqlite3 /var/www/gogmgo/data/gogmgo.db \
  "UPDATE AdminUser SET passwordHash='PASTE_HASH_HERE' WHERE email='admin@gogmgo.com';"

# Or for PostgreSQL
psql $DATABASE_URL -c \
  "UPDATE \"AdminUser\" SET \"passwordHash\"='PASTE_HASH_HERE' WHERE email='admin@gogmgo.com';"
```

**Admin route protection:** All `/admin/*` routes (except `/admin/login`) are protected by NextAuth's `authorized` callback in `auth.config.ts`. Unauthenticated requests are redirected to `/admin/login`. This is enforced at the Next.js middleware layer.

**Consider restricting `/admin` by IP at Nginx level** for additional hardening:
```nginx
location /admin/ {
    allow 203.0.113.0/24;   # your office/VPN IP range
    deny all;
    proxy_pass http://localhost:3000;
    ...
}
```

---

### 6.2 Secrets Handling

| Secret | Location | Risk |
|--------|---------|------|
| `NEXTAUTH_SECRET` | `.env.local` | If leaked, session tokens can be forged. Rotate by updating the variable and restarting PM2. All existing sessions immediately invalidated. |
| Admin password hash | Database | bcrypt with 12 rounds. Not reversible in practice. |
| HubSpot keys | Database `SiteSettings` table | Readable by anyone with DB access. Use DB access controls (RDS security groups). Not exposed in any public API response. |
| Analytics IDs | Database `SiteSettings` table | Low sensitivity — these are injected into page HTML and visible to all visitors anyway. |

**.env.local permissions:**
```bash
chmod 600 /var/www/gogmgo/.env.local
chown www-data:www-data /var/www/gogmgo/.env.local  # if running as www-data
```

**`.gitignore` confirms** `.env.local` is excluded from version control.

---

### 6.3 Database Exposure

**SQLite:** File lives on the EC2 instance at the configured absolute path. Protect with filesystem permissions:
```bash
chmod 600 /var/www/gogmgo/data/gogmgo.db
```

**PostgreSQL (RDS):**
- Place in a **private subnet** — no public IP, no internet gateway route
- Security group: allow inbound 5432 only from EC2 security group ID (not CIDR)
- Enable RDS encryption at rest
- Use a dedicated DB user with minimal privileges:

```sql
CREATE USER gogmgo_app WITH PASSWORD 'strong-password';
GRANT CONNECT ON DATABASE gogmgo_prod TO gogmgo_app;
GRANT USAGE ON SCHEMA public TO gogmgo_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO gogmgo_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO gogmgo_app;
```

---

### 6.4 Rate Limiting

The Nginx config in Section 4.10 applies rate limiting:
- `/admin/*` — 10 requests/minute per IP (burst 5)
- `/api/*` — 10 requests/minute per IP (burst 20)

This limits brute-force attacks on `/admin/login` and spam on `/api/contact`.

For `/api/contact` specifically, add a honeypot field or CAPTCHA (reCAPTCHA v3) on the frontend if spam becomes an issue. Currently no server-side CAPTCHA validation is implemented.

---

### 6.5 Form Spam Protection

`/api/contact` is a proxied HubSpot form submission endpoint. Current protection:
- Rate limiting via Nginx (see above)
- No CAPTCHA

**Recommended addition:** Add Google reCAPTCHA v3 or Cloudflare Turnstile to the contact form. The token would be verified in `/api/contact/route.ts` before proxying to HubSpot.

---

### 6.6 AWS Security Settings

```
EC2 Security Group:
  Inbound:
    22   TCP   your-ip/32      # SSH — your IP only
    80   TCP   0.0.0.0/0       # HTTP (redirected by Nginx)
    443  TCP   0.0.0.0/0       # HTTPS
  Outbound:
    All traffic allowed (needed for npm, Prisma, HubSpot API calls)

RDS Security Group (if using PostgreSQL):
  Inbound:
    5432  TCP  EC2-security-group-id   # DB only from app server
  Outbound:
    None needed

IAM:
  EC2 instance role: none required (no AWS SDK calls in application)
  If using S3 for image storage: attach minimal S3 read-only policy
```

**Enable AWS CloudTrail** for API audit logging.  
**Enable AWS GuardDuty** for threat detection ($3–5/month).  
**Enable EC2 automatic security patches:**
```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---

### 6.7 Backup Recommendations

**SQLite:**
```bash
# Add to crontab: daily backup at 2 AM, keep 30 days
0 2 * * * cp /var/www/gogmgo/data/gogmgo.db /var/backups/gogmgo/gogmgo_$(date +\%Y\%m\%d).db
5 2 * * * find /var/backups/gogmgo/ -name "*.db" -mtime +30 -delete
```
Copy backups to S3 for off-instance durability:
```bash
aws s3 cp /var/backups/gogmgo/gogmgo_$(date +%Y%m%d).db s3://your-backup-bucket/gogmgo/
```

**PostgreSQL (RDS):** Enable automated backups with 7-day retention in RDS console. Enable point-in-time recovery.

**Application code:** Source-controlled in Git. The `.next/` build output is reproducible from source — no need to back it up.

---

## 7. Final Launch Checklist

Use this checklist before directing live traffic to the server.

### Infrastructure
- [ ] EC2 instance running, Elastic IP assigned
- [ ] Security group rules: 22 (your IP only), 80 and 443 (0.0.0.0/0)
- [ ] Nginx installed, enabled, and running (`systemctl status nginx`)
- [ ] PM2 running, gogmgo-website process `online` (`pm2 status`)
- [ ] PM2 startup hooked to systemd (`pm2 startup` command executed)
- [ ] Node.js version is 20 LTS (`node --version`)

### Application
- [ ] `.env.local` created with correct `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `AUTH_URL`
- [ ] `npm install` completed
- [ ] `npx prisma generate` completed (Linux binary generated)
- [ ] `npx prisma migrate deploy` completed (all tables created)
- [ ] `npx tsx prisma/seed.ts` completed (admin user + settings + legal pages created)
- [ ] `npm run build` completed with zero errors
- [ ] `curl http://localhost:3000` returns HTML (app running on port 3000)

### SSL + DNS
- [ ] DNS `A` records pointing to EC2 Elastic IP
- [ ] DNS propagation confirmed (`dig yourdomain.com +short` returns EC2 IP)
- [ ] Certbot SSL certificate issued for `yourdomain.com` and `www.yourdomain.com`
- [ ] `nginx -t` passes
- [ ] `https://yourdomain.com` loads the homepage
- [ ] `http://yourdomain.com` redirects to HTTPS

### Admin Panel
- [ ] `https://yourdomain.com/admin/login` loads
- [ ] Login with `admin@gogmgo.com` / `admin123!` succeeds
- [ ] **Admin password changed**
- [ ] HubSpot Portal ID and Form ID entered in Settings
- [ ] WhatsApp number entered in Settings
- [ ] Support email entered in Settings
- [ ] GA4 / GTM IDs entered (if applicable)
- [ ] Privacy Policy content updated from placeholder
- [ ] Terms & Conditions content updated from placeholder

### SEO
- [ ] `https://yourdomain.com/sitemap.xml` returns valid XML with correct domain
- [ ] `https://yourdomain.com/robots.txt` returns correct `Disallow: /admin/` and sitemap URL
- [ ] `https://yourdomain.com/opengraph-image` returns the 1200×630 café hero image
- [ ] Homepage `<title>` is correct in page source (not "GoGMGo — The Restaurant Operating System" placeholder — should match what's in Settings)
- [ ] JSON-LD schemas visible in `view-source:https://yourdomain.com`
- [ ] Google Search Console: site verified, sitemap submitted
- [ ] Hardcoded `gogmgo.com` JSON-LD references updated to your domain in `app/page.tsx`

### Performance + Cache
- [ ] CloudFront distribution created and pointing to origin
- [ ] `/_next/static/` assets served with `Cache-Control: immutable` header
- [ ] Large image response time < 500ms (via CloudFront cache hit)
- [ ] [Google PageSpeed Insights](https://pagespeed.web.dev/) score > 70 mobile

### Security
- [ ] No secrets in `.env` committed to git (`git log` clean)
- [ ] `.env.local` is chmod 600
- [ ] RDS not publicly accessible (if using PostgreSQL)
- [ ] `/admin` IP restriction added to Nginx (if desired)
- [ ] `npm audit` run — no high/critical vulnerabilities

### Monitoring
- [ ] PM2 log rotation enabled: `pm2 install pm2-logrotate`
- [ ] CloudWatch basic monitoring enabled on EC2
- [ ] Uptime monitor set up (UptimeRobot free tier, or AWS CloudWatch synthetic canary)
- [ ] Error log path configured in PM2 ecosystem: `/var/log/gogmgo/error.log`

---

*Document generated from production codebase — GoGMGo Website, May 2026*

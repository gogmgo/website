# GoGMGo Website — Production Deployment Guide

> **Stack:** Next.js 16.2.5 (App Router) · TypeScript · Tailwind CSS v4 · Prisma 6 · NextAuth v5 · SQLite / PostgreSQL
> **Node requirement:** 20 LTS or 22 LTS (do NOT use 23.x in production — it is experimental)

---

## Table of Contents

1. [Pre-flight Checklist](#1-pre-flight-checklist)
2. [Server Requirements](#2-server-requirements)
3. [Initial Setup](#3-initial-setup)
4. [Environment Variables](#4-environment-variables)
5. [Database Setup](#5-database-setup)
6. [Build & Start](#6-build--start)
7. [PM2 Process Manager](#7-pm2-process-manager)
8. [Nginx Reverse Proxy](#8-nginx-reverse-proxy)
9. [SSL with Certbot](#9-ssl-with-certbot)
10. [First Admin Login](#10-first-admin-login)
11. [Updating the Site](#11-updating-the-site)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Pre-flight Checklist

Before starting, confirm you have:

- [ ] A Linux server (Ubuntu 22.04 LTS or Debian 12 recommended)
- [ ] A domain name pointed at the server's IP (`A` record)
- [ ] SSH root or sudo access
- [ ] Ports 80 and 443 open in your firewall / security group
- [ ] Node.js 20 LTS installed (`node --version` → `v20.x.x`)
- [ ] `npm`, `nginx`, `certbot`, `pm2` available

---

## 2. Server Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 1 vCPU | 2 vCPU |
| RAM | 1 GB | 2 GB |
| Disk | 10 GB | 20 GB |
| OS | Ubuntu 22.04 | Ubuntu 22.04 LTS |
| Node.js | 20.x LTS | 20.x LTS |

---

## 3. Initial Setup

### 3a. Install Node.js 20 LTS (via NVM — recommended)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20
node --version   # should print v20.x.x
```

### 3b. Install global tools

```bash
npm install -g pm2
```

### 3c. Upload source code

```bash
# From your local machine — upload the extracted ZIP contents:
scp -r gogmgo-website/ user@YOUR_SERVER_IP:/var/www/gogmgo

# Or use rsync for large asset directories:
rsync -avz --exclude 'node_modules' --exclude '.next' \
  gogmgo-website/ user@YOUR_SERVER_IP:/var/www/gogmgo/
```

### 3d. Set directory ownership

```bash
# On the server:
sudo chown -R www-data:www-data /var/www/gogmgo
sudo chmod -R 755 /var/www/gogmgo

# Make yourself the owner for deployments:
sudo chown -R $USER:$USER /var/www/gogmgo
```

---

## 4. Environment Variables

```bash
cd /var/www/gogmgo
cp .env.example .env.local
nano .env.local   # fill in all required values
```

**Required values to set:**

```env
# Absolute path to your SQLite database file
DATABASE_URL="file:/var/www/gogmgo/data/gogmgo.db"

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"

# Your live domain
NEXTAUTH_URL="https://yourdomain.com"
AUTH_URL="https://yourdomain.com"
```

Create the data directory for SQLite:

```bash
mkdir -p /var/www/gogmgo/data
chmod 755 /var/www/gogmgo/data
```

---

## 5. Database Setup

### 5a. Install dependencies

```bash
cd /var/www/gogmgo
npm install
```

### 5b. Generate Prisma client (server-specific binary)

```bash
npx prisma generate
```

> ⚠ This step is **required** on every new server. The Prisma query engine binary is platform-specific. The Mac binary included in the source will not work on Linux.

### 5c. Run migrations

```bash
npx prisma migrate deploy
```

This creates all database tables. Safe to run on an empty database.

### 5d. Seed initial data

```bash
npx tsx prisma/seed.ts
```

This creates:
- Admin account: `admin@gogmgo.com` / `admin123!`
- Default site settings record
- Placeholder Privacy Policy and Terms pages

> ⚠ **IMPORTANT:** Change the admin password immediately after first login. Go to the database and update the `AdminUser` record, or add a "change password" flow. The seed password is only suitable for first-time setup.

### 5e. Verify database

```bash
npx prisma studio   # opens a browser UI at localhost:5555
# (run via SSH tunnel if on a remote server)
```

---

## 6. Build & Start

### 6a. Production build

```bash
cd /var/www/gogmgo
npm run build
```

Expected output: `✓ Generating static pages (12/12)` with no errors.

### 6b. Test start (before PM2)

```bash
npm run start   # listens on port 3000
# Test: curl http://localhost:3000
# Ctrl+C to stop
```

---

## 7. PM2 Process Manager

PM2 keeps the application alive after SSH logout and restarts it on crash.

### 7a. Create PM2 ecosystem file

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
      max_memory_restart: "512M",
    },
  ],
}
```

### 7b. Start with PM2

```bash
cd /var/www/gogmgo
pm2 start ecosystem.config.js
pm2 save                          # persist across reboots
pm2 startup                       # follow the printed command to enable on boot
```

### 7c. Useful PM2 commands

```bash
pm2 status                        # view all processes
pm2 logs gogmgo-website           # tail live logs
pm2 restart gogmgo-website        # restart after code change
pm2 stop gogmgo-website           # stop
pm2 delete gogmgo-website         # remove from PM2
```

---

## 8. Nginx Reverse Proxy

Nginx sits in front of Next.js, handles SSL termination, and serves static assets efficiently.

### 8a. Install Nginx

```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl enable nginx
```

### 8b. Create site config

```bash
sudo nano /etc/nginx/sites-available/gogmgo
```

Paste the following (replace `yourdomain.com`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect all HTTP to HTTPS (add after SSL is configured)
    # return 301 https://$host$request_uri;

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
    }

    # Cache static Next.js assets aggressively
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Cache public assets
    location /assets/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }

    client_max_body_size 20M;
}
```

### 8c. Enable and test

```bash
sudo ln -s /etc/nginx/sites-available/gogmgo /etc/nginx/sites-enabled/
sudo nginx -t            # test config — must say "ok"
sudo systemctl reload nginx
```

---

## 9. SSL with Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot will:
1. Verify domain ownership via HTTP
2. Install the certificate
3. Automatically add HTTPS redirect to your Nginx config
4. Schedule auto-renewal (verify with `sudo certbot renew --dry-run`)

After SSL is working, uncomment the HTTP→HTTPS redirect line in the Nginx config.

---

## 10. First Admin Login

Once the site is running at your domain:

1. Visit `https://yourdomain.com/admin/login`
2. Log in with: `admin@gogmgo.com` / `admin123!`
3. Immediately go to Settings and configure:
   - Site name and SEO defaults
   - HubSpot portal ID and form ID
   - WhatsApp number
   - Analytics IDs (GA4, GTM, Meta Pixel, Clarity)
4. Update the Privacy Policy and Terms & Conditions content
5. **Change the admin password** (see Admin Guide for instructions)

---

## 11. Updating the Site

To deploy code changes:

```bash
cd /var/www/gogmgo

# Upload new source files (from local machine or git pull)
# Then:

npm install                    # in case dependencies changed
npx prisma generate            # in case schema changed
npx prisma migrate deploy      # in case migrations were added
npm run build                  # rebuild
pm2 restart gogmgo-website     # hot reload
```

---

## 12. Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `PrismaClientInitializationError` | Wrong DATABASE_URL path | Use absolute path: `file:/var/www/gogmgo/data/gogmgo.db` |
| `Cannot find module '.../libquery_engine'` | Prisma binary not generated for Linux | Run `npx prisma generate` |
| Admin login loops back to login | NEXTAUTH_SECRET mismatch or missing | Set `NEXTAUTH_SECRET` and `NEXTAUTH_URL` in `.env.local` |
| Blank page / JS errors | Build artifacts missing | Run `npm run build` again |
| 502 Bad Gateway (Nginx) | Next.js not running on port 3000 | Run `pm2 status` and check logs |
| Images not loading | `public/` assets not uploaded | Verify `public/assets/` and `public/brand/` are present |
| OG image broken | `new-hero.png` must be in `public/assets/` | Check `public/assets/new-hero.png` exists |

---

*Generated: May 2026 — GoGMGo Website v1.0*

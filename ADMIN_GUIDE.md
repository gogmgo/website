# GoGMGo Website — Admin Panel Guide

---

## Admin Panel Overview

The admin panel is a private CMS allowing GoGMGo staff to manage site content, integrations, legal pages, and SEO settings without code changes.

**Admin URL:** `https://yourdomain.com/admin`
**Login URL:** `https://yourdomain.com/admin/login`

---

## Authentication

### How it works

- Auth uses **NextAuth v5 (Auth.js beta)** with a **JWT session strategy**
- Credentials (email + bcrypt password) are verified against the `AdminUser` database table
- On success, a signed JWT is issued and stored as a secure HTTP-only cookie
- All `/admin/*` routes (except `/admin/login`) require a valid JWT — enforced via `auth.config.ts` callbacks
- Sessions expire when the browser is closed (no persistent remember-me)

### Default credentials (seed data — MUST change)

| Field | Value |
|-------|-------|
| Email | `admin@gogmgo.com` |
| Password | `admin123!` |

### Changing the admin password

There is currently no UI for password changes. To change the password:

**Option 1 — Prisma Studio (recommended):**
```bash
cd /var/www/gogmgo
npx prisma studio
# Open AdminUser table → edit passwordHash
# Generate new hash: node -e "const b=require('bcryptjs'); b.hash('NewPassword123!', 12).then(console.log)"
```

**Option 2 — Direct DB update (SQLite):**
```bash
# Generate hash first:
node -e "const b=require('bcryptjs'); b.hash('YourNewPassword', 12).then(h => console.log(h))"

# Then update:
sqlite3 /var/www/gogmgo/data/gogmgo.db \
  "UPDATE AdminUser SET passwordHash='PASTE_HASH_HERE' WHERE email='admin@gogmgo.com';"
```

**Option 3 — Re-run seed with updated password:**
Edit `prisma/seed.ts`, change `"admin123!"` to your new password, then:
```bash
npx tsx prisma/seed.ts
```

### Adding a second admin user

```bash
node -e "
const b = require('bcryptjs');
b.hash('YourPassword', 12).then(h => {
  const {PrismaClient} = require('./lib/generated/prisma/client');
  const db = new PrismaClient();
  db.adminUser.create({data:{email:'newadmin@gogmgo.com',passwordHash:h}}).then(()=>db.\$disconnect());
});
"
```

---

## Site Settings

**URL:** `/admin/settings`

### SEO & Branding

| Field | Purpose |
|-------|---------|
| Site Name | Used in JSON-LD Organization schema and fallback titles |
| Default SEO Title | `<title>` tag for the homepage when no DB override exists |
| Default SEO Description | `<meta name="description">` for the homepage |

Changes take effect on next page load (settings are fetched server-side on each request).

### HubSpot Integration

| Field | Purpose | Where to find it |
|-------|---------|-----------------|
| Portal ID | Links the embedded form to your account | HubSpot → Settings → Account Defaults → Hub ID |
| Form ID | The specific form GUID | HubSpot → Marketing → Forms → form URL contains the GUID |
| Tracking Script | The `hs-script-loader` snippet | HubSpot → Settings → Tracking Code |

**How the contact form works:**
- When Portal ID + Form ID are both set, the "Book a Demo" modal submits directly to HubSpot using the HubSpot Forms API (`/api/contact` route)
- If either field is empty, form submissions are handled gracefully without HubSpot
- The tracking script is injected into `<head>` for HubSpot analytics

### WhatsApp & Contact

| Field | Purpose |
|-------|---------|
| WhatsApp Number | E.164 format, e.g. `6591234567`. Used in footer WhatsApp link |
| Support Email | Displayed in footer and contact areas |

### Analytics Integrations

All analytics IDs are injected into the page `<head>` server-side when set. Leave blank to disable.

| Field | What it enables |
|-------|----------------|
| Google Analytics ID | GA4 measurement ID, e.g. `G-XXXXXXXXXX`. Injects GA4 gtag.js |
| Google Tag Manager ID | GTM container ID, e.g. `GTM-XXXXXXX`. Injects GTM head + body scripts |
| Meta Pixel ID | Facebook/Meta Pixel, e.g. `1234567890123`. Injects fbq base code |
| Microsoft Clarity ID | Clarity project ID. Injects Clarity snippet |

**Note:** GTM can manage GA4, Meta Pixel, and Clarity tags internally. If you use GTM, you typically only need the GTM ID set — leave the others blank to avoid double-firing.

---

## Legal Pages

**URL:** `/admin/legal/privacy-policy` and `/admin/legal/terms-and-conditions`

Both pages use a rich-text editor (TipTap v3) that supports:
- Headings (H2, H3)
- Bold, italic
- Bullet lists, numbered lists
- Links
- Tables
- Custom spacing

### Per-page SEO

Each legal page has its own SEO title and description fields — these override the global defaults for `/privacy-policy` and `/terms-and-conditions`.

### Public URLs

| Page | URL |
|------|-----|
| Privacy Policy | `https://yourdomain.com/privacy-policy` |
| Terms & Conditions | `https://yourdomain.com/terms-and-conditions` |

Content is server-rendered and changes are live immediately on save.

---

## Admin Panel Structure (for developers)

```
app/admin/
├── login/page.tsx              # Public login page
└── (protected)/                # Route group — requires auth
    ├── layout.tsx              # Checks session, renders sidebar
    ├── page.tsx                # Dashboard home (redirect to settings)
    ├── settings/
    │   ├── page.tsx            # Server component — fetches current settings
    │   └── SettingsForm.tsx    # Client component — form + submit handler
    └── legal/[slug]/
        ├── page.tsx            # Server component — loads page content
        └── LegalEditor.tsx     # Client component — TipTap rich text editor
```

**API routes:**

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/settings` | GET / POST | Read and write SiteSettings |
| `/api/admin/legal/[slug]` | GET / POST | Read and write LegalPage content |
| `/api/auth/[...nextauth]` | GET / POST | NextAuth session handling |
| `/api/contact` | POST | HubSpot form submission proxy |

All `/api/admin/*` routes verify the session before responding.

---

## Known Limitations

1. **Single admin user by default** — the seed creates one account. Additional accounts must be added via database directly (no UI for user management).
2. **No password reset UI** — password changes require direct database access (see above).
3. **No image upload** — asset changes require file system access and redeployment.
4. **Legal page content only** — homepage marketing copy (hero text, pricing, feature descriptions) is in the source code, not the CMS. Changes require code edit and rebuild.
5. **No audit log** — settings changes are not tracked with timestamps or authors.

---

*Generated: May 2026 — GoGMGo Website v1.0*

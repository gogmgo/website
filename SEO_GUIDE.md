# GoGMGo Website — SEO & Technical Reference

---

## Rendering Strategy

| Route | Type | SEO Impact |
|-------|------|-----------|
| `/` (homepage) | Static pre-rendered at build time | ✅ Full SSR metadata |
| `/privacy-policy` | Dynamic SSR (content from DB) | ✅ Full SSR metadata |
| `/terms-and-conditions` | Dynamic SSR (content from DB) | ✅ Full SSR metadata |
| `/sitemap.xml` | Static pre-rendered | ✅ Auto-discovered |
| `/robots.txt` | Static pre-rendered | ✅ Auto-discovered |
| `/opengraph-image` | Static pre-rendered image | ✅ OG image |
| `/admin/*` | Dynamic SSR (private) | 🔒 Not indexed |

All public-facing pages are either pre-rendered or server-rendered, ensuring full SEO metadata is present in the HTML before any JavaScript executes.

---

## Metadata Implementation

### Homepage (`app/page.tsx`)

Metadata is generated server-side via `generateMetadata()`:

```typescript
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()   // reads from DB with fallback
  return {
    title: settings.defaultSeoTitle,
    description: settings.defaultSeoDescription,
    // ... openGraph, twitter, canonical ...
  }
}
```

**Fallback values** (used when DB is unavailable):
- Title: `"GoGMGo — Restaurant POS & Operating System for Modern F&B"`
- Description: `"Cloud-based restaurant operating system combining POS, kitchen management, procurement, HR scheduling, and analytics..."`

### Legal Pages

Each legal page reads its own `seoTitle` and `seoDescription` from the database. Editable via the admin panel.

---

## Structured Data (JSON-LD)

Three JSON-LD schemas are injected into the homepage `<head>`:

### 1. Organization

```json
{
  "@type": "Organization",
  "name": "GoGMGo",
  "url": "https://gogmgo.com",
  "logo": "https://gogmgo.com/brand/gogmgo-logo-white-2026.svg",
  "contactPoint": { "@type": "ContactPoint", "contactType": "sales" },
  "sameAs": ["https://linkedin.com/company/gogmgo", "https://instagram.com/gogmgo"]
}
```

### 2. WebSite

```json
{
  "@type": "WebSite",
  "name": "GoGMGo",
  "url": "https://gogmgo.com"
}
```

### 3. SoftwareApplication

Documents the product with pricing, category, and operating system. Helps Google understand this is a SaaS product.

### 4. FAQPage

Eight Q&A pairs covering core product questions (what is GoGMGo, pricing, setup time, supported platforms etc.). Eligible for FAQ rich results in Google Search.

**To update structured data:** Edit `app/page.tsx` — search for `application/ld+json` script tags.

---

## Open Graph Image

**File:** `app/opengraph-image.tsx`
**Output:** `/opengraph-image` (1200×630px, statically pre-rendered)
**Runtime:** Node.js (uses `readFileSync` to load the café background image)

The OG image:
- Uses `public/assets/new-hero.png` as the background (matches the site's hero)
- Overlays the GoGMGo logo and tagline text
- Uses the site's brand colours (`#f4f1ea`, `#b7d66d`)

To update: edit `app/opengraph-image.tsx`. The image is regenerated on each build.

---

## Sitemap

**File:** `app/sitemap.ts`
**Output:** `/sitemap.xml`
**Type:** Static (generated at build time)

Currently includes:
- `/` — priority 1.0, weekly
- `/privacy-policy` — priority 0.3, monthly
- `/terms-and-conditions` — priority 0.3, monthly

To add new pages, edit `app/sitemap.ts`.

---

## Robots.txt

**File:** `app/robots.ts`
**Output:** `/robots.txt`

Allows all crawlers on public pages. Disallows:
- `/admin/`
- `/api/`

---

## Language & Region

The HTML `lang` attribute is set to `"en-SG"` in `app/layout.tsx`, signalling to search engines that this is Singapore-region English content.

---

## SR-Only Semantic Content (AI & Crawler Discoverability)

Several sections include `<div className="sr-only">` blocks — visually hidden but present in the DOM for crawlers and AI models:

| Section | Content |
|---------|---------|
| Our Menu (StepInside) | Full product descriptions for all 6 products with specific feature lists and integration names |
| 4-Hands (FourHands) | Full partner integration descriptions with named partners per category |

This ensures that product detail, partner names, and capabilities appear in the raw HTML even though they are presented visually as interactive graphics.

---

## Analytics Integration

Analytics scripts are injected server-side when IDs are configured in the admin panel:

| Platform | Admin field | Script location |
|----------|-------------|----------------|
| Google Analytics 4 | `googleAnalyticsId` | `<head>` — gtag.js async |
| Google Tag Manager | `googleTagManagerId` | `<head>` + `<body>` noscript |
| Meta Pixel | `metaPixelId` | `<head>` — fbq base code |
| Microsoft Clarity | `clarityProjectId` | `<head>` — Clarity snippet |
| HubSpot | `hubspotTrackingScript` | `<head>` — hs-script-loader |

Client-side event tracking is handled in `lib/analytics.ts`. Events include:
- `book_demo` (with source parameter)
- `our_menu_click`
- `secret_sauce_click`
- `contact_form_open` / `contact_form_submit`
- `whatsapp_click`
- `email_click`
- `pricing_book_demo`

---

## Canonical URLs

Set via Next.js `alternates.canonical` in `generateMetadata()`. Ensure `NEXTAUTH_URL` is set to your production domain so canonical URLs are correct.

---

## Production SEO Checklist

Before going live:

- [ ] Set `NEXTAUTH_URL` / `AUTH_URL` to production domain
- [ ] Update canonical URL in `app/page.tsx` `generateMetadata()` to production domain
- [ ] Update JSON-LD `url` fields in `app/page.tsx` to production domain
- [ ] Update `app/sitemap.ts` base URL to production domain
- [ ] Update `app/robots.ts` sitemap URL to production domain
- [ ] Submit sitemap to Google Search Console: `https://yourdomain.com/sitemap.xml`
- [ ] Verify OG image renders: `https://yourdomain.com/opengraph-image`
- [ ] Test structured data with Google Rich Results Test
- [ ] Configure GA4 / GTM in admin panel settings

---

*Generated: May 2026 — GoGMGo Website v1.0*

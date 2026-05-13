# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GoGMGo is an F&B SaaS platform (POS, QR ordering, procurement, HR, inventory, reporting, payments, integrations) marketed as "The POS That Installs Itself." This repo is its marketing website with a CMS admin panel.

Brand tone: premium, modern, clear, founder-led, credible for restaurants and chains — a serious SaaS company, not a generic POS vendor.

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **ORM:** Prisma
- **Database:** PostgreSQL (prod) / SQLite (local dev)
- **Rich text:** CMS pages use a rich text editor component
- **Integrations:** HubSpot forms/tracking

## Common Commands

```bash
npm run dev          # start local dev server
npm run build        # production build
npm run lint         # lint check
npm run typecheck    # TypeScript check (if configured)
npx prisma migrate dev   # run DB migrations locally
npx prisma studio        # browse DB locally
```

Always run `npm run lint && npm run build` after implementing changes.

## Architecture

### Public Site (`/app` or `/pages`)
Homepage with these ordered sections:
1. Hero
2. Pain (restaurant tech is broken)
3. Prep (keep exact approved wording)
4. Special Sauce
5. Product Ecosystem
6. Integrated Payments
7. Reporting / Analytics / AI Insights
8. Implementation / Onboarding
9. Testimonials / Proof
10. CTA
11. Footer (logo, Privacy Policy, T&C links, contact, copyright)

`/privacy-policy` and `/terms` are CMS-driven pages with their own slugs.

### Admin Panel (`/admin`)
Controls via DB-backed CMS:
- Homepage text sections
- SEO fields per page (title, description, canonical, OG title/description/image)
- Page slugs
- Privacy Policy and Terms page content (rich text)
- HubSpot integration settings
- Tracking scripts
- CTA destination links

Rich text for legal pages supports: headings, bold, italic, bullet lists, numbered lists, links, spacing, tables.

### SEO
Every public page must have: custom meta title, meta description, canonical URL, OG tags, structured schema where appropriate. Site must include `sitemap.xml` and `robots.txt`. URLs must be clean and fast-loading.

### Data Model (Prisma)
Key models will include: `Page` (slug, SEO fields, content), `SiteSettings` (HubSpot keys, tracking scripts, CTA links), `HomepageSection` (section key, content fields).

## Development Rules

Before coding any feature:
1. Inspect the existing file structure
2. Propose a plan
3. Ask before deleting major files
4. Keep changes clean and modular
5. Run lint/build checks after implementation

## Quality Bar

Do not build a generic template. Every section must feel specific to GoGMGo and restaurant operators. The site must be fully mobile-first: strong CTA visibility, no tiny text, sections stack elegantly on mobile. Admin panel must be usable on laptop/tablet.

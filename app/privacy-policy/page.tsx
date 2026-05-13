import type { Metadata } from "next"
import { LegalLayout } from "@/components/ui/LegalLayout"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const BASE_URL = process.env.NEXTAUTH_URL ?? "https://gogmgo.com"
  const canonical = `${BASE_URL}/privacy-policy`
  try {
    const page = await db.legalPage.findUnique({ where: { slug: "privacy-policy" } })
    if (page?.seoTitle || page?.seoDescription) {
      return {
        title: page.seoTitle || "Privacy Policy — GoGMGo",
        description: page.seoDescription || undefined,
        alternates: { canonical },
        openGraph: {
          title: page.seoTitle || "Privacy Policy — GoGMGo",
          description: page.seoDescription || undefined,
          url: canonical,
        },
      }
    }
  } catch { /* fall through to default */ }
  return {
    title: "Privacy Policy — GoGMGo",
    description: "How GoGMGo collects, uses, and protects your personal information.",
    alternates: { canonical },
    openGraph: {
      title: "Privacy Policy — GoGMGo",
      description: "How GoGMGo collects, uses, and protects your personal information.",
      url: canonical,
    },
  }
}

const sections = [
  {
    heading: "1. Who We Are",
    body: "GoGMGo operates a connected operating system for modern hospitality businesses. This Privacy Policy explains how we collect, use, and protect information when you use our website, platform, or services. Our registered address and data controller details are available by contacting hello@gogmgo.com.",
  },
  {
    heading: "2. Information We Collect",
    body: [
      "Account and contact information: name, email address, phone number, and business details you provide when registering or contacting us.",
      "Usage data: how you interact with our platform — features used, session duration, device type, and browser.",
      "Transaction data: billing details, payment method type (not card numbers — those go to our payment processor), and purchase history.",
      "Communication records: emails and support conversations you have with our team.",
      "Marketing preferences: whether you've opted in to newsletters or product updates.",
    ],
  },
  {
    heading: "3. How We Use Your Information",
    body: [
      "To provide, operate, and improve the GoGMGo platform and related services.",
      "To process payments and send transactional communications (receipts, invoices, alerts).",
      "To respond to support requests and onboarding queries.",
      "To send product updates, feature announcements, and newsletters — only where you've opted in or have an active account.",
      "To comply with legal obligations and enforce our Terms & Conditions.",
      "To improve our website and marketing using anonymised analytics data.",
    ],
  },
  {
    heading: "4. Legal Basis for Processing",
    body: "We process your personal data under one or more of the following legal bases: (a) contract — processing is necessary to deliver the services you've signed up for; (b) legitimate interests — to operate and improve our business where your rights are not overridden; (c) consent — for marketing communications and cookies where required; (d) legal obligation — where we are required to process data by applicable law.",
  },
  {
    heading: "5. Data Sharing",
    body: [
      "Payment processors (e.g., Stripe) who handle billing securely under their own privacy policies.",
      "Cloud infrastructure providers who host the GoGMGo platform.",
      "CRM and marketing tools (e.g., HubSpot) used to manage customer communications.",
      "Analytics providers using anonymised or aggregated data only.",
      "Legal authorities where disclosure is required by law.",
      "We do not sell your personal information to third parties.",
    ],
  },
  {
    heading: "6. Data Retention",
    body: "We retain account data for the duration of your subscription and for up to 7 years after account closure for legal and financial compliance. You may request earlier deletion subject to any overriding legal requirements. Anonymised usage analytics are retained indefinitely.",
  },
  {
    heading: "7. Your Rights",
    body: [
      "Access: request a copy of the personal data we hold about you.",
      "Correction: ask us to fix inaccurate or incomplete data.",
      "Deletion: request erasure of your data, subject to legal retention obligations.",
      "Portability: receive your data in a structured, machine-readable format.",
      "Objection: object to processing based on legitimate interests or direct marketing.",
      "Withdrawal of consent: opt out of marketing at any time via the unsubscribe link in any email.",
    ],
  },
  {
    heading: "8. Cookies",
    body: "We use essential cookies to operate the platform, and optional analytics and marketing cookies where you consent. You can manage your cookie preferences through our cookie banner or your browser settings. Disabling non-essential cookies will not affect core platform functionality.",
  },
  {
    heading: "9. Security",
    body: "We implement industry-standard security measures including TLS encryption in transit, encrypted storage at rest, and regular access reviews. No method of internet transmission is 100% secure, and we encourage you to use a strong, unique password for your GoGMGo account.",
  },
  {
    heading: "10. International Transfers",
    body: "GoGMGo may process data in countries outside your home jurisdiction. Where we transfer data internationally, we implement appropriate safeguards including Standard Contractual Clauses or equivalent mechanisms as required by applicable law.",
  },
  {
    heading: "11. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. We will notify active users of material changes via email or an in-product notice. Continued use of our services after changes take effect constitutes acceptance of the revised policy.",
  },
  {
    heading: "12. Contact",
    body: "For privacy queries, data subject requests, or to contact our data protection officer, email hello@gogmgo.com. We aim to respond within 30 days.",
  },
]

export default async function PrivacyPolicyPage() {
  let htmlContent: string | null = null
  let effectiveDate = "1 January 2025"

  try {
    const page = await db.legalPage.findUnique({ where: { slug: "privacy-policy" } })
    if (page?.content && page.content.trim() && page.content !== "<p></p>") {
      htmlContent = page.content
      effectiveDate = page.updatedAt.toLocaleDateString("en-SG", {
        day: "numeric", month: "long", year: "numeric",
      })
    }
  } catch { /* fall through to hardcoded sections */ }

  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="We believe in plain-language privacy. Here's exactly how we handle your data."
      effectiveDate={effectiveDate}
      sections={sections}
      htmlContent={htmlContent}
    />
  )
}

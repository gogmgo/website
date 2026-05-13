import type { Metadata } from "next"
import { LegalLayout } from "@/components/ui/LegalLayout"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const BASE_URL = process.env.NEXTAUTH_URL ?? "https://gogmgo.com"
  const canonical = `${BASE_URL}/terms-and-conditions`
  try {
    const page = await db.legalPage.findUnique({ where: { slug: "terms-and-conditions" } })
    if (page?.seoTitle || page?.seoDescription) {
      return {
        title: page.seoTitle || "Terms & Conditions — GoGMGo",
        description: page.seoDescription || undefined,
        alternates: { canonical },
        openGraph: {
          title: page.seoTitle || "Terms & Conditions — GoGMGo",
          description: page.seoDescription || undefined,
          url: canonical,
        },
      }
    }
  } catch { /* fall through to default */ }
  return {
    title: "Terms & Conditions — GoGMGo",
    description: "The terms that govern your use of the GoGMGo platform and services.",
    alternates: { canonical },
    openGraph: {
      title: "Terms & Conditions — GoGMGo",
      description: "The terms that govern your use of the GoGMGo platform and services.",
      url: canonical,
    },
  }
}

const sections = [
  {
    heading: "1. Agreement",
    body: "By accessing or using the GoGMGo platform, website, or any related services (\"Services\"), you agree to be bound by these Terms & Conditions. If you are entering into this agreement on behalf of a business, you represent that you have authority to bind that entity. If you do not agree to these terms, do not use our Services.",
  },
  {
    heading: "2. The Services",
    body: "GoGMGo provides a connected operating system for hospitality businesses, including point-of-sale, HR, procurement, inventory, analytics, and integration tools. The specific features available to you depend on your subscription plan. We reserve the right to modify, suspend, or discontinue features with reasonable notice.",
  },
  {
    heading: "3. Account Registration",
    body: [
      "You must provide accurate and complete information when creating an account.",
      "You are responsible for maintaining the confidentiality of your login credentials.",
      "You are responsible for all activity that occurs under your account.",
      "You must notify us immediately of any unauthorised access or suspected security breach.",
      "Accounts must not be shared between organisations without explicit written consent.",
    ],
  },
  {
    heading: "4. Subscription and Billing",
    body: [
      "Subscriptions are charged monthly or annually in advance, per outlet, as described on our pricing page.",
      "All fees are exclusive of applicable taxes unless stated otherwise.",
      "Payments are processed by our third-party payment provider. By subscribing, you authorise recurring charges to your nominated payment method.",
      "You may cancel your subscription at any time. No refunds are provided for unused portions of a billing period unless required by applicable law.",
      "We reserve the right to change pricing with 30 days' advance notice. Continued use after the notice period constitutes acceptance.",
      "Overdue accounts may result in service suspension after 14 days' written notice.",
    ],
  },
  {
    heading: "5. Acceptable Use",
    body: [
      "You must not use the Services for any unlawful purpose or in violation of any regulations.",
      "You must not attempt to reverse-engineer, scrape, or reproduce any part of the platform.",
      "You must not upload or transmit malicious code, viruses, or harmful data.",
      "You must not use the Services to infringe intellectual property rights of any third party.",
      "You must not resell or sublicense access to the Services without written authorisation.",
    ],
  },
  {
    heading: "6. Your Data",
    body: "You retain ownership of all data you input into the GoGMGo platform (\"Customer Data\"). You grant us a limited licence to process this data solely to provide the Services. We will not sell or disclose your Customer Data to third parties except as described in our Privacy Policy or as required by law. You are responsible for ensuring your Customer Data complies with applicable data protection laws.",
  },
  {
    heading: "7. Intellectual Property",
    body: "All intellectual property rights in the GoGMGo platform, software, brand, and documentation are owned by or licensed to GoGMGo. Nothing in these Terms transfers ownership of our intellectual property to you. Your subscription grants you a limited, non-exclusive, non-transferable licence to use the Services during your subscription term.",
  },
  {
    heading: "8. Confidentiality",
    body: "Each party agrees to keep confidential any non-public information received from the other party in connection with the Services, and to use such information only for the purposes of these Terms. This obligation does not apply to information that is or becomes publicly available through no fault of the receiving party.",
  },
  {
    heading: "9. Warranties and Disclaimers",
    body: "We warrant that we will provide the Services with reasonable care and skill. Beyond this, the Services are provided \"as is\" to the maximum extent permitted by law. We do not warrant that the Services will be error-free, uninterrupted, or meet all of your specific requirements. Nothing in these Terms limits our liability for fraud, death or personal injury caused by negligence, or any other liability that cannot be excluded by law.",
  },
  {
    heading: "10. Limitation of Liability",
    body: "To the maximum extent permitted by applicable law, GoGMGo's total aggregate liability arising out of or related to these Terms shall not exceed the fees paid by you in the 12 months immediately preceding the event giving rise to the claim. In no event shall GoGMGo be liable for indirect, incidental, special, consequential, or punitive damages, including loss of profits or data, even if advised of the possibility of such damages.",
  },
  {
    heading: "11. Indemnification",
    body: "You agree to indemnify, defend, and hold harmless GoGMGo and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including legal fees) arising out of your use of the Services, your breach of these Terms, or your violation of any third-party rights.",
  },
  {
    heading: "12. Termination",
    body: "Either party may terminate a subscription at any time. We may suspend or terminate your access immediately if you breach these Terms or if required by law. On termination, your right to use the Services ceases. We will retain your Customer Data for 30 days following termination, after which it may be deleted. You can export your data via the platform prior to termination.",
  },
  {
    heading: "13. Governing Law",
    body: "These Terms are governed by and construed in accordance with the laws of the jurisdiction in which GoGMGo is incorporated. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of that jurisdiction, unless otherwise required by applicable consumer protection law in your location.",
  },
  {
    heading: "14. Changes to These Terms",
    body: "We may update these Terms from time to time. We will provide at least 30 days' notice of material changes via email or in-product notification. Continued use of the Services after changes take effect constitutes your acceptance of the revised Terms.",
  },
  {
    heading: "15. Contact",
    body: "For questions about these Terms, please contact us at hello@gogmgo.com. We're happy to explain anything in plain language.",
  },
]

export default async function TermsAndConditionsPage() {
  let htmlContent: string | null = null
  let effectiveDate = "1 January 2025"

  try {
    const page = await db.legalPage.findUnique({ where: { slug: "terms-and-conditions" } })
    if (page?.content && page.content.trim() && page.content !== "<p></p>") {
      htmlContent = page.content
      effectiveDate = page.updatedAt.toLocaleDateString("en-SG", {
        day: "numeric", month: "long", year: "numeric",
      })
    }
  } catch { /* fall through to hardcoded sections */ }

  return (
    <LegalLayout
      title="Terms & Conditions"
      subtitle="The terms that govern your use of GoGMGo. Written to be read, not just filed."
      effectiveDate={effectiveDate}
      sections={sections}
      htmlContent={htmlContent}
    />
  )
}

import type { Metadata } from "next"
import { getSiteSettings } from "@/lib/settings"
import { Navbar } from "@/components/sections/Navbar"
import { Hero } from "@/components/sections/Hero"
import { CafeEntrance } from "@/components/sections/CafeEntrance"
import { StepInside } from "@/components/sections/StepInside"
import { KitchenPassage } from "@/components/sections/KitchenPassage"
import { SecretSauce } from "@/components/sections/SecretSauce"
import { ServicePassage } from "@/components/sections/ServicePassage"
import { Prep } from "@/components/sections/Prep"
import { CounterPassage } from "@/components/sections/CounterPassage"
import { FourHands } from "@/components/sections/FourHands"
import { PricingPassage } from "@/components/sections/PricingPassage"
import { Pricing } from "@/components/sections/Pricing"
import { Footer } from "@/components/sections/Footer"

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings()
  const BASE_URL = process.env.NEXTAUTH_URL ?? "https://gogmgo.com"
  return {
    title: s.defaultSeoTitle,
    description: s.defaultSeoDescription,
    alternates: { canonical: BASE_URL },
    openGraph: {
      title: s.defaultSeoTitle,
      description: s.defaultSeoDescription,
      url: BASE_URL,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "GoGMGo — Restaurant Operating System for Modern F&B" }],
    },
  }
}

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://gogmgo.com/#software",
  "name": "GoGMGo",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Restaurant Management Software",
  "operatingSystem": "iOS, Web, iPad",
  "url": "https://gogmgo.com",
  "publisher": { "@id": "https://gogmgo.com/#organization" },
  "description": "GoGMGo is a cloud-based restaurant operating system for modern F&B operators, integrating point-of-sale (POS), kitchen management, HR and staff scheduling, procurement, analytics, and online ordering in one connected platform.",
  "featureList": [
    "Restaurant Point of Sale (POS)",
    "iPad POS for restaurants and cafés",
    "Kitchen Display System (KDS)",
    "Customer Display System (CDS)",
    "Online Ordering and QR table ordering",
    "Staff scheduling and HR management",
    "Payroll management for restaurants",
    "Recipe costing and kitchen management",
    "Inventory and procurement management",
    "Restaurant analytics and reporting",
    "Delivery platform integration (GrabFood, Foodpanda)",
    "Loyalty platform integration (Eber, Como, Ascentis)",
    "Reservation system integration (SevenRooms, inline, BistroChat)",
    "Payment processing (Stripe, Pine Labs, Red Dot Payments)",
    "Multi-outlet restaurant management",
    "Self-service kiosk ordering",
  ],
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "119",
    "highPrice": "219",
    "priceCurrency": "SGD",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": "119",
      "priceCurrency": "SGD",
      "unitText": "per outlet per month",
    },
    "offerCount": 3,
  },
  "audience": {
    "@type": "Audience",
    "audienceType": "Restaurant operators, F&B businesses, café owners, hospitality groups",
    "geographicArea": { "@type": "Place", "name": "Singapore and Southeast Asia" },
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is GoGMGo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GoGMGo is a restaurant operating system that combines point-of-sale (POS), kitchen management, HR and staff scheduling, procurement, analytics, and online ordering in one connected platform. It is designed for modern F&B operators — from standalone cafés and restaurants to multi-outlet hospitality groups.",
      },
    },
    {
      "@type": "Question",
      "name": "Is GoGMGo available for restaurants in Singapore?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. GoGMGo integrates with Singapore's leading payment providers including Stripe, Pine Labs, and Red Dot Payments, and connects to delivery platforms such as GrabFood and Foodpanda. It is built for the Singapore F&B market.",
      },
    },
    {
      "@type": "Question",
      "name": "What restaurant POS features does GoGMGo include?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GoGMGo's GoPOSGo module is an iPad-based restaurant POS system supporting order management, table management, payment processing, kitchen display systems (KDS), customer display systems (CDS), and real-time analytics. It supports both counter service and table service workflows.",
      },
    },
    {
      "@type": "Question",
      "name": "Does GoGMGo support QR ordering and online ordering?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. GoGMGo's Ordrr module supports QR table ordering, online ordering for restaurants, and self-service kiosk workflows, available as an optional add-on.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the pricing for GoGMGo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GoGMGo pricing starts from SGD $119 per outlet per month (Starter), $169/month (Basic), and $219/month (Standard) for high-volume restaurant operations. There are no setup fees. Optional add-ons include Ordrr (online ordering), Screens, GoLinkGo (integrations), and Shared Ops for multi-outlet groups.",
      },
    },
    {
      "@type": "Question",
      "name": "Can GoGMGo manage multiple restaurant outlets?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. GoGMGo's Shared Ops add-on provides a group HQ account with centralised approval workflows, data sharing, and consolidated reporting across multiple outlets.",
      },
    },
    {
      "@type": "Question",
      "name": "Does GoGMGo include restaurant HR and staff scheduling?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. GoGMGo's GoHRGo module provides restaurant HR management including staff scheduling, payroll management, performance tracking, and employee self-service tools.",
      },
    },
    {
      "@type": "Question",
      "name": "What delivery platforms does GoGMGo integrate with?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GoGMGo integrates with major delivery and aggregator platforms through its GoLinkGo integration module, including GrabFood, Foodpanda, and Lalamove, as well as loyalty platforms (Eber, Como, Ascentis) and reservation systems (SevenRooms, inline, BistroChat).",
      },
    },
  ],
}

// Cinematic café journey:
// Outside → Doorway threshold → Interior counter → Systems wall → Consultation → Pricing → Lounge
export default function Home() {
  return (
    <>
      {/* ── Structured data — SoftwareApplication + FAQPage ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main>
        <Navbar />
        <Hero />
        <CafeEntrance />
        <StepInside />
        <KitchenPassage />
        <SecretSauce />
        <ServicePassage />
        <Prep />
        <CounterPassage />
        <FourHands />
        <PricingPassage />
        <Pricing />
        <Footer />
      </main>
    </>
  )
}

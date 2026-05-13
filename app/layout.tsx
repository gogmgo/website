import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { MotionConfig } from "framer-motion"
import "./globals.css"
import { ModalProvider } from "@/context/ModalContext"
import { PublicSettingsProvider } from "@/context/PublicSettingsContext"
import { getSiteSettings } from "@/lib/settings"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings()
  const BASE_URL = process.env.NEXTAUTH_URL ?? "https://gogmgo.com"

  return {
    title: {
      default: s.defaultSeoTitle,
      template: `%s — ${s.siteName}`,
    },
    description: s.defaultSeoDescription,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: BASE_URL },
    openGraph: {
      type: "website",
      siteName: s.siteName,
      title: s.defaultSeoTitle,
      description: s.defaultSeoDescription,
      url: BASE_URL,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "GoGMGo — Restaurant Operating System for Modern F&B" }],
    },
    twitter: {
      card: "summary_large_image",
      title: s.defaultSeoTitle,
      description: s.defaultSeoDescription,
      images: ["/opengraph-image"],
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSiteSettings()

  return (
    <html lang="en-SG" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {/* ── Structured data — Organization + WebSite ──────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://gogmgo.com/#organization",
                  "name": "GoGMGo",
                  "url": "https://gogmgo.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://gogmgo.com/brand/gogmgo-logo-white-2026.svg",
                  },
                  "description": "Restaurant operating system providing POS, kitchen management, HR scheduling, procurement, analytics and online ordering for F&B operators.",
                  "areaServed": ["Singapore", "Southeast Asia"],
                  "sameAs": ["https://instagram.com/gogmgo"],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "sales",
                    "email": "hello@gogmgo.com",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://gogmgo.com/#website",
                  "url": "https://gogmgo.com",
                  "name": "GoGMGo",
                  "description": "Cloud-based restaurant operating system for modern F&B operators.",
                  "publisher": { "@id": "https://gogmgo.com/#organization" },
                  "inLanguage": "en-SG",
                },
              ],
            }),
          }}
        />

        {/* GTM noscript fallback — must be first child of body */}
        {s.googleTagManagerId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${s.googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        <MotionConfig reducedMotion="user">
          <PublicSettingsProvider
            settings={{ whatsappNumber: s.whatsappNumber, supportEmail: s.supportEmail }}
          >
            <ModalProvider>{children}</ModalProvider>
          </PublicSettingsProvider>
        </MotionConfig>

        {/* ── Analytics scripts — injected only when IDs are configured ── */}

        {/* Google Tag Manager */}
        {s.googleTagManagerId && (
          <Script id="gtm" strategy="afterInteractive" dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${s.googleTagManagerId}');`,
          }} />
        )}

        {/* Google Analytics 4 (direct, without GTM) */}
        {s.googleAnalyticsId && !s.googleTagManagerId && (
          <>
            <Script
              id="ga-script"
              src={`https://www.googletagmanager.com/gtag/js?id=${s.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-config" strategy="afterInteractive" dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${s.googleAnalyticsId}');`,
            }} />
          </>
        )}

        {/* Meta Pixel */}
        {s.metaPixelId && (
          <Script id="meta-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${s.metaPixelId}');fbq('track','PageView');`,
          }} />
        )}

        {/* Microsoft Clarity */}
        {s.clarityProjectId && (
          <Script id="clarity" strategy="afterInteractive" dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${s.clarityProjectId}");`,
          }} />
        )}

        {/* HubSpot tracking */}
        {s.hubspotPortalId && (
          <Script
            id="hs-script"
            src={`//js.hs-scripts.com/${s.hubspotPortalId}.js`}
            strategy="afterInteractive"
          />
        )}
        {s.hubspotTrackingScript && (
          <Script
            id="hs-custom-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: s.hubspotTrackingScript }}
          />
        )}
      </body>
    </html>
  )
}

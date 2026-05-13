"use client"

// Thin analytics helper — fires events to every configured platform.
// Platforms are injected by app/layout.tsx at page load;
// this function safely no-ops if a platform isn't loaded.

type EventParams = Record<string, string | number | boolean>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWindow = Window & Record<string, any>

export function trackEvent(eventName: string, params?: EventParams) {
  if (typeof window === "undefined") return
  const w = window as AnyWindow

  // Google Analytics 4 / GTM via gtag
  if (typeof w.gtag === "function") {
    w.gtag("event", eventName, params ?? {})
  }

  // GTM standalone dataLayer
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event: eventName, ...params })
  }

  // Meta Pixel
  if (typeof w.fbq === "function") {
    w.fbq("trackCustom", eventName, params ?? {})
  }

  // HubSpot analytics API
  if (Array.isArray(w._hsq)) {
    w._hsq.push(["trackEvent", { id: eventName, value: params }])
  }
}

// Named CTA events — keeps call sites readable and event names consistent
export const AnalyticsEvents = {
  bookDemo:          (source: string) => trackEvent("book_demo_click",    { source }),
  ourMenuClick:      ()               => trackEvent("our_menu_click"),
  secretSauceClick:  ()               => trackEvent("secret_sauce_click"),
  contactFormOpen:   ()               => trackEvent("contact_form_open"),
  contactFormSubmit: ()               => trackEvent("contact_form_submit"),
  whatsappClick:     ()               => trackEvent("whatsapp_click"),
  emailClick:        ()               => trackEvent("email_click"),
  pricingBookDemo:   ()               => trackEvent("pricing_book_demo"),
} as const

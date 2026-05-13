import { cache } from "react"
import { db } from "@/lib/db"

export interface SiteSettingsData {
  siteName: string
  defaultSeoTitle: string
  defaultSeoDescription: string
  hubspotPortalId: string
  hubspotFormId: string
  hubspotTrackingScript: string
  whatsappNumber: string
  supportEmail: string
  googleAnalyticsId: string
  googleTagManagerId: string
  metaPixelId: string
  clarityProjectId: string
}

const FALLBACK: SiteSettingsData = {
  siteName: "GoGMGo",
  defaultSeoTitle: "GoGMGo — Restaurant POS & Operating System for Modern F&B",
  defaultSeoDescription:
    "Cloud-based restaurant operating system combining POS, kitchen management, procurement, HR scheduling, and analytics. One connected platform for modern F&B operators in Singapore and beyond.",
  hubspotPortalId: "",
  hubspotFormId: "",
  hubspotTrackingScript: "",
  whatsappNumber: "",
  supportEmail: "hello@gogmgo.com",
  googleAnalyticsId: "",
  googleTagManagerId: "",
  metaPixelId: "",
  clarityProjectId: "",
}

// cache() deduplicates this across a single request render pass
export const getSiteSettings = cache(async (): Promise<SiteSettingsData> => {
  try {
    const row = await db.siteSettings.findUnique({ where: { id: "singleton" } })
    if (!row) return FALLBACK
    return {
      siteName: row.siteName || FALLBACK.siteName,
      defaultSeoTitle: row.defaultSeoTitle || FALLBACK.defaultSeoTitle,
      defaultSeoDescription: row.defaultSeoDescription || FALLBACK.defaultSeoDescription,
      hubspotPortalId: row.hubspotPortalId,
      hubspotFormId: row.hubspotFormId,
      hubspotTrackingScript: row.hubspotTrackingScript,
      whatsappNumber: row.whatsappNumber,
      supportEmail: row.supportEmail || FALLBACK.supportEmail,
      googleAnalyticsId: row.googleAnalyticsId,
      googleTagManagerId: row.googleTagManagerId,
      metaPixelId: row.metaPixelId,
      clarityProjectId: row.clarityProjectId,
    }
  } catch {
    return FALLBACK
  }
})

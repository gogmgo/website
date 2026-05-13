import { db } from "@/lib/db"
import { SettingsForm } from "./SettingsForm"
import { TrackingStatus } from "@/components/admin/TrackingStatus"

export default async function SettingsPage() {
  const raw = await db.siteSettings.findUnique({ where: { id: "singleton" } })
  const settings = raw ?? {
    siteName: "GoGMGo",
    defaultSeoTitle: "GoGMGo — The Restaurant Operating System",
    defaultSeoDescription: "",
    supportEmail: "",
    whatsappNumber: "",
    hubspotPortalId: "",
    hubspotFormId: "",
    hubspotTrackingScript: "",
    googleAnalyticsId: "",
    googleTagManagerId: "",
    metaPixelId: "",
    clarityProjectId: "",
  }

  return (
    <div>
      <h1 style={{ color: "#f4f1ea", fontSize: "1.375rem", fontWeight: 600, margin: "0 0 8px" }}>
        Site Settings
      </h1>
      <p style={{ color: "rgba(184,181,173,0.45)", fontSize: "0.8125rem", margin: "0 0 36px" }}>
        SEO, contact info, HubSpot, and analytics integrations.
      </p>

      <div style={{ display: "flex", gap: "48px", alignItems: "flex-start", flexWrap: "wrap" }}>
        <SettingsForm initialData={settings} />
        <TrackingStatus settings={settings} />
      </div>
    </div>
  )
}

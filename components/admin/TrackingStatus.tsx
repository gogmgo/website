type PartialSettings = {
  googleAnalyticsId: string
  googleTagManagerId: string
  metaPixelId: string
  clarityProjectId: string
  hubspotPortalId: string
  hubspotFormId: string
}

function mask(id: string): string {
  if (id.length <= 6) return id
  return id.slice(0, 5) + "…"
}

const integrations: Array<{
  name: string
  key: keyof PartialSettings
  secondKey?: keyof PartialSettings
  secondLabel?: string
}> = [
  { name: "Google Analytics 4",      key: "googleAnalyticsId" },
  { name: "Google Tag Manager",      key: "googleTagManagerId" },
  { name: "Meta Pixel",              key: "metaPixelId" },
  { name: "Microsoft Clarity",       key: "clarityProjectId" },
  { name: "HubSpot",                 key: "hubspotPortalId", secondKey: "hubspotFormId", secondLabel: "form" },
]

export function TrackingStatus({ settings }: { settings: PartialSettings }) {
  const configured = integrations.filter((i) => settings[i.key])

  return (
    <div style={{ width: "220px", flexShrink: 0 }}>
      <p style={{
        color: "#f4f1ea", fontSize: "0.8125rem", fontWeight: 600,
        marginBottom: "4px",
      }}>
        Tracking Status
      </p>
      <p style={{ color: "rgba(184,181,173,0.40)", fontSize: "0.72rem", marginBottom: "16px" }}>
        {configured.length} of {integrations.length} configured
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {integrations.map((integration) => {
          const active = !!settings[integration.key]
          const secondActive = integration.secondKey ? !!settings[integration.secondKey] : null

          return (
            <div
              key={integration.name}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "7px",
                border: `1px solid ${active ? "rgba(0,175,170,0.22)" : "rgba(244,241,234,0.06)"}`,
                backgroundColor: active ? "rgba(0,175,170,0.04)" : "rgba(244,241,234,0.015)",
              }}
            >
              {/* Dot */}
              <div style={{
                width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0, marginTop: "4px",
                backgroundColor: active ? "#00afaa" : "rgba(184,181,173,0.22)",
              }} />

              <div>
                <p style={{
                  fontSize: "0.75rem", fontWeight: 500, margin: 0,
                  color: active ? "#f4f1ea" : "rgba(184,181,173,0.38)",
                }}>
                  {integration.name}
                </p>
                {active && (
                  <p style={{ fontSize: "0.68rem", color: "rgba(184,181,173,0.45)", margin: "2px 0 0", fontFamily: "monospace" }}>
                    {mask(settings[integration.key])}
                    {secondActive !== null && (
                      <span style={{ marginLeft: "6px", color: secondActive ? "rgba(0,175,170,0.6)" : "rgba(184,181,173,0.28)" }}>
                        · {integration.secondLabel} {secondActive ? "✓" : "missing"}
                      </span>
                    )}
                  </p>
                )}
                {!active && (
                  <p style={{ fontSize: "0.68rem", color: "rgba(184,181,173,0.28)", margin: "2px 0 0" }}>
                    Not configured
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

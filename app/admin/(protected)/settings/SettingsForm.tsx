"use client"

import { useState } from "react"
import { LoadingOverlay } from "@/components/ui/LoadingOverlay"

export type Settings = {
  siteName: string
  defaultSeoTitle: string
  defaultSeoDescription: string
  supportEmail: string
  whatsappNumber: string
  hubspotPortalId: string
  hubspotFormId: string
  hubspotTrackingScript: string
  googleAnalyticsId: string
  googleTagManagerId: string
  metaPixelId: string
  clarityProjectId: string
}

const SECTIONS: Array<{
  title: string
  hint?: string
  fields: Array<{ key: keyof Settings; label: string; type?: string; textarea?: boolean; placeholder?: string }>
}> = [
  {
    title: "Site Identity",
    fields: [
      { key: "siteName",              label: "Site Name" },
      { key: "defaultSeoTitle",       label: "Default SEO Title" },
      { key: "defaultSeoDescription", label: "Default SEO Description", textarea: true },
    ],
  },
  {
    title: "Contact",
    fields: [
      { key: "supportEmail",   label: "Support Email",    type: "email", placeholder: "hello@gogmgo.com" },
      { key: "whatsappNumber", label: "WhatsApp Number",  placeholder: "+65 9000 0000" },
    ],
  },
  {
    title: "HubSpot",
    hint: "Used for the contact form submission and page tracking.",
    fields: [
      { key: "hubspotPortalId",       label: "Portal ID",       placeholder: "12345678" },
      { key: "hubspotFormId",         label: "Form ID",          placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" },
      { key: "hubspotTrackingScript", label: "Custom Tracking Script (optional)", textarea: true },
    ],
  },
  {
    title: "Analytics",
    hint: "Leave blank to skip that platform. GTM takes precedence over direct GA4.",
    fields: [
      { key: "googleAnalyticsId",  label: "Google Analytics Measurement ID",  placeholder: "G-XXXXXXXXXX" },
      { key: "googleTagManagerId", label: "Google Tag Manager Container ID",   placeholder: "GTM-XXXXXXX" },
      { key: "metaPixelId",        label: "Meta Pixel ID",                     placeholder: "1234567890123456" },
      { key: "clarityProjectId",   label: "Microsoft Clarity Project ID",      placeholder: "xxxxxxxxxx" },
    ],
  },
]

export function SettingsForm({ initialData }: { initialData: Settings }) {
  const [data, setData] = useState<Settings>(initialData)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <>
    <LoadingOverlay visible={saving} label="Saving…" />
    <form onSubmit={handleSubmit} style={{ maxWidth: "640px" }}>
      {SECTIONS.map((section) => (
        <div key={section.title} style={{ marginBottom: "36px" }}>
          <div style={{ marginBottom: "16px" }}>
            <p style={{ color: "#f4f1ea", fontSize: "0.8125rem", fontWeight: 600, margin: "0 0 4px" }}>
              {section.title}
            </p>
            {section.hint && (
              <p style={{ color: "rgba(184,181,173,0.40)", fontSize: "0.72rem" }}>{section.hint}</p>
            )}
          </div>

          <div style={{
            padding: "16px 18px",
            borderRadius: "8px",
            border: "1px solid rgba(244,241,234,0.07)",
            backgroundColor: "rgba(244,241,234,0.02)",
          }}>
            {section.fields.map((f) => (
              <div key={f.key} style={{ marginBottom: "16px" }}>
                <label
                  htmlFor={f.key}
                  style={{ display: "block", color: "rgba(184,181,173,0.55)", fontSize: "0.72rem", marginBottom: "5px" }}
                >
                  {f.label}
                </label>
                {f.textarea ? (
                  <textarea
                    id={f.key}
                    value={data[f.key]}
                    placeholder={f.placeholder}
                    onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
                    rows={3}
                    style={inputStyle}
                  />
                ) : (
                  <input
                    id={f.key}
                    type={f.type ?? "text"}
                    value={data[f.key]}
                    placeholder={f.placeholder}
                    onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
                    style={inputStyle}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button type="submit" disabled={saving} style={btnStyle}>
          {saving ? "Saving…" : "Save Settings"}
        </button>
        {saved && <span style={{ color: "#00afaa", fontSize: "0.8125rem" }}>Saved</span>}
      </div>
    </form>
    </>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 11px",
  borderRadius: "6px",
  border: "1px solid rgba(244,241,234,0.10)",
  backgroundColor: "rgba(244,241,234,0.04)",
  color: "#f4f1ea",
  fontSize: "0.8125rem",
  outline: "none",
  resize: "vertical" as const,
  boxSizing: "border-box",
  fontFamily: "inherit",
}

const btnStyle: React.CSSProperties = {
  padding: "9px 20px",
  borderRadius: "7px",
  backgroundColor: "#00afaa",
  border: "none",
  color: "#050505",
  fontSize: "0.875rem",
  fontWeight: 600,
  cursor: "pointer",
}

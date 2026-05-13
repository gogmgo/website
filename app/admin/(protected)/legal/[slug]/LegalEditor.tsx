"use client"

import { useState } from "react"
import { RichTextEditor } from "@/components/admin/RichTextEditor"
import { LoadingOverlay } from "@/components/ui/LoadingOverlay"

type LegalPage = {
  slug: string
  title: string
  content: string
  seoTitle: string
  seoDescription: string
}

export function LegalEditor({ initialData }: { initialData: LegalPage }) {
  const [data, setData] = useState(initialData)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    await fetch(`/api/admin/legal/${data.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
      }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <>
    <LoadingOverlay visible={saving} label="Saving…" />
    <form onSubmit={handleSubmit} style={{ maxWidth: "800px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
        <div>
          <label style={labelStyle}>SEO Title</label>
          <input
            value={data.seoTitle}
            onChange={(e) => setData({ ...data, seoTitle: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>SEO Description</label>
          <input
            value={data.seoDescription}
            onChange={(e) => setData({ ...data, seoDescription: e.target.value })}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>Content</label>
        <RichTextEditor
          content={data.content}
          onChange={(html) => setData({ ...data, content: html })}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button type="submit" disabled={saving} style={btnStyle}>
          {saving ? "Saving…" : "Save Page"}
        </button>
        {saved && (
          <span style={{ color: "#00afaa", fontSize: "0.8125rem" }}>Saved</span>
        )}
      </div>
    </form>
    </>
  )
}

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "rgba(184,181,173,0.60)",
  fontSize: "0.75rem",
  marginBottom: "6px",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "6px",
  border: "1px solid rgba(244,241,234,0.12)",
  backgroundColor: "rgba(244,241,234,0.04)",
  color: "#f4f1ea",
  fontSize: "0.875rem",
  outline: "none",
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

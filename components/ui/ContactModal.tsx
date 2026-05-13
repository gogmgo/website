"use client"

import { useEffect, useRef, useState, type FormEvent, type ChangeEvent } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { modalBackdrop, modalPanel } from "@/lib/motion"
import { usePublicSettings } from "@/context/PublicSettingsContext"
import { AnalyticsEvents } from "@/lib/analytics"
import { LoadingOverlay } from "@/components/ui/LoadingOverlay"

// ─── Static data ─────────────────────────────────────────────────────────────

const PRODUCTS = [
  "GoGMGo Standard — for standalone outlets",
  "Shared Ops — for outlets with HQ",
  "QR self-ordering and ordering on website",
  "Food ordering apps and POS linking",
  "Loyalty apps and POS linking",
  "Reservation apps and POS linking",
  "Accounting apps and POS linking",
  "Hardware — competitively priced iPads, printers, etc.",
  "Payment processing at very competitive rates",
]

const COMPANY_TYPES = [
  "Restaurant",
  "Café",
  "Bar",
  "Bakery",
  "Cloud Kitchen",
  "Hospitality Group",
  "Franchise / Chain",
  "Other",
]

const OUTLET_COUNTS = ["1", "2–5", "6–10", "11–25", "26–50", "50+"]

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName: string
  jobTitle: string
  websiteUrl: string
  companyType: string
  numOutlets: string
  productsOfInterest: string[]
  message: string
}

const EMPTY: FormValues = {
  firstName: "", lastName: "", email: "", phone: "",
  companyName: "", jobTitle: "", websiteUrl: "",
  companyType: "", numOutlets: "",
  productsOfInterest: [], message: "",
}

// ─── Micro-components ─────────────────────────────────────────────────────────

const FIELD_BASE: React.CSSProperties = {
  width: "100%",
  backgroundColor: "rgba(14,11,8,0.88)",
  border: "1px solid rgba(244,241,234,0.08)",
  borderRadius: "8px",
  color: "#f4f1ea",
  fontSize: "13px",
  lineHeight: "1.6",
  padding: "10px 14px",
  outline: "none",
  transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  fontFamily: "inherit",
}

function onFocusField(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "#00b1ae"
  e.currentTarget.style.boxShadow = "0 0 0 2px rgba(0,177,174,0.08)"
}
function onBlurField(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "rgba(244,241,234,0.08)"
  e.currentTarget.style.boxShadow = "none"
}

function Label({ text, required, htmlFor }: { text: string; required?: boolean; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: "block",
        marginBottom: "6px",
        fontSize: "13px",
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(184,181,173,0.72)",
      }}
    >
      {text}
      {required && <span style={{ color: "#00b1ae", marginLeft: "3px" }}>*</span>}
    </label>
  )
}

function TextInput({
  id, placeholder, value, onChange, type = "text", required,
}: {
  id: string; placeholder: string; value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string; required?: boolean;
}) {
  return (
    <input
      id={id} type={type} placeholder={placeholder}
      value={value} onChange={onChange} required={required}
      className="gogmgo-field"
      style={FIELD_BASE}
      onFocus={onFocusField} onBlur={onBlurField}
    />
  )
}

function SelectInput({
  id, placeholder, value, onChange, options, required,
}: {
  id: string; placeholder: string; value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[]; required?: boolean;
}) {
  return (
    <div style={{ position: "relative" }}>
      <select
        id={id} value={value} onChange={onChange} required={required}
        className="gogmgo-field"
        style={{ ...FIELD_BASE, appearance: "none", paddingRight: "36px", cursor: "pointer", color: value ? "#f4f1ea" : "rgba(184,181,173,0.28)" }}
        onFocus={onFocusField} onBlur={onBlurField}
      >
        <option value="" style={{ backgroundColor: "#0D0A06", color: "rgba(184,181,173,0.4)" }}>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} style={{ backgroundColor: "#0D0A06", color: "#f4f1ea" }}>
            {o}
          </option>
        ))}
      </select>
      {/* Chevron arrow */}
      <svg
        viewBox="0 0 12 8" fill="none"
        style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", width: "11px", pointerEvents: "none" }}
      >
        <path d="M1 1.5L6 6.5L11 1.5" stroke="rgba(184,181,173,0.38)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function CheckboxItem({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", userSelect: "none" }}>
      <div style={{ position: "relative", flexShrink: 0, marginTop: "1px" }}>
        <input
          type="checkbox" checked={checked} onChange={onToggle}
          style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", margin: 0, width: "100%", height: "100%" }}
        />
        <div style={{
          width: "16px", height: "16px", borderRadius: "4px", display: "flex",
          alignItems: "center", justifyContent: "center",
          border: `1.5px solid ${checked ? "#00b1ae" : "rgba(244,241,234,0.12)"}`,
          backgroundColor: checked ? "rgba(0,177,174,0.12)" : "rgba(14,11,8,0.8)",
          transition: "border-color 0.15s ease, background-color 0.15s ease",
          pointerEvents: "none",
        }}>
          {checked && (
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <path d="M1 3.5L3.2 5.8L8 1" stroke="#00b1ae" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
      <span style={{ fontSize: "13px", fontWeight: 500, lineHeight: "1.55", color: "rgba(184,181,173,0.75)", letterSpacing: "0.01em" }}>
        {label}
      </span>
    </label>
  )
}

// ─── Section divider label ────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <p style={{
      fontSize: "13px", fontWeight: 500, letterSpacing: "0.12em",
      textTransform: "uppercase", color: "rgba(184,181,173,0.66)",
      marginBottom: "12px", marginTop: "4px",
    }}>
      {text}
    </p>
  )
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px 56px" }}>
      <div style={{ marginBottom: "28px", display: "inline-flex" }}>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="26" fill="none" stroke="#00b1ae" strokeWidth="0.8" strokeOpacity="0.25" />
          <circle cx="28" cy="28" r="20" fill="rgba(0,177,174,0.06)" stroke="#00b1ae" strokeWidth="0.7" strokeOpacity="0.5" />
          <path d="M18 28L24.5 34.5L38 20" stroke="#00b1ae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p style={{ color: "#f4f1ea", fontSize: "21px", fontWeight: 600, letterSpacing: "-0.015em", marginBottom: "12px" }}>
        Request received.
      </p>
      <p style={{ color: "rgba(184,181,173,0.62)", fontSize: "14px", fontWeight: 500, lineHeight: "1.7", maxWidth: "340px", margin: "0 auto 36px" }}>
        Thanks — we&apos;ve received your request. Our team will be in touch shortly.
      </p>
      <button
        type="button" onClick={onClose}
        style={{
          backgroundColor: "rgba(0,177,174,0.10)", border: "1px solid rgba(0,177,174,0.35)",
          color: "#00b1ae", borderRadius: "9px", padding: "10px 28px", fontSize: "13px",
          fontWeight: 500, cursor: "pointer", letterSpacing: "0.01em",
          transition: "background-color 0.25s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,177,174,0.18)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,177,174,0.10)")}
      >
        Close
      </button>
    </div>
  )
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { whatsappNumber, supportEmail } = usePublicSettings()
  const panelRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState<FormValues>(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Scroll lock + focus trap + escape
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault()
          ;(e.shiftKey ? last : first).focus()
        }
      }
    }
    window.addEventListener("keydown", handleKey)
    // Move focus into modal on open
    const t = setTimeout(() => panelRef.current?.querySelector<HTMLElement>("button, input")?.focus(), 60)
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", handleKey); clearTimeout(t) }
  }, [isOpen, onClose])

  // Reset form after close animation completes
  useEffect(() => {
    if (isOpen) return
    const t = setTimeout(() => { setForm(EMPTY); setSubmitted(false); setSubmitError(null) }, 350)
    return () => clearTimeout(t)
  }, [isOpen])

  const set = (key: keyof FormValues) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  const toggleProduct = (label: string) =>
    setForm((f) => ({
      ...f,
      productsOfInterest: f.productsOfInterest.includes(label)
        ? f.productsOfInterest.filter((p) => p !== label)
        : [...f.productsOfInterest, label],
    }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSubmitError(null)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Submission failed")
      AnalyticsEvents.contactFormSubmit()
      setSubmitted(true)
    } catch {
      setSubmitError("Something went wrong. Please try again or email us directly.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Full-screen loader while the form submits */}
      <LoadingOverlay visible={loading} label="Sending…" />

    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[70]"
            style={{ backgroundColor: "rgba(5,3,2,0.62)", backdropFilter: "blur(16px)" }}
            variants={modalBackdrop} initial="hidden" animate="visible" exit="exit"
            onClick={onClose}
          />

          {/* Scroll/position container */}
          <div
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center overflow-y-auto sm:p-4"
            onClick={onClose}
          >
            <motion.div
              ref={panelRef}
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-modal-title"
              className="relative w-full sm:max-w-[660px] rounded-t-2xl sm:rounded-2xl flex flex-col"
              style={{
                background: "linear-gradient(160deg, rgba(30,22,12,0.96) 0%, rgba(20,15,9,0.96) 100%)",
                border: "1px solid rgba(200,169,106,0.20)",
                borderBottom: "none",
                boxShadow: "0 0 0 0.5px rgba(200,169,106,0.10), 0 -24px 80px rgba(0,0,0,0.55)",
                maxHeight: "95dvh",
                overflow: "hidden",
              }}
              variants={modalPanel} initial="hidden" animate="visible" exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Atmospheric layers (non-scrolling) ── */}
              <div className="pointer-events-none absolute inset-0 z-0">
                {/* Top amber edge */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                  background: "linear-gradient(90deg, transparent 0%, rgba(200,169,106,0.45) 25%, rgba(200,169,106,0.45) 75%, transparent 100%)",
                }} />
                {/* Warm amber ambient from top */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "45%",
                  background: "radial-gradient(ellipse 70% 80% at 50% 0%, rgba(200,169,106,0.055) 0%, transparent 70%)",
                }} />
                {/* Left teal accent */}
                <div style={{
                  position: "absolute", top: 0, left: 0, width: "35%", height: "35%",
                  background: "radial-gradient(ellipse 80% 70% at 0% 0%, rgba(0,177,174,0.04) 0%, transparent 65%)",
                }} />
              </div>

              {/* ── Fixed close row ── */}
              <div className="relative z-10 flex justify-end px-5 pt-4 pb-1 shrink-0">
                <button
                  type="button" onClick={onClose} aria-label="Close"
                  style={{
                    width: "30px", height: "30px", borderRadius: "50%", display: "flex",
                    alignItems: "center", justifyContent: "center", cursor: "pointer",
                    backgroundColor: "rgba(244,241,234,0.05)", border: "1px solid rgba(244,241,234,0.08)",
                    color: "rgba(184,181,173,0.5)", fontSize: "16px", lineHeight: 1,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(244,241,234,0.10)"
                    e.currentTarget.style.color = "rgba(244,241,234,0.85)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(244,241,234,0.05)"
                    e.currentTarget.style.color = "rgba(184,181,173,0.5)"
                  }}
                >
                  ✕
                </button>
              </div>

              {/* ── Scrollable content ── */}
              <div className="relative z-10 overflow-y-auto flex-1" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
                {submitted ? (
                  <SuccessState onClose={onClose} />
                ) : (
                  <div className="px-6 sm:px-10 pb-8">
                    {/* Header */}
                    <div style={{ marginBottom: "28px" }}>
                      <p style={{
                        fontSize: "12px", fontWeight: 500, letterSpacing: "0.15em",
                        textTransform: "uppercase", color: "rgba(0,177,174,0.88)", marginBottom: "10px",
                      }}>
                        GoGMGo
                      </p>
                      <h2 id="contact-modal-title" style={{
                        color: "#f4f1ea", fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 600,
                        letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "10px",
                      }}>
                        Book a Demo
                      </h2>
                      <p style={{ color: "rgba(184,181,173,0.70)", fontSize: "13.5px", fontWeight: 500, lineHeight: "1.65", maxWidth: "420px" }}>
                        Tell us a little about your restaurant and our team will get back to you.
                      </p>
                    </div>

                    {/* ── Form ── */}
                    <form onSubmit={handleSubmit}>
                      {/* Row: First / Last name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label text="First Name" required htmlFor="cf-first" />
                          <TextInput id="cf-first" placeholder="Jane" value={form.firstName} onChange={set("firstName")} required />
                        </div>
                        <div>
                          <Label text="Last Name" required htmlFor="cf-last" />
                          <TextInput id="cf-last" placeholder="Smith" value={form.lastName} onChange={set("lastName")} required />
                        </div>
                      </div>

                      {/* Email */}
                      <div style={{ marginBottom: "16px" }}>
                        <Label text="Email" required htmlFor="cf-email" />
                        <TextInput id="cf-email" type="email" placeholder="jane@restaurant.com" value={form.email} onChange={set("email")} required />
                      </div>

                      {/* Phone */}
                      <div style={{ marginBottom: "16px" }}>
                        <Label text="Phone Number" required htmlFor="cf-phone" />
                        <TextInput id="cf-phone" type="tel" placeholder="+65 9000 0000" value={form.phone} onChange={set("phone")} required />
                      </div>

                      {/* Row: Company / Job title */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label text="Company Name" required htmlFor="cf-company" />
                          <TextInput id="cf-company" placeholder="The Grand Café" value={form.companyName} onChange={set("companyName")} required />
                        </div>
                        <div>
                          <Label text="Job Title" required htmlFor="cf-jobtitle" />
                          <TextInput id="cf-jobtitle" placeholder="General Manager" value={form.jobTitle} onChange={set("jobTitle")} required />
                        </div>
                      </div>

                      {/* Website */}
                      <div style={{ marginBottom: "16px" }}>
                        <Label text="Website URL" required htmlFor="cf-website" />
                        <TextInput id="cf-website" type="url" placeholder="https://yourbusiness.com" value={form.websiteUrl} onChange={set("websiteUrl")} required />
                      </div>

                      {/* Row: Company type / Outlets */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                          <Label text="Company Type" required htmlFor="cf-type" />
                          <SelectInput id="cf-type" placeholder="Select type" value={form.companyType} onChange={set("companyType")} options={COMPANY_TYPES} required />
                        </div>
                        <div>
                          <Label text="Number of Outlets" required htmlFor="cf-outlets" />
                          <SelectInput id="cf-outlets" placeholder="Select range" value={form.numOutlets} onChange={set("numOutlets")} options={OUTLET_COUNTS} required />
                        </div>
                      </div>

                      {/* Products of interest */}
                      <div style={{ marginBottom: "24px" }}>
                        <SectionLabel text="Products of Interest" />
                        <div
                          className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6"
                          style={{
                            padding: "16px 18px",
                            backgroundColor: "rgba(14,11,8,0.55)",
                            borderRadius: "10px",
                            border: "1px solid rgba(244,241,234,0.06)",
                          }}
                        >
                          {PRODUCTS.map((p) => (
                            <CheckboxItem
                              key={p} label={p}
                              checked={form.productsOfInterest.includes(p)}
                              onToggle={() => toggleProduct(p)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Message */}
                      <div style={{ marginBottom: "22px" }}>
                        <Label text="Details / Message" htmlFor="cf-message" />
                        <textarea
                          id="cf-message"
                          rows={4}
                          placeholder="Tell us more about your restaurant, any specific challenges, or questions you have..."
                          value={form.message}
                          onChange={set("message")}
                          className="gogmgo-field"
                          style={{ ...FIELD_BASE, resize: "vertical", minHeight: "96px" }}
                          onFocus={onFocusField} onBlur={onBlurField}
                        />
                      </div>

                      {/* Privacy text */}
                      <div style={{ marginBottom: "22px" }}>
                        <p style={{ fontSize: "13px", fontWeight: 500, color: "rgba(184,181,173,0.55)", lineHeight: "1.7", letterSpacing: "0.005em" }}>
                          GoGMGo needs the contact information you provide to contact you about our products and
                          services. You may unsubscribe from these communications at any time. For information on
                          how to unsubscribe, as well as our privacy practices and commitment to protecting your
                          privacy, please review our{" "}
                          <Link href="/privacy-policy" onClick={onClose} style={{ color: "rgba(0,177,174,0.6)", textDecorationLine: "underline" }}>
                            Privacy Policy
                          </Link>.
                        </p>
                      </div>

                      {/* Error message */}
                      {submitError && (
                        <p style={{
                          color: "#f87171", fontSize: "14px", marginBottom: "14px",
                          padding: "10px 14px", borderRadius: "8px",
                          backgroundColor: "rgba(248,113,113,0.07)",
                          border: "1px solid rgba(248,113,113,0.18)",
                        }}>
                          {submitError}
                        </p>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                        style={{
                          backgroundColor: loading ? "rgba(0,177,174,0.55)" : "#00b1ae",
                          color: "#050505",
                          borderRadius: "10px", padding: "13px 24px",
                          fontSize: "14px", fontWeight: 600, letterSpacing: "0.01em",
                          cursor: loading ? "not-allowed" : "pointer", border: "none",
                          transition: "background-color 0.25s ease",
                        }}
                        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#007b6f" }}
                        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#00b1ae" }}
                      >
                        {loading ? "Sending…" : "Submit Demo Request"}
                      </button>
                    </form>

                    {/* ── Contact alternatives ── */}
                    <div style={{
                      marginTop: "28px", paddingTop: "22px",
                      borderTop: "1px solid rgba(244,241,234,0.06)",
                    }}>
                      <p style={{
                        textAlign: "center", fontSize: "13.5px",
                        color: "rgba(184,181,173,0.58)", marginBottom: "14px", letterSpacing: "0.012em",
                      }}>
                        Prefer to speak with us directly?
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        {/* Email — uses admin-managed supportEmail, falls back to hello@ */}
                        <a
                          href={`mailto:${supportEmail || "hello@gogmgo.com"}`}
                          onClick={() => AnalyticsEvents.emailClick()}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: "7px",
                            fontSize: "14px", fontWeight: 500, color: "rgba(184,181,173,0.72)",
                            border: "1px solid rgba(244,241,234,0.07)",
                            backgroundColor: "rgba(14,11,8,0.6)",
                            borderRadius: "8px", padding: "8px 14px",
                            textDecoration: "none", transition: "all 0.2s ease", letterSpacing: "0.01em",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#f4f1ea"
                            e.currentTarget.style.borderColor = "rgba(244,241,234,0.15)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "rgba(184,181,173,0.70)"
                            e.currentTarget.style.borderColor = "rgba(244,241,234,0.07)"
                          }}
                        >
                          <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                            <rect x="0.5" y="0.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeOpacity="0.6" />
                            <path d="M1 1.5L6.5 5.5L12 1.5" stroke="currentColor" strokeOpacity="0.6" strokeLinecap="round" />
                          </svg>
                          {supportEmail || "hello@gogmgo.com"}
                        </a>

                        {/* WhatsApp — only shown when whatsappNumber is configured in admin */}
                        {whatsappNumber && (
                          <a
                            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => AnalyticsEvents.whatsappClick()}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: "7px",
                              fontSize: "14px", fontWeight: 500, color: "rgba(184,181,173,0.72)",
                              border: "1px solid rgba(244,241,234,0.07)",
                              backgroundColor: "rgba(14,11,8,0.6)",
                              borderRadius: "8px", padding: "8px 14px",
                              textDecoration: "none", transition: "all 0.2s ease", letterSpacing: "0.01em",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = "#f4f1ea"
                              e.currentTarget.style.borderColor = "rgba(244,241,234,0.15)"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = "rgba(184,181,173,0.70)"
                              e.currentTarget.style.borderColor = "rgba(244,241,234,0.07)"
                            }}
                          >
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                              <path
                                d="M6.5 1C3.46 1 1 3.46 1 6.5c0 .96.25 1.87.68 2.66L1 12l2.92-.66A5.47 5.47 0 006.5 12C9.54 12 12 9.54 12 6.5S9.54 1 6.5 1z"
                                stroke="currentColor" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round"
                              />
                              <path
                                d="M4.5 5.5c.1.4.3.77.6 1.05L6.2 7.7c.29.3.66.5 1.05.6.18.05.37-.01.5-.14l.35-.35c.1-.1.1-.28 0-.38L7.3 6.63c-.1-.1-.28-.1-.38 0l-.18.18a3.2 3.2 0 01-1.55-1.55l.18-.18c.1-.1.1-.28 0-.38L4.97 3.9c-.1-.1-.28-.1-.38 0l-.35.35c-.13.13-.19.32-.14.5z"
                                fill="currentColor" fillOpacity="0.6"
                              />
                            </svg>
                            WhatsApp Business
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* Safe area bottom padding on mobile */}
              <div className="shrink-0 sm:hidden" style={{ height: "max(16px, env(safe-area-inset-bottom))" }} />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
    </>
  )
}

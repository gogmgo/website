"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { usePublicSettings } from "@/context/PublicSettingsContext"

interface Section {
  heading: string
  body: string | string[]
}

interface LegalLayoutProps {
  title: string
  subtitle?: string
  effectiveDate: string
  sections: Section[]
  htmlContent?: string | null  // CMS rich-text — rendered instead of sections when present
}

export function LegalLayout({ title, subtitle, effectiveDate, sections, htmlContent }: LegalLayoutProps) {
  const { supportEmail } = usePublicSettings()
  const contactEmail = supportEmail || "hello@gogmgo.com"
  return (
    <div style={{ backgroundColor: "#050402", minHeight: "100vh" }}>
      {/* Ambient top glow */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-0"
        style={{
          height: "40vh",
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,177,174,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Sticky nav bar */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 lg:px-14"
        style={{
          backgroundColor: "rgba(5,4,2,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(244,241,234,0.05)",
        }}
      >
        <Link href="/" className="flex items-center">
          <Image
            src="/brand/gogmgo-logo-white-2026.svg"
            alt="GoGMGo"
            width={140}
            height={39}
            unoptimized
            style={{ height: "28px", width: "auto" }}
          />
        </Link>
        <Link
          href="/"
          className="text-sm transition-colors duration-300"
          style={{ color: "rgba(184,181,173,0.52)", letterSpacing: "0.01em" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#00b1ae")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(184,181,173,0.45)")}
        >
          ← Back to Home
        </Link>
      </header>

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-3xl px-8 pb-24 pt-16 lg:px-6">
        {/* Title block */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p
            className="mb-4 text-xs font-medium uppercase tracking-[0.22em]"
            style={{ color: "rgba(0,177,174,0.7)" }}
          >
            GoGMGo Legal
          </p>
          <h1
            className="mb-4 text-4xl font-semibold leading-tight sm:text-5xl"
            style={{ color: "#f4f1ea", letterSpacing: "-0.022em" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mb-5 text-base leading-relaxed" style={{ color: "#b8b5ad", fontWeight: 500 }}>
              {subtitle}
            </p>
          )}
          <p className="text-sm" style={{ color: "rgba(184,181,173,0.50)", letterSpacing: "0.01em", fontWeight: 500 }}>
            Effective date: {effectiveDate}
          </p>
        </motion.div>

        {/* Hairline */}
        <motion.div
          className="mb-14 h-px"
          style={{
            background: "linear-gradient(90deg, rgba(0,177,174,0.25) 0%, rgba(200,169,106,0.12) 50%, transparent 100%)",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.0, ease: "easeOut", delay: 0.3 }}
        />

        {/* Sections — CMS HTML if available, otherwise structured fallback */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {htmlContent ? (
            <div
              className="legal-prose"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          ) : (
            <div className="space-y-12">
              {sections.map((section, i) => (
                <div key={i}>
                  <h2
                    className="mb-4 text-lg font-semibold leading-snug"
                    style={{ color: "#f4f1ea", letterSpacing: "-0.01em" }}
                  >
                    {section.heading}
                  </h2>
                  {Array.isArray(section.body) ? (
                    <ul className="space-y-2">
                      {section.body.map((item, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span
                            className="mt-2.5 h-px w-4 shrink-0"
                            style={{ backgroundColor: "rgba(0,177,174,0.4)" }}
                          />
                          <span
                            className="text-sm leading-relaxed font-[500]"
                            style={{ color: "rgba(184,181,173,0.72)" }}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(184,181,173,0.72)" }}
                    >
                      {section.body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Contact block */}
        <motion.div
          className="mt-16 rounded-2xl px-8 py-8"
          style={{
            border: "1px solid rgba(0,177,174,0.12)",
            backgroundColor: "rgba(0,177,174,0.03)",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="mb-1 text-sm font-semibold" style={{ color: "#f4f1ea" }}>
            Questions about this document?
          </p>
          <p className="mb-3 text-sm" style={{ color: "rgba(184,181,173,0.60)", fontWeight: 500 }}>
            We&apos;re happy to clarify anything in plain language.
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="text-sm font-medium transition-colors duration-300"
            style={{ color: "#00b1ae" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#007b6f")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#00b1ae")}
          >
            {contactEmail}
          </a>
        </motion.div>
      </main>

      {/* Footer strip */}
      <footer
        className="relative z-10 border-t px-8 py-5 lg:px-14"
        style={{ borderColor: "rgba(244,241,234,0.05)" }}
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm" style={{ color: "rgba(184,181,173,0.34)", letterSpacing: "0.01em" }}>
            © {new Date().getFullYear()} GoGMGo. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link
              href="/privacy-policy"
              className="text-sm transition-colors duration-300"
              style={{ color: "rgba(184,181,173,0.40)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00b1ae")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(184,181,173,0.28)")}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="text-sm transition-colors duration-300"
              style={{ color: "rgba(184,181,173,0.40)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00b1ae")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(184,181,173,0.28)")}
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

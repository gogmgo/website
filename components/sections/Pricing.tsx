"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { fadeUp, stagger } from "@/lib/motion"
import { useModal } from "@/context/ModalContext"
import { AnalyticsEvents } from "@/lib/analytics"

const tiers = [
  {
    name: "GoGMGo Starter",
    price: "$119",
    yearly: "$1,239",
    tagline: "Everything you need to launch confidently.",
    badge: { text: "Start Here", style: "quiet" as const },
    includes: [] as { label: string; sub: string }[], // rendered via custom StarterPaths layout below
  },
  {
    name: "GoGMGo Basic",
    price: "$169",
    yearly: "$1,239",
    tagline: "Designed for cafés, bars, and lean operations.",
    badge: { text: "Most Popular", style: "teal" as const },
    includes: [
      { label: "GoPosGo", sub: "Up to 2 Screens (POS, KDS, CDS*)" },
      { label: "GoDataGo", sub: "1 Viewer License" },
      { label: "GoHrGo", sub: "Unlimited Users" },
      { label: "GoChefGo", sub: "Unlimited Users" },
    ],
  },
  {
    name: "GoGMGo Standard",
    price: "$219",
    yearly: "$2,239",
    tagline: "Advanced workflows for high-volume restaurant operations.",
    badge: { text: "Full-Service Ready", style: "brass" as const },
    includes: [
      { label: "GoPosGo", sub: "Unlimited Screens*" },
      { label: "GoDataGo", sub: "1 Viewer License" },
      { label: "GoHrGo", sub: "Unlimited Users" },
      { label: "GoChefGo", sub: "Unlimited Users" },
    ],
  },
]

const addons = [
  {
    name: "Screens",
    description: "Additional display screens for KDS, CDS and self-service.",
    price: "$19",
    priceSub: "/mth per screen",
    alt: "$49/mth unlimited",
    accent: "#4A9EFF",
  },
  {
    name: "Shared Ops",
    description: "Group HQ account with approval workflows and data sharing across outlets.",
    price: "$100",
    priceSub: "/mth",
    alt: "$1,000/yr",
    accent: "#00B1AE",
  },
  {
    name: "Ordrr",
    description: "Self-service ordering — QR, online, kiosk. Frees up wait staff.",
    price: "$99",
    priceSub: "/mth",
    alt: "$989/yr",
    accent: "#8B5CF6",
  },
  {
    name: "GoLinkGo",
    description: "Connect third-party platforms directly to your POS — choose the packs you need.",
    price: "$49",
    priceSub: "/mth per Pack",
    alt: "$499/yr per Pack",
    accent: "#E060B0",
    packs: ["Delivery Aggregators", "Reservations", "Loyalty"],
  },
]

const benefits = [
  "No setup fees",
  "Pay per outlet",
  "24/7 support",
  "Only pay for add-ons you need",
]

export function Pricing() {
  const sectionRef = useRef<HTMLElement>(null)
  const { openModal } = useModal()
  const prefersReduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.05])

  // Entry blur — clears as the section scrolls up into view from below
  const { scrollYProgress: entryProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  })
  const entryBlurNum = useTransform(entryProgress, [0, 0.22], [8, 0])
  const entryFilter = useTransform(entryBlurNum, (v) => `blur(${v.toFixed(1)}px)`)

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative overflow-hidden isolate"
      style={{ minHeight: "115vh" }}
    >
      {/* ── Render: pricing-new.png — the final café destination ── */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: prefersReduced ? 0 : imageY,
          scale: prefersReduced ? 1 : imageScale,
          filter: prefersReduced ? undefined : entryFilter,
          willChange: "transform, filter",
          pointerEvents: "none",
        }}
      >
        <Image
          src="/assets/pricing-new.png"
          alt="GoGMGo pricing — all-in-one package"
          fill
          className="object-cover object-top"
          quality={88}
          sizes="100vw"
        />
      </motion.div>

      {/* Dark atmospheric overlay — premium readability */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(5,4,2,0.68) 0%, rgba(5,4,2,0.76) 35%, rgba(5,4,2,0.82) 100%)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 py-20 lg:px-14 lg:py-24">

        {/* Header */}
        <motion.div
          className="mb-14 max-w-2xl"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p variants={fadeUp} className="mb-4 text-xs font-medium uppercase tracking-[0.22em]" style={{ color: "#b8b5ad" }}>
            Pricing
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mb-3 text-4xl font-semibold leading-tight sm:text-5xl"
            style={{ color: "#f4f1ea", letterSpacing: "-0.022em" }}
          >
            All-in-one package pricing.
            <br />No setup fees.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base leading-relaxed" style={{ color: "#b8b5ad", fontWeight: 500 }}>
            Pricing is straightforward and charged per outlet — only pay for the add-ons you need.
          </motion.p>
        </motion.div>

        {/* Pricing tiers */}
        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-16"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {tiers.map((tier) => {
            const isTeal  = tier.badge.style === "teal"
            const isBrass = tier.badge.style === "brass"

            return (
              <motion.div
                key={tier.name}
                variants={fadeUp}
                className="relative rounded-2xl p-5 sm:p-7 transition-all duration-300 cursor-default"
                style={{
                  backgroundColor: isTeal
                    ? "rgba(0,177,174,0.08)"
                    : isBrass
                    ? "rgba(200,169,106,0.07)"
                    : "rgba(14,11,7,0.60)",
                  border: isTeal
                    ? "1px solid rgba(0,177,174,0.35)"
                    : isBrass
                    ? "1px solid rgba(200,169,106,0.28)"
                    : "1px solid rgba(244,241,234,0.07)",
                  backdropFilter: "blur(12px)",
                }}
                whileHover={{
                  y: -6,
                  boxShadow: isTeal
                    ? "0 12px 40px rgba(0,177,174,0.14), 0 0 0 1px rgba(0,177,174,0.4)"
                    : isBrass
                    ? "0 12px 40px rgba(200,169,106,0.11), 0 0 0 1px rgba(200,169,106,0.36)"
                    : "0 12px 40px rgba(0,0,0,0.5)",
                }}
                transition={{ duration: 0.22 }}
              >
                {/* ── Badge chip ───────────────────────────────────────────── */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {isTeal && (
                    <span
                      className="rounded-full px-3 py-0.5 text-xs font-semibold whitespace-nowrap"
                      style={{ backgroundColor: "#00b1ae", color: "#050505" }}
                    >
                      {tier.badge.text}
                    </span>
                  )}
                  {isBrass && (
                    <span
                      className="rounded-full px-3 py-0.5 text-xs font-semibold whitespace-nowrap"
                      style={{ backgroundColor: "#c8a96a", color: "#050505" }}
                    >
                      {tier.badge.text}
                    </span>
                  )}
                  {!isTeal && !isBrass && (
                    <span
                      className="rounded-full px-3 py-0.5 text-xs font-medium whitespace-nowrap"
                      style={{
                        backgroundColor: "rgba(244,241,234,0.05)",
                        border: "1px solid rgba(244,241,234,0.10)",
                        color: "rgba(184,181,173,0.68)",
                      }}
                    >
                      {tier.badge.text}
                    </span>
                  )}
                </div>

                <p className="mb-1 text-xl font-semibold leading-snug" style={{ color: "#f4f1ea" }}>
                  {tier.name}
                </p>
                <p className="mb-5 text-sm leading-relaxed" style={{ color: "rgba(184,181,173,0.82)", fontWeight: 500 }}>
                  {tier.tagline}
                </p>

                <div className="mb-5 flex items-baseline gap-2">
                  <span className="text-3xl font-bold" style={{ color: "#f4f1ea" }}>
                    {tier.price}
                  </span>
                  <span className="text-sm" style={{ color: "rgba(184,181,173,0.72)", fontWeight: 500 }}>
                    /mth
                  </span>
                  <span className="ml-auto text-sm" style={{ color: "rgba(184,181,173,0.72)", fontWeight: 500 }}>
                    or {tier.yearly}/yr
                  </span>
                </div>

                <div
                  className="mb-5 h-px"
                  style={{ backgroundColor: "rgba(244,241,234,0.06)" }}
                />

                {tier.name === "GoGMGo Starter" ? (
                  // ── Starter: choice-architecture layout ────────────────────
                  <div>
                    {/* Foundation layer */}
                    <div style={{ marginBottom: "14px" }}>
                      <p style={{
                        fontSize: "12px", letterSpacing: "0.13em", textTransform: "uppercase",
                        color: "rgba(184,181,173,0.88)", marginBottom: "7px",
                      }}>
                        Analytics
                      </p>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                        <div style={{ marginTop: "4px", height: "5px", width: "5px", borderRadius: "50%", flexShrink: 0, backgroundColor: "rgba(184,181,173,0.32)" }} />
                        <div>
                          <span style={{ fontSize: "13.5px", fontWeight: 500, color: "rgba(244,241,234,0.88)" }}>GoDataGo</span>
                          <span style={{ fontSize: "13.5px", fontWeight: 500, color: "rgba(184,181,173,0.80)", marginLeft: "4px" }}>— 1 Viewer License</span>
                        </div>
                      </div>
                    </div>

                    {/* Choose One divider */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(244,241,234,0.06)" }} />
                      <span style={{ fontSize: "11.5px", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(184,181,173,0.68)", whiteSpace: "nowrap" }}>
                        Choose One Path
                      </span>
                      <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(244,241,234,0.06)" }} />
                    </div>

                    {/* Path A — Back-office */}
                    <div style={{
                      padding: "12px 14px", borderRadius: "10px",
                      backgroundColor: "rgba(244,241,234,0.025)",
                      border: "1px solid rgba(244,241,234,0.07)",
                    }}>
                      <p style={{ fontSize: "12px", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(184,181,173,0.88)", marginBottom: "9px" }}>
                        Back-office
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                        {(["GoHRGo", "GoChefGo"] as const).map((label) => (
                          <div key={label} style={{ display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap" }}>
                            <div style={{ height: "4px", width: "4px", borderRadius: "50%", flexShrink: 0, backgroundColor: "rgba(184,181,173,0.28)" }} />
                            <span style={{ fontSize: "14px", fontWeight: 500, color: "rgba(244,241,234,0.88)" }}>{label}</span>
                            <span style={{ fontSize: "13.5px", fontWeight: 500, color: "rgba(184,181,173,0.80)", marginLeft: "1px" }}>— Unlimited Users</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* "or" separator */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "8px 0" }}>
                      <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(244,241,234,0.05)" }} />
                      <span style={{ fontSize: "12.5px", color: "rgba(184,181,173,0.65)", letterSpacing: "0.08em" }}>or</span>
                      <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(244,241,234,0.05)" }} />
                    </div>

                    {/* Path B — Front-of-house */}
                    <div style={{
                      padding: "12px 14px", borderRadius: "10px",
                      backgroundColor: "rgba(244,241,234,0.025)",
                      border: "1px solid rgba(244,241,234,0.07)",
                    }}>
                      <p style={{ fontSize: "12px", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(184,181,173,0.88)", marginBottom: "9px" }}>
                        Front-of-house
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap" }}>
                        <div style={{ height: "4px", width: "4px", borderRadius: "50%", flexShrink: 0, backgroundColor: "rgba(184,181,173,0.28)" }} />
                        <span style={{ fontSize: "14px", fontWeight: 500, color: "rgba(244,241,234,0.88)" }}>GoPosGo</span>
                      </div>
                      <p style={{ fontSize: "13.5px", fontWeight: 500, color: "rgba(184,181,173,0.78)", marginTop: "7px" }}>
                        Up to 2 Screens — POS, KDS, CDS*
                      </p>
                    </div>
                  </div>
                ) : tier.name === "GoGMGo Basic" ? (
                  // ── Basic: full-stack, 3 grouped sub-cards, teal accents ────
                  <div>
                    <p style={{ fontSize: "12px", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(184,181,173,0.68)", marginBottom: "12px" }}>
                      All four modules included
                    </p>

                    {/* Front-of-house */}
                    <div style={{ padding: "11px 14px", borderRadius: "10px", backgroundColor: "rgba(244,241,234,0.025)", border: "1px solid rgba(244,241,234,0.07)", marginBottom: "6px" }}>
                      <p style={{ fontSize: "12px", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(184,181,173,0.88)", marginBottom: "8px" }}>
                        Front-of-house
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap" }}>
                        <div style={{ height: "4px", width: "4px", borderRadius: "50%", flexShrink: 0, backgroundColor: "#00b1ae", opacity: 0.65 }} />
                        <span style={{ fontSize: "14px", fontWeight: 500, color: "rgba(244,241,234,0.88)" }}>GoPosGo</span>
                      </div>
                      <p style={{ fontSize: "13.5px", fontWeight: 500, color: "rgba(184,181,173,0.78)", marginTop: "5px" }}>
                        Up to 2 Screens — POS, KDS, CDS*
                      </p>
                    </div>

                    {/* Back-office */}
                    <div style={{ padding: "11px 14px", borderRadius: "10px", backgroundColor: "rgba(244,241,234,0.025)", border: "1px solid rgba(244,241,234,0.07)", marginBottom: "6px" }}>
                      <p style={{ fontSize: "12px", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(184,181,173,0.88)", marginBottom: "8px" }}>
                        Back-office
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                        {(["GoHRGo", "GoChefGo"] as const).map((label) => (
                          <div key={label} style={{ display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap" }}>
                            <div style={{ height: "4px", width: "4px", borderRadius: "50%", flexShrink: 0, backgroundColor: "#00b1ae", opacity: 0.65 }} />
                            <span style={{ fontSize: "14px", fontWeight: 500, color: "rgba(244,241,234,0.88)" }}>{label}</span>
                            <span style={{ fontSize: "13.5px", fontWeight: 500, color: "rgba(184,181,173,0.80)" }}>— Unlimited Users</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Intelligence */}
                    <div style={{ padding: "11px 14px", borderRadius: "10px", backgroundColor: "rgba(244,241,234,0.025)", border: "1px solid rgba(244,241,234,0.07)" }}>
                      <p style={{ fontSize: "12px", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(184,181,173,0.88)", marginBottom: "8px" }}>
                        Analytics
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap" }}>
                        <div style={{ height: "4px", width: "4px", borderRadius: "50%", flexShrink: 0, backgroundColor: "#00b1ae", opacity: 0.65 }} />
                        <span style={{ fontSize: "14px", fontWeight: 500, color: "rgba(244,241,234,0.88)" }}>GoDataGo</span>
                        <span style={{ fontSize: "13.5px", fontWeight: 500, color: "rgba(184,181,173,0.80)" }}>— 1 Viewer License</span>
                      </div>
                    </div>
                  </div>

                ) : (
                  // ── Standard: same 3 groups, brass accents, unlimited screens ─
                  <div>
                    <p style={{ fontSize: "12px", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(184,181,173,0.68)", marginBottom: "12px" }}>
                      Full-service configuration
                    </p>

                    {/* Front-of-house — key differentiator: unlimited screens */}
                    <div style={{ padding: "11px 14px", borderRadius: "10px", backgroundColor: "rgba(244,241,234,0.025)", border: "1px solid rgba(244,241,234,0.07)", marginBottom: "6px" }}>
                      <p style={{ fontSize: "12px", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(184,181,173,0.88)", marginBottom: "8px" }}>
                        Front-of-house
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap" }}>
                        <div style={{ height: "4px", width: "4px", borderRadius: "50%", flexShrink: 0, backgroundColor: "#c8a96a", opacity: 0.70 }} />
                        <span style={{ fontSize: "14px", fontWeight: 500, color: "rgba(244,241,234,0.88)" }}>GoPosGo</span>
                        <span style={{
                          fontSize: "11.5px", letterSpacing: "0.05em",
                          padding: "1.5px 6px", borderRadius: "4px",
                          backgroundColor: "rgba(200,169,106,0.10)",
                          border: "1px solid rgba(200,169,106,0.22)",
                          color: "#c8a96a",
                        }}>
                          Unlimited
                        </span>
                      </div>
                      <p style={{ fontSize: "13.5px", fontWeight: 500, color: "rgba(184,181,173,0.78)", marginTop: "5px" }}>
                        Unlimited Screens* — POS, KDS, CDS
                      </p>
                    </div>

                    {/* Back-office */}
                    <div style={{ padding: "11px 14px", borderRadius: "10px", backgroundColor: "rgba(244,241,234,0.025)", border: "1px solid rgba(244,241,234,0.07)", marginBottom: "6px" }}>
                      <p style={{ fontSize: "12px", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(184,181,173,0.88)", marginBottom: "8px" }}>
                        Back-office
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                        {(["GoHRGo", "GoChefGo"] as const).map((label) => (
                          <div key={label} style={{ display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap" }}>
                            <div style={{ height: "4px", width: "4px", borderRadius: "50%", flexShrink: 0, backgroundColor: "#c8a96a", opacity: 0.70 }} />
                            <span style={{ fontSize: "14px", fontWeight: 500, color: "rgba(244,241,234,0.88)" }}>{label}</span>
                            <span style={{ fontSize: "13.5px", fontWeight: 500, color: "rgba(184,181,173,0.80)" }}>— Unlimited Users</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Intelligence */}
                    <div style={{ padding: "11px 14px", borderRadius: "10px", backgroundColor: "rgba(244,241,234,0.025)", border: "1px solid rgba(244,241,234,0.07)" }}>
                      <p style={{ fontSize: "12px", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(184,181,173,0.88)", marginBottom: "8px" }}>
                        Analytics
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap" }}>
                        <div style={{ height: "4px", width: "4px", borderRadius: "50%", flexShrink: 0, backgroundColor: "#c8a96a", opacity: 0.70 }} />
                        <span style={{ fontSize: "14px", fontWeight: 500, color: "rgba(244,241,234,0.88)" }}>GoDataGo</span>
                        <span style={{ fontSize: "13.5px", fontWeight: 500, color: "rgba(184,181,173,0.80)" }}>— 1 Viewer License</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* Add-ons */}
        <motion.div
          initial={{ opacity: 1, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="mb-2 text-sm font-semibold" style={{ color: "#f4f1ea" }}>
            Plug &amp; play these add-ons to supercharge your business.
          </p>
          <p className="mb-7 text-sm" style={{ color: "rgba(184,181,173,0.80)", fontWeight: 500 }}>
            Pricing is straightforward and charged per outlet — only pay for the add-ons you want.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-14"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {addons.map((addon) => (
            <motion.div
              key={addon.name}
              variants={fadeUp}
              className="rounded-xl p-5 transition-all duration-300"
              style={{
                backgroundColor: "rgba(14,11,7,0.55)",
                border: "1px solid rgba(244,241,234,0.07)",
                backdropFilter: "blur(8px)",
              }}
              whileHover={{
                y: -4,
                borderColor: `${addon.accent}35`,
                boxShadow: `0 8px 30px ${addon.accent}10`,
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-1 h-px w-6" style={{ backgroundColor: addon.accent, opacity: 0.7 }} />
              <p className="mb-1 mt-3 text-sm font-semibold" style={{ color: "#f4f1ea" }}>
                {addon.name}
              </p>
              <p className="mb-3 text-sm leading-relaxed" style={{ color: "rgba(184,181,173,0.82)", fontWeight: 500 }}>
                {addon.description}
              </p>

              {/* Pack breakdown — shown only for add-ons with selectable packs */}
              {addon.packs && (
                <div style={{ marginBottom: "12px" }}>
                  <p style={{
                    fontSize: "12px", letterSpacing: "0.13em", textTransform: "uppercase",
                    color: "rgba(184,181,173,0.68)", marginBottom: "7px",
                  }}>
                    3 Packs available
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    {addon.packs.map((pack) => (
                      <div key={pack} style={{ display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap" }}>
                        <div style={{
                          height: "3px", width: "3px", borderRadius: "50%", flexShrink: 0,
                          backgroundColor: addon.accent, opacity: 0.65,
                        }} />
                        <span style={{ fontSize: "13.5px", fontWeight: 500, color: "rgba(184,181,173,0.88)" }}>
                          {pack}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-lg font-bold" style={{ color: "#f4f1ea" }}>
                {addon.price}
                <span className="ml-1 text-sm font-normal" style={{ color: "rgba(184,181,173,0.78)" }}>
                  {addon.priceSub}
                </span>
              </p>
              {addon.alt && (
                <p className="mt-0.5 text-sm" style={{ color: "rgba(184,181,173,0.72)", fontWeight: 500 }}>
                  or {addon.alt}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Benefit badges */}
        <motion.div
          className="mb-10 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {benefits.map((b) => (
            <div
              key={b}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-medium"
              style={{
                backgroundColor: "rgba(0,177,174,0.07)",
                border: "1px solid rgba(0,177,174,0.18)",
                color: "rgba(0,177,174,0.85)",
              }}
            >
              <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#00b1ae" }} />
              {b}
            </div>
          ))}
        </motion.div>

        {/* Final CTA — the concierge desk */}
        <motion.div
          className="rounded-2xl px-8 py-14 text-center sm:px-16"
          style={{
            border: "1px solid rgba(0,177,174,0.2)",
            background: "linear-gradient(135deg, rgba(0,177,174,0.06) 0%, rgba(5,4,2,0.8) 60%)",
          }}
          initial={{ opacity: 1, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-2 text-2xl font-semibold" style={{ color: "#f4f1ea", letterSpacing: "-0.012em" }}>
            Transparent pricing. No surprises.
          </p>
          <p className="mb-8 text-base" style={{ color: "#b8b5ad", fontWeight: 500 }}>
            One simple model. Everything you need.
          </p>
          <button
            type="button"
            onClick={() => { AnalyticsEvents.pricingBookDemo(); openModal() }}
            className="cta-led inline-flex items-center justify-center rounded-lg px-9 py-4 text-sm font-semibold transition-all duration-300 cursor-pointer"
            style={{ backgroundColor: "#00b1ae", color: "#050505", border: "none", animationDelay: "0.9s" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#007b6f")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00b1ae")}
          >
            Book a Demo
          </button>
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion"
import { fadeUp, stagger, modalBackdrop, modalPanel } from "@/lib/motion"
import { useModal } from "@/context/ModalContext"

// Product colour identities + logo paths
const products = [
  {
    id: "goposgo",
    name: "GoPOSGo",
    logo: "/brand/goposgo-logo.svg",
    logoW: 965, logoH: 230,
    subheader: "Point of Sale System",
    tagline: "Market-leading POS system designed specifically for F&B businesses with advanced features for order management and customer engagement.",
    accent: "#4A9EFF",
    screenshot: "/assets/goposgo.png",
    screenshotLayout: "portrait" as const,
    screenshotWide: true,
    features: [
      { label: "Order Management",    icon: ["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 5a2 2 0 012-2h2a2 2 0 012 2", "M9 12h6M9 16h4"] },
      { label: "Payment Processing",  icon: ["M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"] },
      { label: "Customer Management", icon: ["M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"] },
      { label: "Real-time Analytics",  icon: ["M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"] },
    ],
  },
  {
    id: "gohrgo",
    name: "GoHRGo",
    logo: "/brand/gohrgo-logo.svg",
    logoW: 883, logoH: 230,
    subheader: "HR & People Management",
    tagline: "Complete HR solution for managing staff scheduling, payroll, performance tracking, and employee engagement.",
    accent: "#D4AF37",
    features: [
      { label: "Staff Scheduling",      icon: ["M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"] },
      { label: "Payroll Management",    icon: ["M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"] },
      { label: "Performance Tracking",  icon: ["M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"] },
      { label: "Employee Self-Service", icon: ["M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"] },
    ],
  },
  {
    id: "gochefgo",
    name: "GoChefGo",
    logo: "/brand/gochefgo-logo.svg",
    logoW: 1115, logoH: 230,
    subheader: "Kitchen Management System",
    tagline: "Streamline kitchen operations with recipe management, ingredient tracking, and production planning for optimal efficiency.",
    accent: "#70C84A",
    features: [
      { label: "Trade Orders",          icon: ["M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"] },
      { label: "Ingredients & Recipes", icon: ["M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"] },
      { label: "Inventory Workflows",   icon: ["M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"] },
      { label: "Waste Tracking",        icon: ["M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"] },
    ],
    screenshot: "/assets/gochefgo.png",
    screenshotLayout: "portrait" as const,
  },
  {
    id: "ordrr",
    name: "Ordrr",
    logo: "/brand/ordrr-logo.svg",
    logoW: 735, logoH: 230,
    subheader: "Online Ordering Platform",
    tagline: "Complete online ordering solution with customizable storefronts, mobile apps, and delivery management capabilities.",
    accent: "#8B5CF6",
    features: [
      { label: "QR Table Ordering",   icon: ["M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"] },
      { label: "Online Ordering",     icon: ["M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"] },
      { label: "Kiosk Workflows",     icon: ["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"] },
      { label: "Integrated Payments", icon: ["M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"] },
    ],
  },
  {
    id: "golinkgo",
    name: "GoLinkGo",
    logo: "/brand/golinkgo-logo.svg",
    logoW: 1015, logoH: 230,
    subheader: "Integration Platform",
    tagline: "Connect all your business systems and third-party applications with our powerful integration platform and API management.",
    accent: "#E060B0",
    features: [
      { label: "Payment Integrations",   icon: ["M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"] },
      { label: "Delivery Platforms",     icon: ["M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"] },
      { label: "Reservation Systems",    icon: ["M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"] },
      { label: "Accounting Connectors",  icon: ["M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"] },
    ],
  },
  {
    id: "godatago",
    name: "GoDataGo",
    logo: "/brand/godatago-logo.png",
    logoW: 1139, logoH: 244,
    subheader: "Analytics & Reporting",
    tagline: "Unlock the power of your data with AI-powered analytics.",
    accent: "#00B1AE",
    screenshot: "/assets/godatago.png",
    screenshotLayout: "portrait" as const,
    screenshotWide: true,
    features: [
      { label: "Live Sales Analytics",   icon: ["M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"] },
      { label: "Cost Dashboards",        icon: ["M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z", "M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"] },
      { label: "Cross-module Reporting", icon: ["M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"] },
      { label: "AI-surfaced Insights",   icon: ["M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"] },
    ],
  },
]

type Product = typeof products[number] & {
  screenshot?: string
  screenshotLayout?: "portrait"
  screenshotWide?: boolean   // true = 460px col + tighter inset for landscape images
}

// ─── Feature icon ────────────────────────────────────────────────────────────
function FeatureIcon({ paths, accent }: { paths: string[]; accent: string }) {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke={accent} strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, marginTop: "2px", opacity: 0.80 }}
    >
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  )
}

// ─── Modal ───────────────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onBookDemo }: { product: Product | null; onClose: () => void; onBookDemo: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!product) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return }
      // Focus trap
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
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    // Move focus into modal
    const t = setTimeout(() => panelRef.current?.querySelector<HTMLElement>("button")?.focus(), 50)
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; clearTimeout(t) }
  }, [product, onClose])

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            key="bd"
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "rgba(5,5,5,0.62)", backdropFilter: "blur(14px)" }}
            variants={modalBackdrop} initial="hidden" animate="visible" exit="exit"
            onClick={onClose}
          />

          {/* Card container */}
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="product-modal-title"
              className={`pointer-events-auto relative w-full overflow-hidden flex flex-col ${
                !product.screenshot
                  ? "max-w-md"
                  : product.screenshotWide
                  ? "max-w-md lg:max-w-5xl"
                  : "max-w-md lg:max-w-3xl"
              }`}
              style={{
                background: "linear-gradient(165deg, rgba(32,24,14,0.96) 0%, rgba(24,18,10,0.96) 100%)",
                borderRadius: "12px",
                border: `1px solid ${product.accent}28`,
                boxShadow: `0 0 0 0.5px ${product.accent}18, 0 32px 80px rgba(0,0,0,0.55)`,
                maxHeight: "min(calc(100svh - 2rem), 90vh)",
              }}
              variants={modalPanel} initial="hidden" animate="visible" exit="exit"
            >
              {/* ── Atmospheric layers ── */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px z-10" style={{ background: `${product.accent}60` }} />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-0"
                style={{ height: "45%", background: `radial-gradient(ellipse 70% 80% at 35% 0%, ${product.accent}0d 0%, transparent 65%)` }}
              />

              {/* ── Body: content left, screenshot right ── */}
              <div className={`flex-1 flex flex-col min-h-0 ${product.screenshot ? "lg:flex-row lg:items-stretch" : ""}`}>

                {/* Content column — scrollable on mobile so footer stays pinned */}
                <div className="relative z-10 p-8 lg:p-10 flex flex-col lg:flex-1 overflow-y-auto">
                  <div className="mb-3 flex items-center">
                    <Image
                      src={product.logo}
                      alt={product.name}
                      width={product.logoW}
                      height={product.logoH}
                      unoptimized
                      style={{ height: "34px", width: "auto", filter: `drop-shadow(0 0 6px ${product.accent}80)` }}
                    />
                  </div>
                  <p
                    id="product-modal-title"
                    className="mb-4 text-base font-bold"
                    style={{ color: product.accent, letterSpacing: "0.01em" }}
                  >
                    {product.name} — {product.subheader}
                  </p>
                  <p className="mb-5 text-base leading-relaxed" style={{ color: "rgba(244,241,234,0.74)", fontWeight: 500 }}>
                    {product.tagline}
                  </p>
                  <ul className="space-y-3">
                    {product.features.map((f) => (
                      <li key={f.label} className="flex items-start gap-3">
                        <FeatureIcon paths={f.icon} accent={product.accent} />
                        <span className="text-base leading-relaxed" style={{ color: "rgba(244,241,234,0.84)", fontWeight: 500 }}>{f.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Screenshot — side column, desktop only */}
                {product.screenshot && (
                  <div
                    className="hidden lg:block relative overflow-hidden shrink-0"
                    style={{
                      width:     product.screenshotWide ? "600px" : "420px",
                      minHeight: product.screenshotWide ? "420px" : "540px",
                    }}
                  >
                    <div
                      className="pointer-events-none absolute inset-y-0 left-0 z-10 w-px"
                      style={{ background: `${product.accent}20` }}
                    />
                    <div
                      className="absolute"
                      style={
                        product.screenshotWide
                          ? { inset: "12px 16px" }
                          : { inset: "28px 32px" }
                      }
                    >
                      <Image
                        src={product.screenshot}
                        alt={`${product.name} — product screenshot`}
                        fill
                        className="object-contain object-center"
                        sizes={product.screenshotWide ? "600px" : "420px"}
                        quality={85}
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* ── Footer: full-width, sits at the true bottom of the entire card ── */}
              <div
                className="relative z-10 flex items-center justify-between px-8 lg:px-10 py-5 shrink-0"
                style={{ borderTop: `1px solid rgba(244,241,234,0.07)` }}
              >
                <button
                  type="button"
                  onClick={() => { onClose(); onBookDemo() }}
                  className="inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-semibold cursor-pointer"
                  style={{ backgroundColor: product.accent, color: "#050505", border: "none" }}
                >
                  Book a Demo
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-base font-medium"
                  aria-label="Close product details"
                  style={{ color: "rgba(184,181,173,0.72)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f4f1ea")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(184,181,173,0.72)")}
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────
export function StepInside() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [modalProduct, setModalProduct] = useState<Product | null>(null)
  const [mounted, setMounted] = useState(false)
  const { openModal } = useModal()
  const prefersReduced = useReducedMotion()

  useEffect(() => { setMounted(true) }, [])

  const sectionRef = useRef<HTMLElement>(null)

  // Single full-lifecycle tracker: 0 = section top at viewport bottom, 0.5 = filling viewport, 1 = fully exited
  const { scrollYProgress: fullProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Subtle downward drift — only during exit phase
  const bgY = useTransform(fullProgress, [0.5, 1.0], [0, 65])

  // Exit zoom toward the left kitchen passage — mirrors Hero's acceleration curve
  const bgScale = useTransform(
    fullProgress,
    [0,   0.11, 0.50, 0.575, 0.725, 0.86, 1.00],
    [1.0, 1.0,  1.0,  1.06,  1.14,  1.28, 1.46]
  )

  // Blur: clears fast on entry (8→0 in first ~22vh), builds on exit (0→15 matching Hero pacing)
  const bgBlurNum = useTransform(
    fullProgress,
    [0,   0.11, 0.50, 0.790, 0.875, 0.950, 1.00],
    [8,   0,    0,    0,     3,     9,     15]
  )
  const bgFilter = useTransform(bgBlurNum, (v) => `blur(${v.toFixed(1)}px)`)

  return (
    <>
    <section
      ref={sectionRef}
      id="our-menu"
      className="relative overflow-hidden isolate"
      style={{ minHeight: "100vh" }}
    >
      {/* ── Background ── */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: prefersReduced ? 0 : bgY,
          scale: prefersReduced ? 1 : bgScale,
          filter: prefersReduced ? undefined : bgFilter,
          transformOrigin: "18% 58%",
          willChange: "transform, filter",
          pointerEvents: "none",
        }}
      >
        <Image
          src="/assets/step-inside-new.png"
          alt="GoGMGo Café interior"
          fill
          priority
          className="object-cover object-center"
          quality={88}
          sizes="100vw"
        />
      </motion.div>

      {/* Top entry blend */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10"
        style={{ height: "16%", background: "linear-gradient(to bottom, #0E0B07 0%, transparent 100%)" }}
      />

      {/* Left overlay for text readability */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0"
        style={{
          width: "44%",
          background: "linear-gradient(to right, rgba(5,5,5,0.66) 0%, rgba(5,5,5,0.42) 52%, transparent 100%)",
        }}
      />

      {/* Bottom blend */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{ height: "26%", background: "linear-gradient(to bottom, transparent 0%, rgba(5,5,5,0.50) 55%, rgba(5,5,5,0.90) 100%)" }}
      />

      {/* ── DESKTOP: logo LED grid over the blank wall ── */}
      {/* justify-start so logos left-align to the container edge (not centered within it).
          Left position pulls far enough that GoPOSGo/Ordrr sit in the left-centre zone. */}
      <div
        className="absolute hidden lg:flex items-center justify-start lg:left-[36%] xl:left-[40%] 2xl:left-[44%] right-[2%]"
        style={{ top: "8vh", bottom: "36vh" }}
        onMouseLeave={() => setActiveId(null)}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, auto)",
            rowGap: "40px",
            columnGap: "20px",
          }}
        >
          {products.map((product) => {
            const isActive = activeId === product.id
            const isDimmed = activeId !== null && activeId !== product.id
            return (
              <motion.div
                key={product.id}
                className="flex items-center justify-center cursor-pointer"
                initial={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: products.indexOf(product) * 0.08, duration: 0.5 }}
                onMouseEnter={() => setActiveId(product.id)}
                onMouseLeave={() => setActiveId(null)}
                onClick={() => setModalProduct(product)}
              >
                <Image
                  src={product.logo}
                  alt={product.name}
                  width={product.logoW}
                  height={product.logoH}
                  unoptimized
                  sizes="200px"
                  style={{
                    height: "clamp(44px, 5.2vh, 60px)",
                    width: "auto",
                    opacity: isActive ? 1 : isDimmed ? 0.08 : 0.40,
                    filter: isActive
                      ? `drop-shadow(0 0 10px ${product.accent}) drop-shadow(0 0 24px ${product.accent}88) brightness(1.1)`
                      : "none",
                    transition: "opacity 0.35s ease, filter 0.35s ease",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                />
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Section label — lower left */}
      <motion.div
        className="absolute hidden lg:block"
        style={{ left: "3.5%", width: "34%", bottom: "28vh" }}
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.p variants={fadeUp} className="mb-3 text-xs font-medium uppercase tracking-[0.22em]" style={{ color: "#b8b5ad" }}>
          Our Menu
        </motion.p>
        <motion.h2 variants={fadeUp} className="mb-4 text-4xl font-semibold leading-tight lg:text-5xl" style={{ color: "#f4f1ea", letterSpacing: "-0.022em" }}>
          Everything connected.
          <br /><span style={{ color: "#00b1ae" }}>Everything covered.</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="mb-4 text-base leading-relaxed" style={{ color: "#b8b5ad", fontWeight: 500, maxWidth: "300px" }}>
          Six integrated products, one operating system. Everything your restaurant needs — from POS to analytics, connected by design.
        </motion.p>
        <motion.p variants={fadeUp} className="text-sm" style={{ color: "rgba(184,181,173,0.55)", letterSpacing: "0.01em", fontWeight: 500 }}>
          Hover to illuminate · click to explore
        </motion.p>
      </motion.div>

      {/* ── MOBILE ── */}
      <div className="relative z-10 flex flex-col lg:hidden" style={{ minHeight: "100vh" }}>
        <div className="px-4 pb-8 pt-20">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-8">
            <motion.p variants={fadeUp} className="mb-3 text-xs font-medium uppercase tracking-[0.22em]" style={{ color: "#b8b5ad" }}>
              Our Menu
            </motion.p>
            <motion.h2 variants={fadeUp} className="mb-4 text-4xl font-semibold leading-tight sm:text-5xl" style={{ color: "#f4f1ea", letterSpacing: "-0.022em" }}>
              Everything connected.
              <br /><span style={{ color: "#00b1ae" }}>Everything covered.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-3 text-base leading-relaxed" style={{ color: "#b8b5ad", fontWeight: 500 }}>
              Six integrated products, one operating system. Everything your restaurant needs — from POS to analytics, connected by design.
            </motion.p>
            <motion.p variants={fadeUp} className="text-sm" style={{ color: "rgba(184,181,173,0.58)", fontWeight: 500 }}>
              Tap a product to explore.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 py-4">
            {products.map((product) => (
              <motion.button
                key={product.id}
                className="flex items-center justify-center py-4 rounded-xl"
                aria-label={`Learn more about ${product.name}`}
                onClick={() => setModalProduct(product)}
                whileTap={{ scale: 0.94, opacity: 0.9 }}
                transition={{ duration: 0.12 }}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <Image
                  src={product.logo}
                  alt={product.name}
                  width={product.logoW}
                  height={product.logoH}
                  unoptimized
                  sizes="120px"
                  style={{ height: "28px", width: "auto", maxWidth: "90%", opacity: 0.75 }}
                />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Crawlable product descriptions — invisible to sighted users ── */}
      <div className="sr-only">
        <h2>GoGMGo Restaurant Operating System — Products and Features</h2>
        <p>
          GoGMGo is a cloud-based restaurant operating system built for modern F&B operators in Singapore and Southeast Asia.
          The platform includes six integrated products covering every part of restaurant operations.
        </p>
        <article>
          <h3>GoPOSGo — Restaurant Point of Sale System</h3>
          <p>
            GoPOSGo is a cloud-based restaurant POS system for iPad, designed for cafés, bars, restaurants, and hospitality groups.
            Features include order management, table management, split billing, payment processing, real-time sales analytics,
            kitchen display system (KDS) and customer display system (CDS) support.
            Integrates with Stripe, Pine Labs, and Red Dot Payments for card and contactless payment processing.
          </p>
        </article>
        <article>
          <h3>GoHRGo — Restaurant HR and Staff Scheduling Software</h3>
          <p>
            GoHRGo provides human resources and workforce management for restaurant operations.
            Features include staff scheduling, shift management, payroll management, performance tracking,
            and employee self-service tools for restaurant and café teams.
          </p>
        </article>
        <article>
          <h3>GoChefGo — Kitchen Management System</h3>
          <p>
            GoChefGo is a kitchen management system for restaurant back-of-house operations.
            Features include recipe costing, ingredient and inventory management, trade order management,
            supplier ordering workflows, and waste tracking for restaurant kitchens.
          </p>
        </article>
        <article>
          <h3>Ordrr — Online Ordering and QR Table Ordering Platform</h3>
          <p>
            Ordrr provides multi-channel ordering for restaurants, including QR code table ordering,
            online ordering for restaurant websites, and self-service kiosk workflows.
            Supports integrated payment processing and kitchen routing.
          </p>
        </article>
        <article>
          <h3>GoLinkGo — Restaurant Integration Platform</h3>
          <p>
            GoLinkGo connects GoGMGo to third-party platforms through pre-built integrations.
            Delivery aggregator integrations include GrabFood and Foodpanda.
            Loyalty platform integrations include Eber, Como, and Ascentis.
            Reservation system integrations include SevenRooms, inline, and BistroChat.
            Accounting integrations connect restaurant financial data to accounting software.
          </p>
        </article>
        <article>
          <h3>GoDataGo — Restaurant Analytics and Reporting</h3>
          <p>
            GoDataGo provides live restaurant analytics and business intelligence for F&B operators.
            Features include live sales dashboards, cost and margin analysis,
            cross-module reporting across POS, kitchen, and HR data,
            and AI-powered insights for restaurant performance optimisation.
          </p>
        </article>
      </div>

    </section>

    {/* Portal: renders at document.body level so section overflow:hidden never clips the fixed modal */}
    {mounted && createPortal(
      <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} onBookDemo={openModal} />,
      document.body
    )}
    </>
  )
}

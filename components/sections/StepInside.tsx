"use client"

import { useState, useRef, useEffect, useSyncExternalStore } from "react"
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
    title: "Front-of-house, fully connected.",
    outcomeHeadline: "Move faster. Sell smarter. Serve better.",
    features: [
      "Fast iPad POS",
      "Table and cashier workflows",
      "Menu and promotion controls",
      "Printer and kitchen routing",
      "Integrated payments",
    ],
    benefitBadges: [
      "Faster table turnover",
      "Higher average check potential",
      "Reduced order errors",
      "Better payment flow",
    ],
    supportingCopy: "Designed to improve speed of service, reduce operational friction and support smarter upselling at the point of sale.",
    accent: "#4A9EFF",
    screenshot: "/assets/goposgo.png",
    screenshotLayout: "portrait" as const,
    screenshotWide: true,
  },
  {
    id: "gohrgo",
    name: "GoHRGo",
    logo: "/brand/gohrgo-logo.svg",
    logoW: 883, logoH: 230,
    title: "People operations without spreadsheet chaos.",
    outcomeHeadline: "Schedule smarter. Reduce labour leakage.",
    features: [
      "Staff profiles",
      "Scheduling",
      "Time clock and attendance",
      "Leave and claims",
      "Role-based workflows",
    ],
    benefitBadges: [
      "5–15% labour optimization potential",
      "Reduced admin work",
      "Better shift visibility",
      "Faster approvals",
    ],
    supportingCopy: "Designed to help operators manage labour cost, scheduling and accountability without spreadsheet chaos.",
    accent: "#D4AF37",
  },
  {
    id: "gochefgo",
    name: "GoChefGo",
    logo: "/brand/gochefgo-logo.svg",
    logoW: 1115, logoH: 230,
    title: "Procurement, inventory and kitchen control.",
    outcomeHeadline: "Reduce waste. Control margins. Automate procurement.",
    features: [
      "Trade orders",
      "Ingredients and recipes",
      "Supplier workflows",
      "Inventory and stock control",
      "Waste and variance tracking",
      "Scan-to-use procurement setup",
    ],
    benefitBadges: [
      "3–6% lower food cost potential",
      "Better supplier visibility",
      "Reduced wastage",
      "Recipe-level costing",
    ],
    supportingCopy: "Turn supplier documents, invoices and menu data into structured operating intelligence.",
    accent: "#70C84A",
    screenshot: "/assets/gochefgo.png",
    screenshotLayout: "portrait" as const,
  },
  {
    id: "ordrr",
    name: "Ordrr",
    logo: "/brand/ordrr-logo.svg",
    logoW: 735, logoH: 230,
    title: "Digital ordering that belongs to your brand.",
    outcomeHeadline: "More ordering channels. Less service friction.",
    features: [
      "QR ordering",
      "Online ordering",
      "Mobile server ordering",
      "Kiosk workflows",
      "Integrated payments",
    ],
    benefitBadges: [
      "Reduced wait-staff burden",
      "Multi-channel ordering",
      "Fewer order errors",
      "Better guest convenience",
    ],
    supportingCopy: "Give guests more ways to order while keeping operations connected behind the scenes.",
    accent: "#8B5CF6",
  },
  {
    id: "golinkgo",
    name: "GoLinkGo",
    logo: "/brand/golinkgo-logo.svg",
    logoW: 1015, logoH: 230,
    title: "Connect the systems you already use.",
    outcomeHeadline: "Less double entry. Fewer errors. More connected workflows.",
    features: [
      "Payment integrations",
      "Delivery integrations",
      "Reservations",
      "Accounting connectors",
      "Loyalty links",
    ],
    benefitBadges: [
      "Reduced manual reconciliation",
      "Labour hours saved weekly",
      "Cleaner operational data",
      "Fewer integration gaps",
    ],
    supportingCopy: "Connect the tools restaurants already rely on without turning operations into manual admin work.",
    accent: "#E060B0",
  },
  {
    id: "godatago",
    name: "GoDataGo",
    logo: "/brand/godatago-logo.png",
    logoW: 1139, logoH: 244,
    title: "Your restaurant data, finally useful.",
    outcomeHeadline: "Turn restaurant data into decisions.",
    features: [
      "Sales analytics",
      "Outlet dashboards",
      "Cost dashboards",
      "Cross-module reporting",
      "Operator-friendly insights",
    ],
    benefitBadges: [
      "Identify margin leaks",
      "Track food cost",
      "Compare outlets",
      "Surface action items",
    ],
    supportingCopy: "GoGMGo helps operators see what needs attention — not just what already happened.",
    accent: "#00B1AE",
    screenshot: "/assets/godatago.png",
    screenshotLayout: "portrait" as const,
    screenshotWide: true,
  },
]

type Product = typeof products[number] & {
  screenshot?: string
  screenshotLayout?: "portrait"
  screenshotWide?: boolean
}

// ─── Checkmark icon ──────────────────────────────────────────────────────────
function CheckIcon({ accent }: { accent: string }) {
  return (
    <svg
      width="13" height="13" viewBox="0 0 13 13" fill="none"
      style={{ flexShrink: 0, marginTop: "3px" }}
    >
      <path
        d="M2 6.5L5 9.5L11 3"
        stroke={accent} strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── Modal ───────────────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onBookDemo }: {
  product: Product | null
  onClose: () => void
  onBookDemo: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!product) return
    const onKey = (e: KeyboardEvent) => {
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
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
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
            style={{ backgroundColor: "rgba(5,5,5,0.65)", backdropFilter: "blur(16px)" }}
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
                background: "linear-gradient(165deg, rgba(32,24,14,0.97) 0%, rgba(22,16,9,0.97) 100%)",
                borderRadius: "12px",
                border: `1px solid ${product.accent}24`,
                boxShadow: `0 0 0 0.5px ${product.accent}14, 0 32px 80px rgba(0,0,0,0.60), 0 0 60px ${product.accent}08`,
                maxHeight: "min(calc(100svh - 2rem), 90vh)",
              }}
              variants={modalPanel} initial="hidden" animate="visible" exit="exit"
            >
              {/* ── Atmospheric layers ── */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px z-10"
                style={{ background: `linear-gradient(to right, transparent 10%, ${product.accent}55 40%, ${product.accent}55 60%, transparent 90%)` }}
              />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-0"
                style={{ height: "50%", background: `radial-gradient(ellipse 65% 75% at 30% 0%, ${product.accent}0b 0%, transparent 60%)` }}
              />

              {/* ── Body: content left, screenshot right ── */}
              <div className={`flex-1 flex flex-col min-h-0 ${product.screenshot ? "lg:flex-row lg:items-stretch" : ""}`}>

                {/* Content column */}
                <div className="relative z-10 p-7 lg:p-9 flex flex-col lg:flex-1 overflow-y-auto">

                  {/* Logo */}
                  <div className="mb-4 flex items-center">
                    <Image
                      src={product.logo}
                      alt={product.name}
                      width={product.logoW}
                      height={product.logoH}
                      unoptimized
                      style={{
                        height: "30px", width: "auto",
                        filter: `drop-shadow(0 0 8px ${product.accent}70)`,
                      }}
                    />
                  </div>

                  {/* Title label */}
                  <p
                    className="mb-3"
                    style={{
                      color: `${product.accent}bb`,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.09em",
                      textTransform: "uppercase",
                    }}
                  >
                    {product.title}
                  </p>

                  {/* Outcome headline */}
                  <h3
                    id="product-modal-title"
                    className="mb-5"
                    style={{
                      color: "#f4f1ea",
                      fontSize: "clamp(1.15rem, 1.8vw, 1.4rem)",
                      fontWeight: 600,
                      lineHeight: 1.27,
                      letterSpacing: "-0.018em",
                    }}
                  >
                    {product.outcomeHeadline}
                  </h3>

                  {/* Feature bullets */}
                  <ul className="space-y-2 mb-5">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckIcon accent={product.accent} />
                        <span style={{ color: "rgba(244,241,234,0.76)", fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.55 }}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Divider */}
                  <div className="mb-4" style={{ height: "0.5px", background: "rgba(244,241,234,0.07)" }} />

                  {/* Benefit badges */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {product.benefitBadges.map((badge) => (
                      <span
                        key={badge}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          border: `1px solid ${product.accent}20`,
                          background: `${product.accent}0a`,
                          color: "rgba(244,241,234,0.62)",
                          fontSize: "0.71rem",
                          fontWeight: 500,
                          letterSpacing: "0.015em",
                        }}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Supporting copy */}
                  <p style={{ color: "rgba(184,181,173,0.55)", fontSize: "0.82rem", lineHeight: 1.65, fontWeight: 500 }}>
                    {product.supportingCopy}
                  </p>

                </div>

                {/* Screenshot — side column, desktop only */}
                {product.screenshot && (
                  <div
                    className="hidden lg:block relative overflow-hidden shrink-0"
                    style={{
                      width:     product.screenshotWide ? "580px" : "400px",
                      minHeight: product.screenshotWide ? "400px" : "520px",
                    }}
                  >
                    <div
                      className="pointer-events-none absolute inset-y-0 left-0 z-10 w-px"
                      style={{ background: `${product.accent}18` }}
                    />
                    <div
                      className="absolute"
                      style={product.screenshotWide ? { inset: "12px 16px" } : { inset: "28px 32px" }}
                    >
                      <Image
                        src={product.screenshot}
                        alt={`${product.name} — product screenshot`}
                        fill
                        className="object-contain object-center"
                        sizes={product.screenshotWide ? "580px" : "400px"}
                        quality={85}
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* ── Footer ── */}
              <div
                className="relative z-10 flex items-center justify-between px-7 lg:px-9 py-4 shrink-0"
                style={{ borderTop: "1px solid rgba(244,241,234,0.07)" }}
              >
                <button
                  type="button"
                  onClick={() => { onClose(); onBookDemo() }}
                  className="inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-semibold cursor-pointer transition-opacity duration-200 hover:opacity-85"
                  style={{ backgroundColor: product.accent, color: "#050505", border: "none" }}
                >
                  Book a Demo
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-sm font-medium transition-colors duration-200"
                  aria-label="Close product details"
                  style={{ color: "rgba(184,181,173,0.65)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f4f1ea")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(184,181,173,0.65)")}
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
  const { openModal } = useModal()
  const prefersReduced = useReducedMotion()

  // useSyncExternalStore is the React 18+ way to detect client-side mounting for portals
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)

  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress: fullProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const bgY = useTransform(fullProgress, [0.5, 1.0], [0, 65])

  const bgScale = useTransform(
    fullProgress,
    [0,   0.11, 0.50, 0.575, 0.725, 0.86, 1.00],
    [1.0, 1.0,  1.0,  1.06,  1.14,  1.28, 1.46]
  )

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

      {/* ── Crawlable product descriptions ── */}
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

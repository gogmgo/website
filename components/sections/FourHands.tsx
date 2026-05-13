"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { fadeUp, stagger } from "@/lib/motion"

// ─────────────────────────────────────────────────────────────────────────────
// 4-HANDS — Integration ecosystem section
//
// GoGMGo sits at the centre of a radial architectural diagram.
// Four partner clusters (Delivery, Loyalty, Reservations, Payments) orbit it.
// Animated strokeDashoffset cycles create slow data-signal pulses along each
// connection path — the system always feels alive, never flashy.
// ─────────────────────────────────────────────────────────────────────────────

const VW = 960
const VH = 520
const CX = 480  // diagram centre
const CY = 260
const CR = 50   // center circle radius

// ─── Partner data ─────────────────────────────────────────────────────────────

interface Partner {
  name: string
  x: number
  y: number
  l1: string | null    // text line 1 (null = use logo only)
  l2: string | null    // text line 2
  logo: string | null  // path under /public/
  logoDx?: number      // horizontal nudge for logos whose mark isn't centred in the PNG canvas
  logoDy?: number      // vertical nudge
}

interface Category {
  id: string
  label: string
  color: string
  anchorX: number
  anchorY: number
  labelX: number
  labelY: number
  labelAnchor: "start" | "middle" | "end"
  pathD: string     // main animated connection path
  delay: number     // signal animation phase offset
  partners: Partner[]
}

// Main connection paths: cubic Bézier from center-circle edge toward each anchor.
// Center edges computed for CR=50:
//   Delivery  direction NW: edge ≈ (431, 242)
//   Loyalty   direction NE: edge ≈ (529, 242)
//   Reserv.   direction SE: edge ≈ (529, 278)
//   Payments  direction SW: edge ≈ (431, 278)

const CATEGORIES: Category[] = [
  {
    id: "delivery",
    label: "Delivery",
    color: "#C8A96A",
    anchorX: 165, anchorY: 148,
    labelX: 254, labelY: 179,
    labelAnchor: "middle",
    pathD: "M 431,242 C 365,236 268,192 165,148",
    delay: 0,
    partners: [
      { name: "GrabFood",  x: 72,  y: 108, l1: null,    l2: null,   logo: "/integrations/grab.svg"      },
      { name: "foodpanda", x: 185, y: 72,  l1: null,    l2: null,   logo: "/integrations/foodpanda.svg" },
      { name: "Lalamove",  x: 84,  y: 198, l1: null, l2: null, logo: "/integrations/lalamove.png"  },
    ],
  },
  {
    id: "loyalty",
    label: "Loyalty",
    color: "#00B1AE",
    anchorX: 795, anchorY: 148,
    labelX: 706, labelY: 179,
    labelAnchor: "middle",
    pathD: "M 529,242 C 595,236 692,192 795,148",
    delay: 0.75,
    partners: [
      { name: "Eber",     x: 718, y: 82,  l1: null,   l2: null, logo: "/integrations/eber.png"      },
      { name: "Como",     x: 832, y: 60,  l1: null,  l2: null, logo: "/integrations/como.png"     },
      { name: "Ascentis", x: 892, y: 145, l1: null,  l2: null, logo: "/integrations/ascentis.png" },
    ],
  },
  {
    id: "reservations",
    label: "Reservations",
    color: "#B7D66D",
    anchorX: 795, anchorY: 372,
    labelX: 706, labelY: 341,
    labelAnchor: "middle",
    pathD: "M 529,278 C 595,284 692,328 795,372",
    delay: 1.5,
    partners: [
      { name: "SevenRooms", x: 892, y: 308, l1: null,     l2: null,   logo: "/integrations/sevenrooms.png" },
      { name: "inline",     x: 872, y: 400, l1: null, l2: null, logo: "/integrations/inline.png"     },
      { name: "BistroChat", x: 748, y: 455, l1: null, l2: null, logo: "/integrations/bistrochat.png" },
    ],
  },
  {
    id: "payments",
    label: "Payments",
    color: "#D4AF37",
    anchorX: 165, anchorY: 372,
    labelX: 254, labelY: 341,
    labelAnchor: "middle",
    pathD: "M 431,278 C 365,284 268,328 165,372",
    delay: 2.25,
    partners: [
      { name: "Stripe",            x: 92,  y: 308, l1: null,  l2: null,   logo: "/integrations/stripe.svg" },
      { name: "Red Dot Payments",  x: 78,  y: 400, l1: null, l2: null, logo: "/integrations/reddot.png"    },
      { name: "Pine Labs",         x: 210, y: 455, l1: null,  l2: null,  logo: "/integrations/pinelabs.png", logoDx: -6, logoDy: 6 },
    ],
  },
]

// ─── Label helpers ────────────────────────────────────────────────────────────

type LabelPos = "right" | "left" | "above" | "below"

function getLabelPos(x: number, y: number): LabelPos {
  if (x < 150) return "right"
  if (x > VW - 150) return "left"
  if (y > VH - 100) return "above"
  return "below"
}

interface HoveredPartner {
  name: string
  x: number
  y: number
  color: string
}

// Name badge that appears above all other SVG elements when a partner is hovered.
// Styled to match the circle language: dark fill, colored hairline stroke, glow.
function PartnerLabel({ name, x, y, color }: HoveredPartner) {
  const pos = getLabelPos(x, y)
  const pillW = name.length * 7.6 + 28
  const pillH = 26
  const r = pillH / 2
  const gap = 52  // distance from circle centre to near edge of pill

  let pillX: number, pillY: number, textX: number, textY: number
  let lineX1: number, lineY1: number, lineX2: number, lineY2: number

  switch (pos) {
    case "right":
      pillX = x + gap; pillY = y - r
      textX = pillX + pillW / 2; textY = y
      lineX1 = x + 37; lineY1 = y; lineX2 = pillX; lineY2 = y
      break
    case "left":
      pillX = x - gap - pillW; pillY = y - r
      textX = pillX + pillW / 2; textY = y
      lineX1 = x - 37; lineY1 = y; lineX2 = pillX + pillW; lineY2 = y
      break
    case "above":
      pillX = x - pillW / 2; pillY = y - gap - pillH
      textX = x; textY = pillY + r
      lineX1 = x; lineY1 = y - 37; lineX2 = x; lineY2 = pillY + pillH
      break
    case "below":
    default:
      pillX = x - pillW / 2; pillY = y + gap
      textX = x; textY = pillY + r
      lineX1 = x; lineY1 = y + 37; lineX2 = x; lineY2 = pillY
  }

  const slideX = pos === "right" ? -8 : pos === "left" ? 8 : 0
  const slideY = pos === "above" ? 8 : pos === "below" ? -8 : 0

  return (
    <motion.g
      initial={{ opacity: 0, x: slideX, y: slideY }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: slideX, y: slideY }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {/* Connector thread from circle edge to pill */}
      <line
        x1={lineX1} y1={lineY1} x2={lineX2} y2={lineY2}
        stroke={color} strokeWidth="0.55" strokeOpacity="0.45"
        strokeDasharray="2 4"
      />

      {/* Outer halo — echoes the active partner ring */}
      <rect
        x={pillX - 2} y={pillY - 2}
        width={pillW + 4} height={pillH + 4}
        rx={r + 2}
        fill="none"
        stroke={color} strokeWidth="0.4" strokeOpacity="0.22"
        filter="url(#fh-glow-node)"
      />

      {/* Pill body */}
      <rect
        x={pillX} y={pillY}
        width={pillW} height={pillH}
        rx={r}
        fill="rgba(5,4,2,0.95)"
        stroke={color} strokeWidth="0.65" strokeOpacity="0.68"
        filter="url(#fh-glow-node)"
      />
      {/* Subtle colour tint inside pill — ties it to its category */}
      <rect
        x={pillX} y={pillY}
        width={pillW} height={pillH}
        rx={r}
        fill={color} fillOpacity="0.05"
      />

      {/* Label text */}
      <text
        x={textX} y={textY}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize="9.5"
        fontWeight="500"
        fontFamily="var(--font-geist-sans, Arial)"
        letterSpacing="2"
        opacity="0.92"
      >
        {name.toUpperCase()}
      </text>
    </motion.g>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// Main animated connection path — strokeDashoffset cycling creates traveling dots.
// Dash pattern period = 5 + 20 = 25; animating dashOffset by -25 per cycle keeps
// the signal flowing smoothly without a visible jump on repeat.
function ConnectionPath({
  pathD, color, delay, isActive, anyActive,
}: {
  pathD: string; color: string; delay: number; isActive: boolean; anyActive: boolean
}) {
  return (
    <motion.path
      d={pathD}
      fill="none"
      stroke={color}
      strokeDasharray="5 20"
      filter="url(#fh-glow-line)"
      animate={{
        strokeDashoffset: [0, -25],
        strokeWidth:  isActive ? 1.4 : 0.9,
        strokeOpacity: anyActive ? (isActive ? 0.75 : 0.12) : 0.42,
      }}
      transition={{
        strokeDashoffset: { duration: 3.5, repeat: Infinity, ease: "linear", delay },
        strokeWidth:  { duration: 0.35 },
        strokeOpacity: { duration: 0.35 },
      }}
    />
  )
}

// Individual partner node — dot + logo or two-line text label.
function PartnerNode({
  partner, color, isActive, anyActive, onEnter, onLeave,
}: {
  partner: Partner; color: string; isActive: boolean; anyActive: boolean
  onEnter: (p: HoveredPartner) => void; onLeave: () => void
}) {
  const targetOpacity = anyActive ? (isActive ? 1 : 0.16) : 0.58

  return (
    <motion.g
      animate={{ opacity: targetOpacity }}
      transition={{ duration: 0.32 }}
      onMouseEnter={() => onEnter({ name: partner.name, x: partner.x, y: partner.y, color })}
      onMouseLeave={onLeave}
      onClick={() => onEnter({ name: partner.name, x: partner.x, y: partner.y, color })}
      style={{ cursor: "pointer" }}
    >
      {/* Outer ring — only visible when active */}
      {isActive && (
        <circle
          cx={partner.x} cy={partner.y} r={47}
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          strokeOpacity="0.35"
          filter="url(#fh-glow-node)"
        />
      )}

      {/* Node circle */}
      <circle
        cx={partner.x} cy={partner.y} r={36}
        fill="rgba(12,9,6,0.90)"
        stroke={color}
        strokeWidth="0.55"
        strokeOpacity={isActive ? 0.60 : 0.25}
        filter="url(#fh-glow-node)"
      />

      {/* Logo or text — +30% larger (47×47), perfectly centred in the node circle */}
      {partner.logo ? (
        <image
          href={partner.logo}
          x={partner.x - 23 + (partner.logoDx ?? 0)}
          y={partner.y - 23 + (partner.logoDy ?? 0)}
          width={46}
          height={46}
          preserveAspectRatio="xMidYMid meet"
          style={{ filter: "brightness(0) invert(1)", opacity: 0.80 }}
        />
      ) : (
        <text
          textAnchor="middle"
          fill="#d4d0c8"
          fontFamily="var(--font-geist-sans, Arial)"
          fontWeight="500"
          fontSize="19"
        >
          <tspan x={partner.x} y={partner.y + (partner.l2 ? -6 : 7)}>
            {partner.l1}
          </tspan>
          {partner.l2 && (
            <tspan x={partner.x} y={partner.y + 16}>
              {partner.l2}
            </tspan>
          )}
        </text>
      )}
    </motion.g>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function FourHands() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [hoveredPartner, setHoveredPartner] = useState<HoveredPartner | null>(null)
  const anyActive = activeId !== null
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = useReducedMotion()

  // Single full-lifecycle tracker — 0=section entering, 0.50=filling viewport, 1=fully exited
  // Total range: 100vh section + 100vh viewport = 200vh
  const { scrollYProgress: fullProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Y drift — only during exit phase
  const imageY = useTransform(fullProgress, [0.50, 1.0], [0, 80])

  // Exit zoom toward front counter (right of screen) — mirrors Hero's acceleration curve
  // Keyframes mapped from Hero's ["start start","end start"] onto exit phase [0.50, 1.0]
  const imageScale = useTransform(
    fullProgress,
    [0,   0.11, 0.50, 0.575, 0.725, 0.86, 1.00],
    [1.0, 1.0,  1.0,  1.06,  1.14,  1.28, 1.46]
  )

  // Blur: clears fast on entry, builds on exit matching Hero pacing
  const imageBlurNum = useTransform(
    fullProgress,
    [0,   0.11, 0.50, 0.79, 0.875, 0.95, 1.00],
    [8,   0,    0,    0,    3,     9,    15]
  )
  const imageFilter = useTransform(imageBlurNum, (v) => `blur(${v.toFixed(1)}px)`)

  return (
    <section
      ref={sectionRef}
      id="four-hands"
      className="relative overflow-hidden isolate"
      style={{ backgroundColor: "#050402", minHeight: "85vh" }}
    >
      {/* ── Background image with parallax ──────────────────────────────────── */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: prefersReduced ? 0 : imageY,
          scale: prefersReduced ? 1 : imageScale,
          filter: prefersReduced ? undefined : imageFilter,
          transformOrigin: "78% 52%",
          willChange: "transform, filter",
          pointerEvents: "none",
        }}
      >
        <Image
          src="/assets/4-hands.png"
          alt="GoGMGo 4-HANDS integration ecosystem"
          fill
          className="object-cover object-center"
          quality={88}
          sizes="100vw"
        />
      </motion.div>

      {/* ── Atmospheric layers ───────────────────────────────────────────────── */}
      {/* Dark readability overlay — keeps SVG diagram legible over the image */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,4,2,0.64) 0%, rgba(5,4,2,0.58) 45%, rgba(5,4,2,0.70) 100%)",
        }}
      />
      {/* Ambient teal radial from the connected core */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 55% at 50% 52%, rgba(0,177,174,0.048) 0%, transparent 65%)",
        }}
      />
      {/* Very faint architectural grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(200,169,106,0.010) 80px)",
        }}
      />
      {/* Top blend */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{ height: "16%", background: "linear-gradient(to bottom, #0a0806 0%, transparent 100%)" }}
      />
      {/* Bottom blend */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{ height: "16%", background: "linear-gradient(to top, #050402 0%, transparent 100%)" }}
      />

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 py-20 lg:px-14 lg:py-24">

        {/* Section header */}
        <motion.div
          className="mb-14 max-w-2xl"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 text-xs font-medium uppercase tracking-[0.22em]"
            style={{ color: "#b8b5ad" }}
          >
            4-HANDS
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-4xl font-semibold leading-tight sm:text-5xl"
            style={{ color: "#f4f1ea", letterSpacing: "-0.022em" }}
          >
            Every great service runs on coordination.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-base leading-relaxed"
            style={{ color: "#b8b5ad", fontWeight: 500 }}
          >
            GoGMGo connects the delivery, loyalty, reservation, and payment partners
            powering modern hospitality — so every part of your operation moves
            together seamlessly.
          </motion.p>
        </motion.div>

        {/* ── Desktop SVG diagram ───────────────────────────────────────────── */}
        <motion.div
          className="hidden md:block w-full"
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
        >
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            className="w-full max-w-[960px] mx-auto"
            aria-hidden="true"
            style={{ overflow: "visible" }}
          >
            <defs>
              <filter id="fh-glow-node" x="-120%" y="-120%" width="340%" height="340%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="fh-glow-line" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ── Secondary lines: anchor → each partner (static, structural) ── */}
            {CATEGORIES.map((cat) =>
              cat.partners.map((p) => (
                <line
                  key={`sec-${cat.id}-${p.name}`}
                  x1={cat.anchorX} y1={cat.anchorY}
                  x2={p.x} y2={p.y}
                  stroke={cat.color}
                  strokeWidth="0.45"
                  strokeDasharray="2 9"
                  strokeOpacity={anyActive ? (activeId === cat.id ? 0.28 : 0.05) : 0.16}
                />
              ))
            )}

            {/* ── Main animated connection paths ──────────────────────────── */}
            {CATEGORIES.map((cat) => (
              <ConnectionPath
                key={`path-${cat.id}`}
                pathD={cat.pathD}
                color={cat.color}
                delay={cat.delay}
                isActive={activeId === cat.id}
                anyActive={anyActive}
              />
            ))}

            {/* ── Partner nodes ────────────────────────────────────────────── */}
            {CATEGORIES.map((cat) =>
              cat.partners.map((p) => (
                <PartnerNode
                  key={`partner-${p.name}`}
                  partner={p}
                  color={cat.color}
                  isActive={activeId === cat.id}
                  anyActive={anyActive}
                  onEnter={(info) => { setActiveId(cat.id); setHoveredPartner(info) }}
                  onLeave={() => { setActiveId(null); setHoveredPartner(null) }}
                />
              ))
            )}

            {/* ── Category anchor nodes ────────────────────────────────────── */}
            {CATEGORIES.map((cat) => (
              <motion.circle
                key={`anchor-${cat.id}`}
                cx={cat.anchorX} cy={cat.anchorY} r={5}
                fill={cat.color}
                filter="url(#fh-glow-node)"
                animate={{ opacity: anyActive ? (activeId === cat.id ? 0.90 : 0.14) : 0.52 }}
                transition={{ duration: 0.32 }}
              />
            ))}

            {/* ── Category labels ──────────────────────────────────────────── */}
            {CATEGORIES.map((cat) => (
              <motion.text
                key={`label-${cat.id}`}
                x={cat.labelX}
                y={cat.labelY}
                textAnchor={cat.labelAnchor}
                fill={cat.color}
                fontSize="11"
                fontWeight="500"
                fontFamily="var(--font-geist-sans, Arial)"
                letterSpacing="2.5"
                animate={{ opacity: anyActive ? (activeId === cat.id ? 0.88 : 0.14) : 0.50 }}
                transition={{ duration: 0.32 }}
              >
                {cat.label.toUpperCase()}
              </motion.text>
            ))}

            {/* ── GoGMGo centre hub ────────────────────────────────────────── */}
            {/* Ambient breathing ring */}
            <motion.circle
              cx={CX} cy={CY} r={60}
              fill="none"
              stroke="#00b1ae"
              strokeWidth="0.5"
              strokeDasharray="3 9"
              animate={{
                r: [58, 65, 58],
                strokeOpacity: [0.14, 0.05, 0.14],
              }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Core circle */}
            <circle
              cx={CX} cy={CY} r={CR}
              fill="#091210"
              stroke="#00b1ae"
              strokeWidth="0.9"
              strokeOpacity="0.55"
              filter="url(#fh-glow-node)"
            />
            {/* GoGMGo icon */}
            <clipPath id="fh-center-clip">
              <circle cx={CX} cy={CY} r={42} />
            </clipPath>
            <image
              href="/brand/gogmgo-icon-only.png"
              x={CX - 28}
              y={CY - 28}
              width={56}
              height={56}
              preserveAspectRatio="xMidYMid meet"
              clipPath="url(#fh-center-clip)"
              style={{ filter: "drop-shadow(0 0 8px rgba(0,177,174,0.78))" }}
            />
            {/* ── Partner name label — last child, always on top ────────── */}
            <AnimatePresence>
              {hoveredPartner && (
                <PartnerLabel key={hoveredPartner.name} {...hoveredPartner} />
              )}
            </AnimatePresence>

          </svg>
        </motion.div>

        {/* ── Mobile: category grid (no SVG) ───────────────────────────────── */}
        <motion.div
          className="md:hidden grid grid-cols-2 gap-8"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.id} variants={fadeUp}>
              <p
                className="mb-3 text-xs font-medium uppercase tracking-[0.18em]"
                style={{ color: cat.color, opacity: 0.78 }}
              >
                {cat.label}
              </p>
              <ul className="space-y-2">
                {cat.partners.map((p) => (
                  <li key={p.name} className="flex items-center gap-2.5">
                    <div
                      style={{
                        height: "3px", width: "3px", borderRadius: "50%",
                        backgroundColor: cat.color, flexShrink: 0, opacity: 0.58,
                      }}
                    />
                    <span className="text-sm" style={{ color: "rgba(184,181,173,0.68)", fontWeight: 500 }}>
                      {p.name}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Crawlable integration partner list — invisible to sighted users ── */}
        <div className="sr-only">
          <h3>GoGMGo Integration Partners</h3>
          <p>
            GoGMGo connects with the delivery, loyalty, reservation, and payment platforms powering
            modern restaurant and café operations in Singapore and Southeast Asia.
          </p>
          <section>
            <h4>Delivery Platform Integrations</h4>
            <p>
              GoGMGo integrates with GrabFood and Foodpanda for food delivery aggregation,
              and Lalamove for last-mile delivery logistics.
              Orders from these platforms flow directly into the GoGMGo POS and kitchen display system.
            </p>
          </section>
          <section>
            <h4>Loyalty and CRM Integrations</h4>
            <p>
              Loyalty platform integrations include Eber, Como, and Ascentis,
              enabling restaurants to connect their POS with customer loyalty programs,
              points management, and CRM workflows.
            </p>
          </section>
          <section>
            <h4>Reservation System Integrations</h4>
            <p>
              Restaurant reservation system integrations include SevenRooms, inline, and BistroChat,
              allowing guest reservation data to sync with POS and table management.
            </p>
          </section>
          <section>
            <h4>Payment Processing Integrations</h4>
            <p>
              Payment integrations include Stripe, Red Dot Payments, and Pine Labs,
              supporting credit card, debit card, and contactless payment processing
              for restaurants and cafés in Singapore.
            </p>
          </section>
        </div>

      </div>
    </section>
  )
}

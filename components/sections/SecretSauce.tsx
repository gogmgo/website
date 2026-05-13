"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion"
import { fadeUp, stagger } from "@/lib/motion"
import { useModal } from "@/context/ModalContext"

const CX = 300
const CY = 165
const CR = 44  // center circle radius
const SR = 24  // station node radius

// For each station, compute the two visible endpoints of its connection line.
// x1/y1 = station circle edge (path start — animation origin)
// x2/y2 = center circle edge  (path end   — animation destination)
// len    = exact pixel length of the visible segment
// Drawing FROM station TO center means the dash animation grows from the
// station's glowing dot toward the core, making all 6 connections unmistakable.
function computeLine(sx: number, sy: number) {
  const dx = sx - CX, dy = sy - CY
  const dist = Math.hypot(dx, dy)
  const ux = dx / dist, uy = dy / dist
  return {
    x1: sx - SR * ux,          // station edge
    y1: sy - SR * uy,
    x2: CX + CR * ux,          // center edge
    y2: CY + CR * uy,
    len: dist - CR - SR,        // visible segment length (no part inside a filled circle)
  }
}

const STATIONS = [
  { line1: "POS",      line2: "Counter",  x: 300, y:  52, ...computeLine(300,  52) },
  { line1: "Kitchen",  line2: "Pass",     x: 472, y: 118, ...computeLine(472, 118) },
  { line1: "Analytics",line2: null,       x: 472, y: 212, ...computeLine(472, 212) },
  { line1: "Customer", line2: "Ordering", x: 300, y: 278, ...computeLine(300, 278) },
  { line1: "Staff",    line2: "Schedule", x: 128, y: 212, ...computeLine(128, 212) },
  { line1: "Stock",    line2: "Room",     x: 128, y: 118, ...computeLine(128, 118) },
]

const capabilities = [
  {
    number: "01",
    title: "One Order, Many Workflows",
    body: "When an order is placed, it should not just become a receipt. It should update production, stock, reporting and customer workflows automatically.",
  },
  {
    number: "02",
    title: "Built for Real Restaurant Messiness",
    body: "Restaurants are not clean spreadsheets. GoGMGo is built around real operating edge cases — modifiers, bundles, voids, printers, shifts, recipes, suppliers and outlet rules.",
  },
  {
    number: "03",
    title: "Setup Gets Smarter Over Time",
    body: "Menus, invoices, suppliers and recipes become structured operating data. The system becomes more useful the more of your restaurant it understands.",
  },
  {
    number: "04",
    title: "From Transaction System to Decision System",
    body: "GoGMGo is not just there to record what happened. It helps operators see what is working, what is leaking margin, and what needs attention.",
  },
]

// ── SystemsOverlay — rebuilt from scratch ────────────────────────────────────
// Uses explicit stroke-dasharray / stroke-dashoffset (not Framer Motion pathLength)
// so the animation is 100% reliable for all 6 connections including the vertical
// top (POS Counter) and bottom (Customer Ordering) lines.
//
// Technique: strokeDasharray = exact segment length, strokeDashoffset animates
// from len (invisible) → 0 (fully drawn). Each line is pre-clipped so both
// endpoints sit outside their respective filled circles — no part of any line
// is ever hidden behind a circle fill.
//
// Animation grows from the station's glowing dot INWARD toward the center logo.
// All hooks are called at the top level (no loops) — hooks-rules compliant.
// ─────────────────────────────────────────────────────────────────────────────
function SystemsOverlay({ progress }: { progress: MotionValue<number> }) {
  // Per-line progress values: staggered 0.02 apart, each taking 0.07 to complete.
  // All 6 lines are fully drawn by progress = 0.15 — well before the diagram
  // scrolls past the centre of the viewport.
  const lp0 = useTransform(progress, [0.00, 0.07], [0, 1])  // POS Counter
  const lp1 = useTransform(progress, [0.02, 0.09], [0, 1])  // Kitchen Pass
  const lp2 = useTransform(progress, [0.04, 0.11], [0, 1])  // Analytics
  const lp3 = useTransform(progress, [0.06, 0.13], [0, 1])  // Customer Ordering
  const lp4 = useTransform(progress, [0.08, 0.15], [0, 1])  // Staff Schedule
  const lp5 = useTransform(progress, [0.10, 0.17], [0, 1])  // Stock Room

  // strokeDashoffset for each line: len*(1-v) → len when hidden, 0 when fully drawn.
  // The standard SVG line-drawing trick: dasharray=len, dashoffset len→0.
  const off0 = useTransform(lp0, (v: number) => STATIONS[0].len * (1 - v))
  const off1 = useTransform(lp1, (v: number) => STATIONS[1].len * (1 - v))
  const off2 = useTransform(lp2, (v: number) => STATIONS[2].len * (1 - v))
  const off3 = useTransform(lp3, (v: number) => STATIONS[3].len * (1 - v))
  const off4 = useTransform(lp4, (v: number) => STATIONS[4].len * (1 - v))
  const off5 = useTransform(lp5, (v: number) => STATIONS[5].len * (1 - v))

  const offsets = [off0, off1, off2, off3, off4, off5]

  // Shared fade-in: nodes + lines materialise together
  const nodeFade   = useTransform(progress, [0.00, 0.03], [0, 1])
  const centerFade = useTransform(progress, [0.00, 0.02], [0, 1])

  return (
    <svg
      viewBox="-20 -15 640 365"
      className="w-full max-w-[920px] md:max-w-[700px] lg:max-w-[920px] mx-auto"
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id="ss-glow-line" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="ss-glow-node" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── 6 connection lines ──────────────────────────────────────────────── */}
      {/* Default direction: M station_edge L center_edge → dashoffset reveals
          from center outward. POS Counter (i=0) and Customer Ordering (i=3)
          are reversed — M center_edge L station_edge — so their dashoffset
          reveals FROM those circles INWARD toward the GoGMGo logo. */}
      {STATIONS.map((st, i) => {
        const inward = i === 0 || i === 3
        const pathD = inward
          ? `M ${st.x2.toFixed(2)},${st.y2.toFixed(2)} L ${st.x1.toFixed(2)},${st.y1.toFixed(2)}`
          : `M ${st.x1.toFixed(2)},${st.y1.toFixed(2)} L ${st.x2.toFixed(2)},${st.y2.toFixed(2)}`
        return (
        <motion.path
          key={`line-${i}`}
          d={pathD}
          stroke="#00b1ae"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#ss-glow-line)"
          strokeDasharray={st.len}
          style={{ strokeDashoffset: offsets[i], opacity: nodeFade }}
        />
        )
      })}

      {/* ── Station nodes ───────────────────────────────────────────────────── */}
      {STATIONS.map((st, i) => (
        <motion.g key={`node-${i}`} style={{ opacity: nodeFade }}>
          <circle cx={st.x} cy={st.y} r={24} fill="#0e1714" stroke="#00b1ae" strokeWidth="0.7" strokeOpacity="0.35" />
          <circle cx={st.x} cy={st.y} r={5} fill="#00b1ae" opacity="0.75" filter="url(#ss-glow-node)" />
          <text
            className="ss-station-label"
            textAnchor="middle"
            fill="#d4d0c8"
            fontSize="10.5"
            fontFamily="var(--font-geist-sans, Arial)"
            letterSpacing="0.02em"
            fontWeight="500"
          >
            <tspan x={st.x} y={st.y + 42}>{st.line1}</tspan>
            {st.line2 && <tspan x={st.x} y={st.y + 54}>{st.line2}</tspan>}
          </text>
        </motion.g>
      ))}

      {/* ── Center GoGMGo node ──────────────────────────────────────────────── */}
      <motion.g style={{ opacity: centerFade }}>
        <circle cx={CX} cy={CY} r={57} fill="none" stroke="#00b1ae" strokeWidth="0.4" strokeOpacity="0.12" strokeDasharray="3 6" />
        <circle cx={CX} cy={CY} r={44} fill="#091210" stroke="#00b1ae" strokeWidth="1" strokeOpacity="0.6" filter="url(#ss-glow-node)" />
        <clipPath id="ss-center-clip">
          <circle cx={CX} cy={CY} r={42} />
        </clipPath>
        <image
          href="/brand/gogmgo-icon-only.png"
          x={CX - 30}
          y={CY - 30}
          width={60}
          height={60}
          preserveAspectRatio="xMidYMid meet"
          clipPath="url(#ss-center-clip)"
          style={{ filter: "drop-shadow(0 0 8px rgba(0,177,174,0.7))" }}
        />
      </motion.g>
    </svg>
  )
}

export function SecretSauce() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = useReducedMotion()

  // Single full-lifecycle tracker — 0=section entering, 0.435=filling viewport, 1=fully exited
  // Total range: 130vh section + 100vh viewport = 230vh
  const { scrollYProgress: fullProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Y drift — starts when section fills viewport, same pixel displacement as before
  const imageY = useTransform(fullProgress, [0.44, 1.0], [0, 130])

  // Exit zoom toward front of house (center-right) — mirrors Hero's acceleration curve
  // Keyframes mapped from Hero's ["start start","end start"] onto exit phase [0.435, 1.0]
  const imageScale = useTransform(
    fullProgress,
    [0,   0.10, 0.44, 0.52, 0.69, 0.84, 1.00],
    [1.0, 1.0,  1.0,  1.06, 1.14, 1.28, 1.46]
  )

  // Blur: clears fast on entry (8→0 in first ~22vh), builds on exit matching Hero pacing
  const imageBlurNum = useTransform(
    fullProgress,
    [0,   0.10, 0.44, 0.76, 0.86, 0.94, 1.00],
    [8,   0,    0,    0,    3,    9,    15]
  )
  const imageFilter = useTransform(imageBlurNum, (v) => `blur(${v.toFixed(1)}px)`)

  // Diagram progress: 0 when section first fills viewport, 1 = section fully scrolled out.
  // SystemsOverlay handles all stagger internally — all 6 lines complete by 17% section scroll.
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const { openModal } = useModal()

  return (
    <section
      ref={sectionRef}
      id="secret-sauce"
      className="relative overflow-hidden isolate"
      style={{ minHeight: "110vh" }}
    >
      {/* ── Render: secret-sauce.png — the systems environment ── */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: prefersReduced ? 0 : imageY,
          scale: prefersReduced ? 1 : imageScale,
          filter: prefersReduced ? undefined : imageFilter,
          transformOrigin: "65% 48%",
          willChange: "transform, filter",
          pointerEvents: "none",
        }}
      >
        <Image
          src="/assets/secret-sauce-new.png"
          alt="GoGMGo connected systems wall"
          fill
          className="object-cover object-center"
          quality={88}
          sizes="100vw"
        />
      </motion.div>

      {/* Upper-left darkening — behind the section header */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: 0, left: 0, width: "55%", height: "52%",
          background: "linear-gradient(135deg, rgba(5,5,5,0.65) 0%, rgba(5,5,5,0.28) 55%, transparent 80%)",
        }}
      />

      {/* Lower half — stronger overlay for HTML capability blocks */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "62%",
          background: "linear-gradient(to top, rgba(5,5,5,0.86) 0%, rgba(5,5,5,0.74) 30%, rgba(5,5,5,0.42) 60%, transparent 100%)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 pt-16 pb-20 lg:px-14 lg:pt-20">
        {/* Header */}
        <motion.div
          className="mb-10 max-w-2xl"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p variants={fadeUp} className="mb-3 text-xs font-medium uppercase tracking-[0.22em]" style={{ color: "#b8b5ad" }}>
            Secret Sauce
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-4xl font-semibold leading-tight sm:text-5xl"
            style={{ color: "#f4f1ea", letterSpacing: "-0.022em" }}
          >
            The Secret Sauce Is That{" "}
            <span style={{ color: "#00b1ae" }}>Everything Talks.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg leading-relaxed" style={{ color: "#b8b5ad", fontWeight: 500 }}>
            Most restaurant systems are stitched together after the fact. GoGMGo is designed as one
            operating layer — so sales, stock, staff, suppliers, payments and reporting stay connected.
          </motion.p>
        </motion.div>

        {/* Animated SVG overlay — adds motion to the rendered diagram */}
        <div className="mb-16 py-6">
          <SystemsOverlay progress={sectionProgress} />
        </div>

        {/* Capability blocks */}
        <motion.p
          className="mb-8 text-center text-sm font-medium uppercase tracking-[0.18em]"
          style={{ color: "rgba(184,181,173,0.68)" }}
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Four reasons everything works better together
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 overflow-hidden rounded-2xl mb-14"
          style={{ gap: "1px", backgroundColor: "rgba(244,241,234,0.05)" }}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {capabilities.map((cap) => (
            <motion.div key={cap.number} variants={fadeUp} className="p-8 lg:p-10" style={{ backgroundColor: "rgba(5,5,5,0.70)" }}>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: "#00b1ae" }}>
                {cap.number}
              </p>
              <h3 className="mb-3 text-xl font-semibold leading-snug" style={{ color: "#f4f1ea" }}>
                {cap.title}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: "rgba(184,181,173,0.74)", fontWeight: 500 }}>
                {cap.body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA band */}
        <motion.div
          className="rounded-2xl px-8 py-12 text-center sm:px-12"
          style={{ border: "1px solid rgba(0,177,174,0.15)", backgroundColor: "rgba(0,177,174,0.04)" }}
          initial={{ opacity: 1, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-2 text-2xl font-semibold" style={{ color: "#f4f1ea", letterSpacing: "-0.01em" }}>
            One system. Every part of your operation.
          </p>
          <p className="mb-8 text-base" style={{ color: "#b8b5ad", fontWeight: 500 }}>Connected by design. Built for restaurants.</p>
          <button
            type="button"
            onClick={openModal}
            className="cta-led inline-flex items-center justify-center rounded-lg px-8 py-3.5 text-sm font-semibold transition-all duration-300 cursor-pointer"
            style={{ backgroundColor: "#00b1ae", color: "#050505", border: "none" }}
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

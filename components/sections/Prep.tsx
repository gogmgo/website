"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { fadeUp, stagger } from "@/lib/motion"
import { useModal } from "@/context/ModalContext"

const steps = [
  {
    duration: "1 Min",
    title: "Partner Integrations",
    description: "Connect payment, delivery, reservation and accounting partners with guided one-click setup flows.",
    items: ["Payments", "Delivery platforms", "Reservations", "Accounting connectors"],
  },
  {
    duration: "1 Hour",
    title: "POS Setup",
    description: "Menu, outlets, users and devices configured without weeks of back-and-forth.",
    items: ["Menus and modifiers", "Outlet configuration", "Users and roles", "Devices and printers"],
  },
  {
    duration: "1 Day",
    title: "HR Setup",
    description: "Staff profiles, schedules and attendance workflows — fast enough for real operators to use on day one.",
    items: ["Staff profiles", "Roles and permissions", "Shift scheduling", "Time and attendance"],
  },
  {
    duration: "1 Month",
    title: "Procurement & Inventory",
    description: "Use invoices and supplier documents to progressively build procurement and inventory intelligence.",
    items: ["Supplier documents", "Invoice capture", "Ingredients and recipes", "Stock flows"],
  },
]

export function Prep() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = useReducedMotion()

  // Single full-lifecycle tracker — 0=section entering, 0.476=filling viewport, 1=fully exited
  // Total range: 110vh section + 100vh viewport = 210vh
  const { scrollYProgress: fullProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Y drift — starts when section fills viewport
  const imageY = useTransform(fullProgress, [0.48, 1.0], [0, 100])

  // Exit zoom toward front counter (left of screen) — mirrors Hero's acceleration curve
  // Keyframes mapped from Hero's ["start start","end start"] onto exit phase [0.476, 1.0]
  const imageScale = useTransform(
    fullProgress,
    [0,   0.10, 0.48, 0.56, 0.71, 0.85, 1.00],
    [1.0, 1.0,  1.0,  1.06, 1.14, 1.28, 1.46]
  )

  // Blur: clears fast on entry (8→0 in first ~22vh), builds on exit matching Hero pacing
  const imageBlurNum = useTransform(
    fullProgress,
    [0,   0.10, 0.48, 0.78, 0.87, 0.95, 1.00],
    [8,   0,    0,    0,    3,    9,    15]
  )
  const imageFilter = useTransform(imageBlurNum, (v) => `blur(${v.toFixed(1)}px)`)

  const { openModal } = useModal()

  return (
    <section
      ref={sectionRef}
      id="prep"
      className="relative overflow-hidden isolate"
      style={{ minHeight: "90vh" }}
    >
      {/* ── Render: prep-new.png ── */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: prefersReduced ? 0 : imageY,
          scale: prefersReduced ? 1 : imageScale,
          filter: prefersReduced ? undefined : imageFilter,
          transformOrigin: "20% 55%",
          willChange: "transform, filter",
          pointerEvents: "none",
        }}
      >
        <Image
          src="/assets/prep-new.png"
          alt="GoGMGo onboarding — manager and specialist at café table"
          fill
          className="object-cover object-center"
          quality={88}
          sizes="100vw"
        />
      </motion.div>

      {/* Dark overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(108deg, rgba(5,4,2,0.72) 0%, rgba(5,4,2,0.54) 38%, rgba(5,4,2,0.28) 60%, rgba(5,4,2,0.42) 100%)",
        }}
      />

      {/* Bottom blend */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "22%",
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(5,4,2,0.60) 55%, rgba(5,4,2,0.90) 100%)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 py-20 lg:px-14 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

          {/* LEFT */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <motion.p variants={fadeUp} className="mb-4 text-xs font-medium uppercase tracking-[0.22em]" style={{ color: "#b8b5ad" }}>
              Prep
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mb-5 text-4xl font-semibold leading-tight lg:text-5xl"
              style={{ color: "#f4f1ea", letterSpacing: "-0.022em" }}
            >
              Smart prep.
              <br />
              <span style={{ color: "#b7d66d" }}>Stronger operations.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-8 text-base leading-relaxed" style={{ color: "rgba(244,241,234,0.78)", fontWeight: 500 }}>
              From invoices to timecards, GoGMGo helps you get everything in order so you can
              reduce waste, control costs, and stay ready for what&apos;s next.
            </motion.p>

            {/* Timeline indicator */}
            <motion.div variants={fadeUp} className="mb-8 flex items-center gap-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className="h-2 w-2 rounded-full border"
                      style={{ borderColor: "rgba(0,177,174,0.5)", backgroundColor: "#050505" }}
                    />
                    <p className="mt-1.5 text-center leading-none" style={{ color: "rgba(184,181,173,0.68)", fontSize: "13px", fontWeight: 500 }}>
                      {step.duration}
                    </p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="h-px w-6 lg:w-10 shrink-0" style={{ backgroundColor: "rgba(0,177,174,0.2)" }} />
                  )}
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp}>
              <button
                type="button"
                onClick={openModal}
                className="cta-led inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 cursor-pointer"
                style={{
                  backgroundColor: "rgba(0,177,174,0.12)",
                  border: "1px solid rgba(0,177,174,0.4)",
                  color: "#00b1ae",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(0,177,174,0.22)" }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(0,177,174,0.12)" }}
              >
                Start Here
                <span aria-hidden>→</span>
              </button>
            </motion.div>
          </motion.div>

          {/* RIGHT: 4 setup cards */}
          <div className="flex flex-col justify-center">
            <motion.p
              className="mb-6 text-sm font-semibold"
              style={{ color: "#f4f1ea" }}
              initial={{ opacity: 1, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Everything you need. Set up in record time.
            </motion.p>

            <motion.div
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {steps.map((step) => (
                <motion.div
                  key={step.duration}
                  variants={fadeUp}
                  className="rounded-xl p-5"
                  style={{
                    backgroundColor: "rgba(14,11,8,0.56)",
                    border: "1px solid rgba(244,241,234,0.07)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em]" style={{ color: "#00b1ae" }}>
                    {step.duration}
                  </p>
                  <p className="mb-2 text-xl font-semibold leading-snug" style={{ color: "#f4f1ea" }}>
                    {step.title}
                  </p>
                  <p className="mb-3 text-base leading-relaxed" style={{ color: "rgba(184,181,173,0.72)", fontWeight: 500 }}>
                    {step.description}
                  </p>
                  <ul className="space-y-1">
                    {step.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-base" style={{ color: "rgba(184,181,173,0.72)" }}>
                        <span className="h-px w-2.5 shrink-0" style={{ backgroundColor: "rgba(0,177,174,0.35)" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Footer CTA band */}
        <motion.div
          className="mt-16 rounded-2xl px-8 py-10 text-center sm:px-12"
          style={{ border: "1px solid rgba(200,169,106,0.12)", backgroundColor: "rgba(200,169,106,0.03)" }}
          initial={{ opacity: 1, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-2 text-xl font-semibold" style={{ color: "#f4f1ea" }}>
            From prep to performance.
          </p>
          <p className="mb-7 text-sm" style={{ color: "#b8b5ad", fontWeight: 500 }}>
            We&apos;re with you every step.
          </p>
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center justify-center rounded-lg px-7 py-3.5 text-sm font-semibold transition-all duration-300 cursor-pointer"
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

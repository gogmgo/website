"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { fadeUp, stagger } from "@/lib/motion"
import { AnalyticsEvents } from "@/lib/analytics"

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  // Subtle Y drift — scale handles the forward motion, Y adds depth only
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 20])

  // Zoom starts immediately on first scroll, accelerates toward the door
  const imageScale = useTransform(
    scrollYProgress,
    [0,    0.15,  0.45,  0.72,  1],
    [1.0,  1.06,  1.14,  1.28,  1.46]
  )

  // Blur builds only as you rush through the entrance — camera defocuses
  const imageFilter = useTransform(
    scrollYProgress,
    [0,           0.58,         0.75,         0.90,         1],
    ["blur(0px)", "blur(0px)", "blur(3px)", "blur(9px)", "blur(15px)"]
  )

  // Content stays FIXED — text anchored to the scene like signage
  const contentOpacity = useTransform(scrollYProgress, [0, 0.50, 0.78], [1, 1, 0])
  const hintOpacity = useTransform(scrollYProgress, [0, 0.14], [1, 0])

  // Warm interior glow grows as you approach the entrance
  const warmApproachOpacity = useTransform(scrollYProgress, [0.25, 1], [0, 1])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden isolate"
      style={{ height: "100vh", minHeight: "600px", position: "relative" }}
    >
      {/* ── Environment: hero-storefront.png ── */}
      {/* The render has text baked in — the overlay below seals the left zone */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: prefersReduced ? 0 : imageY,
          scale: prefersReduced ? 1 : imageScale,
          filter: prefersReduced ? undefined : imageFilter,
          transformOrigin: "62% 50%",
          willChange: "transform, filter",
          pointerEvents: "none",
        }}
      >
        <Image
          src="/assets/new-hero.png"
          alt="GoGMGo Café exterior at night"
          fill
          className="object-cover object-center"
          priority
          quality={90}
          sizes="100vw"
        />
      </motion.div>

      {/* ── LEFT PANEL: sealed dark zone ──────────────────────────────
          Near-opaque on the left — completely eliminates the render's
          baked-in text so only the HTML headline is visible.
          Fades to transparent by 65%, letting the café show on the right.
      ──────────────────────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(5,5,5,0.72) 0%, rgba(5,5,5,0.60) 28%, rgba(5,5,5,0.38) 46%, rgba(5,5,5,0.12) 62%, transparent 75%)",
        }}
      />

      {/* Top darkening — night sky above the building */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "16%",
          background:
            "linear-gradient(to bottom, rgba(5,5,5,0.55) 0%, transparent 100%)",
        }}
      />

      {/* Growing interior warmth — the café is ahead, its light becoming more prominent */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{ height: "45%", opacity: warmApproachOpacity }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(ellipse 55% 75% at 62% 100%, rgba(200,169,106,0.10) 0%, rgba(200,169,106,0.04) 45%, transparent 65%)",
          }}
        />
      </motion.div>

      {/* Bottom blend — warms slightly toward the threshold */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "25%",
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(5,4,2,0.46) 55%, rgba(5,4,2,0.88) 100%)",
        }}
      />

      {/* ── Content: one headline, nothing competing ────────────────── */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center"
        style={{ opacity: contentOpacity }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-14">
          <motion.div
            className="max-w-[460px]"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* Single headline — no eyebrow, no ghost layers, maximum clarity */}
            <motion.h1
              variants={fadeUp}
              className="mb-6"
              style={{
                color: "#f4f1ea",
                fontSize: "clamp(2.1rem, 4.6vw, 4.1rem)",
                fontWeight: 600,
                lineHeight: 1.07,
                letterSpacing: "-0.028em",
              }}
            >
              The Restaurant
              <br />
              Operating System.
              <br />
              <span style={{ color: "#b7d66d" }}>Served Fresh.</span>
            </motion.h1>

            {/* One short line — supports, doesn't compete */}
            <motion.p
              variants={fadeUp}
              className="mb-9"
              style={{
                color: "rgba(244,241,234,0.78)",
                fontSize: "1.0625rem",
                fontWeight: 500,
                lineHeight: 1.65,
                maxWidth: "360px",
              }}
            >
              POS, procurement, HR, analytics and online ordering —
              one connected system.
            </motion.p>

            {/* Refined CTAs: thinner, cleaner, confident */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">

              {/* Primary: solid teal, no border, no glow */}
              <a
                href="#our-menu"
                onClick={() => AnalyticsEvents.ourMenuClick()}
                className="cta-led inline-flex items-center gap-2 rounded-lg text-sm font-semibold transition-colors duration-300"
                style={{
                  backgroundColor: "#00b1ae",
                  color: "#050505",
                  padding: "10px 22px",
                  letterSpacing: "0.01em",
                  textDecoration: "none",
                  animationDelay: "1.4s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#007b6f")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#00b1ae")
                }
              >
                Our Menu
                <span style={{ fontSize: "0.8em", opacity: 0.75 }} aria-hidden>
                  →
                </span>
              </a>

              {/* Secondary: hairline border, no fill, subdued */}
              <a
                href="#secret-sauce"
                onClick={() => AnalyticsEvents.secretSauceClick()}
                className="inline-flex items-center rounded-lg text-sm font-medium transition-all duration-300"
                style={{
                  border: "0.5px solid rgba(244,241,234,0.28)",
                  color: "rgba(244,241,234,0.80)",
                  backgroundColor: "transparent",
                  padding: "10px 22px",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(244,241,234,0.42)"
                  e.currentTarget.style.color = "#f4f1ea"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(244,241,234,0.28)"
                  e.currentTarget.style.color = "rgba(244,241,234,0.80)"
                }}
              >
                See the Secret Sauce
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Minimal scroll indicator */}
      <motion.div
        className="pointer-events-none absolute bottom-8 left-8 lg:left-14 z-10 hidden lg:flex items-center gap-3"
        style={{ opacity: hintOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1.0 }}
      >
        <div
          className="h-px w-6"
          style={{
            background:
              "linear-gradient(to right, rgba(184,181,173,0.22), transparent)",
          }}
        />
        <span
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: "rgba(184,181,173,0.22)" }}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  )
}

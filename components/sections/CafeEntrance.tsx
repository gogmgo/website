"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

// ── CafeEntrance ─────────────────────────────────────────────────────────────
// Pure atmospheric threshold between Hero (exterior) and StepInside (interior).
// No content — only spatial storytelling.
// The user is walking through the café entrance.
// ─────────────────────────────────────────────────────────────────────────────

export function CafeEntrance() {
  const ref = useRef<HTMLDivElement>(null)

  // Full journey: 0 = component entering from below, 1 = component exiting above
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Interior warmth rises as you walk toward the light source
  const warmOpacity = useTransform(scrollYProgress, [0.08, 0.85], [0, 1])

  // Glass shimmer: a faint horizontal band sweeping downward
  // as the glass door surface passes your eye level
  const shimmerY = useTransform(scrollYProgress, [0.22, 0.75], ["-6%", "30%"])
  const shimmerOpacity = useTransform(
    scrollYProgress,
    [0.24, 0.38, 0.60, 0.74],
    [0, 1, 1, 0]
  )

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{ height: "28vh", position: "relative" }}
      aria-hidden="true"
    >
      {/* ── BASE: exterior cold → doorway shadow → warm approach ── */}
      {/* The slight dip to warmer-dark at ~42% is the "under the lintel" shadow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #070503 0%, #060402 22%, #040200 42%, #080604 60%, #0C0906 78%, #0E0B07 100%)",
        }}
      />

      {/* ── CORRIDOR WALLS: strong lateral vignette ── */}
      {/* The entrance is narrow — the sides fall into architectural shadow */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0"
        style={{
          width: "22%",
          background:
            "linear-gradient(to right, rgba(2,1,0,0.90) 0%, rgba(2,1,0,0.60) 45%, rgba(2,1,0,0.18) 75%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0"
        style={{
          width: "22%",
          background:
            "linear-gradient(to left, rgba(2,1,0,0.90) 0%, rgba(2,1,0,0.60) 45%, rgba(2,1,0,0.18) 75%, transparent 100%)",
        }}
      />

      {/* ── OVERHEAD LINTEL: shadow from the door frame above ── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "24%",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.20) 60%, transparent 100%)",
        }}
      />

      {/* ── WARM INTERIOR LIGHT: rises from below as you approach ── */}
      {/* The café's warm amber interior is ahead — you're walking toward it */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{ height: "65%", opacity: warmOpacity }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: [
              // Primary warm bloom — centre, where the entrance opens into the room
              "radial-gradient(ellipse 52% 70% at 55% 100%, rgba(200,169,106,0.18) 0%, rgba(200,169,106,0.07) 40%, transparent 65%)",
              // Secondary warm spill — right side, from the door gap in the hero
              "radial-gradient(ellipse 28% 45% at 78% 100%, rgba(200,169,106,0.10) 0%, transparent 55%)",
            ].join(","),
          }}
        />
      </motion.div>

      {/* ── GLASS DOOR SURFACE: faint horizontal shimmer ── */}
      {/* The glass door surface passing your eye level as you walk through */}
      <motion.div
        className="pointer-events-none absolute inset-x-0"
        style={{
          y: shimmerY,
          opacity: shimmerOpacity,
          height: "7%",
          top: "44%",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.014) 30%, rgba(255,255,255,0.022) 50%, rgba(200,169,106,0.018) 68%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* ── GLASS PANEL EDGE: single 1px line, barely visible ── */}
      {/* Suggests the frameless glass door panel meeting the wall */}
      <div
        className="pointer-events-none absolute inset-y-0"
        style={{
          left: "48%",
          width: "1px",
          background:
            "linear-gradient(to bottom, transparent 12%, rgba(200,169,106,0.04) 38%, rgba(200,169,106,0.07) 55%, rgba(200,169,106,0.04) 72%, transparent 88%)",
        }}
      />

      {/* ── TOP BLEND: connects seamlessly with Hero's bottom ── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "22%",
          background: "linear-gradient(to bottom, #070503 0%, transparent 100%)",
        }}
      />

      {/* ── BOTTOM BLEND: connects seamlessly with StepInside's top ── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "20%",
          background: "linear-gradient(to top, #0E0B07 0%, transparent 100%)",
        }}
      />
    </div>
  )
}

"use client"

import { useRef, useEffect, useState, Fragment } from "react"
import { motion, useInView } from "framer-motion"

const stats = [
  { to: 200, from: 160, prefix: "",  suffix: "+",  label: "merchants onboarded" },
  { to: 150, from: 110, prefix: "$", suffix: "M+", label: "annual payments processed" },
  { to: 1,   from: 1,   prefix: "",  suffix: "M+", label: "annual transactions powered" },
  { to: 14,  from: 7,   prefix: "",  suffix: "+",  label: "partner integrations" },
]

function CountUp({ from, to, prefix = "", suffix = "" }: {
  from: number; to: number; prefix?: string; suffix?: string
}) {
  const [value, setValue] = useState(from)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  useEffect(() => {
    if (!inView || from === to) return
    const duration = 1600
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(from + Math.round(eased * (to - from)))
      if (t < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [inView, from, to])

  return <span ref={ref}>{prefix}{value}{suffix}</span>
}

function StatContent({ stat, i, inView }: { stat: typeof stats[0]; i: number; inView: boolean }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.09 + 0.15, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <span
        style={{
          display: "block",
          color: "#f4f1ea",
          fontSize: "clamp(1.85rem, 3vw, 2.6rem)",
          fontWeight: 600,
          letterSpacing: "-0.030em",
          lineHeight: 1,
          marginBottom: "0.45rem",
        }}
      >
        <CountUp from={stat.from} to={stat.to} prefix={stat.prefix} suffix={stat.suffix} />
      </span>
      <span
        style={{
          display: "block",
          color: "rgba(184,181,173,0.50)",
          fontSize: "0.72rem",
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          lineHeight: 1.45,
          maxWidth: "110px",
        }}
      >
        {stat.label}
      </span>
    </motion.div>
  )
}

export function ProofStrip() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: "-80px" })

  return (
    <section ref={sectionRef} aria-label="Platform credibility" style={{ background: "#0E0B07" }}>

      {/* Top accent rule */}
      <div
        style={{
          height: "0.5px",
          background: "linear-gradient(to right, transparent 4%, rgba(0,177,174,0.22) 28%, rgba(183,214,109,0.14) 52%, rgba(0,177,174,0.22) 76%, transparent 96%)",
        }}
      />

      <div
        className="mx-auto px-4 sm:px-8 lg:px-14"
        style={{
          maxWidth: "72rem",
          paddingTop: "clamp(2.25rem, 3.8vw, 3.25rem)",
          paddingBottom: "clamp(2.25rem, 3.8vw, 3.25rem)",
        }}
      >
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            textAlign: "center",
            marginBottom: "clamp(1.75rem, 2.8vw, 2.5rem)",
            fontSize: "0.7rem",
            fontWeight: 500,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(184,181,173,0.42)",
          }}
        >
          Trusted by modern restaurant operators.
        </motion.p>

        {/* Desktop: flex row with thin dividers */}
        <div className="hidden lg:flex items-center justify-between">
          {stats.map((stat, i) => (
            <Fragment key={stat.label}>
              {i > 0 && (
                <div
                  aria-hidden="true"
                  style={{
                    width: "0.5px",
                    height: "2.5rem",
                    background: "rgba(0,177,174,0.10)",
                    flexShrink: 0,
                  }}
                />
              )}
              <div className="flex-1 flex justify-center">
                <StatContent stat={stat} i={i} inView={inView} />
              </div>
            </Fragment>
          ))}
        </div>

        {/* Mobile: 2×2 grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:hidden">
          {stats.map((stat, i) => (
            <StatContent key={stat.label} stat={stat} i={i} inView={inView} />
          ))}
        </div>
      </div>

      {/* Bottom accent rule */}
      <div
        style={{
          height: "0.5px",
          background: "linear-gradient(to right, transparent 4%, rgba(0,177,174,0.10) 28%, rgba(0,177,174,0.08) 52%, rgba(0,177,174,0.10) 76%, transparent 96%)",
        }}
      />

    </section>
  )
}

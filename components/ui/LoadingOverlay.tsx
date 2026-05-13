"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface LoadingOverlayProps {
  visible: boolean
  label?: string
}

export function LoadingOverlay({ visible, label }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[300]"
            style={{
              backgroundColor: "rgba(5,4,2,0.80)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          />

          {/* Glass card */}
          <div className="fixed inset-0 z-[300] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.90, y: 8 }}
              animate={{ opacity: 1, scale: 1,    y: 0 }}
              exit={{    opacity: 0, scale: 0.94,  y: 4 }}
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                position: "relative",
                overflow: "hidden",
                padding: "40px 48px 32px",
                borderRadius: "22px",
                backgroundColor: "rgba(10,8,6,0.92)",
                border: "1px solid rgba(244,241,234,0.10)",
                boxShadow: [
                  "0 24px 64px rgba(0,0,0,0.70)",
                  "0 0 0 0.5px rgba(244,241,234,0.05)",
                  "inset 0 1px 0 rgba(244,241,234,0.06)",
                ].join(", "),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0",
              }}
            >
              {/* Teal top hairline */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, height: "1px",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(0,175,170,0.55) 25%, rgba(0,175,170,0.55) 75%, transparent 100%)",
                }}
              />

              {/* Ambient teal glow from top */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, height: "55%",
                  background:
                    "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,177,174,0.09) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              {/* Loader GIF */}
              <Image
                src="/brand/gogmgo-loader.gif"
                alt="Loading…"
                width={150}
                height={114}
                unoptimized
                priority
                style={{ position: "relative", zIndex: 1, display: "block" }}
              />

              {/* Optional label */}
              {label && (
                <p
                  style={{
                    marginTop: "20px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(184,181,173,0.55)",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {label}
                </p>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

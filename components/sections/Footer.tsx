"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useModal } from "@/context/ModalContext"

const links = [
  { label: "Privacy Policy",     href: "/privacy-policy",              external: false, isContact: false },
  { label: "Terms & Conditions", href: "/terms-and-conditions",         external: false, isContact: false },
  { label: "Contact",            href: "#",                            external: false, isContact: true  },
  { label: "Instagram",          href: "https://instagram.com/gogmgo", external: true,  isContact: false },
]

// ── Animated link with slow expanding underline ──────────────────────────────
function FooterLink({ label, href, external, isContact, onContact }: (typeof links)[number] & { onContact?: () => void }) {
  return (
    <motion.a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(isContact ? { onClick: (e: React.MouseEvent) => { e.preventDefault(); onContact?.() } } : {})}
      className="relative inline-block cursor-pointer"
      style={{
        color: "rgba(184,181,173,0.65)",
        fontSize: "0.9375rem",
        letterSpacing: "0.015em",
        textDecoration: "none",
        transition: "color 0.45s ease",
      }}
      whileHover="hovered"
      onMouseEnter={(e) => (e.currentTarget.style.color = "#00b1ae")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(184,181,173,0.65)")}
    >
      {label}{external && <span style={{ fontSize: "0.7em", marginLeft: "2px", opacity: 0.6 }}>↗</span>}
      {/* Expanding underline — slow and deliberate */}
      <motion.span
        className="absolute left-0 block h-px"
        style={{ bottom: "-2px", backgroundColor: "#00b1ae" }}
        variants={{
          rest:    { width: "0%" },
          hovered: { width: "100%" },
        }}
        initial="rest"
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </motion.a>
  )
}

// ── Footer ───────────────────────────────────────────────────────────────────
export function Footer() {
  const { openModal } = useModal()

  return (
    <footer
      id="contact"
      className="relative overflow-hidden"
      style={{ backgroundColor: "#050402" }}
    >
      {/* ── Cinematic environment ────────────────────────────────────────── */}

      {/* Top entry: dissolves seamlessly from Pricing above */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "35%",
          background:
            "linear-gradient(to bottom, rgba(5,4,2,0.95) 0%, transparent 100%)",
        }}
      />

      {/* Ambient warmth from above — the café's lingering heat */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "55%",
          background:
            "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(200,169,106,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Left architectural edge warmth */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0"
        style={{
          width: "18%",
          background:
            "linear-gradient(to right, rgba(200,169,106,0.02) 0%, transparent 100%)",
        }}
      />

      {/* Very faint stone texture — horizontal architectural grain */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(200,169,106,0.012) 59px, rgba(200,169,106,0.012) 60px)",
        }}
      />

      {/* Floor-level cove light — the quietest warm glow at the base */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "30%",
          background:
            "linear-gradient(to top, rgba(200,169,106,0.022) 0%, transparent 100%)",
        }}
      />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 lg:px-14">

        {/* Main row: logo+tagline left, links right */}
        <motion.div
          className="flex flex-col gap-10 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20 lg:gap-0"
          initial={{ opacity: 1, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        >
          {/* LEFT: Logo + tagline */}
          <div className="max-w-xs">
            <Image
              src="/brand/gogmgo-logo-white-2026.svg"
              alt="GoGMGo"
              width={140}
              height={39}
              unoptimized
              style={{ height: "32px", width: "auto", marginBottom: "14px" }}
            />
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(184,181,173,0.52)", letterSpacing: "0.01em", fontWeight: 500 }}
            >
              The Connected Operating System
              <br />
              for Modern Hospitality.
            </p>
          </div>

          {/* RIGHT: Navigation links */}
          <nav className="flex flex-wrap items-center gap-7 lg:gap-9">
            {links.map((link) => (
              <FooterLink key={link.label} {...link} onContact={openModal} />
            ))}
          </nav>
        </motion.div>

        {/* Hairline divider — single brass-tinted architectural line */}
        <motion.div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(200,169,106,0.12) 20%, rgba(200,169,106,0.12) 80%, transparent 100%)",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* Copyright row */}
        <motion.div
          className="flex flex-col gap-1.5 py-5 sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p
            className="text-sm"
            style={{ color: "rgba(184,181,173,0.32)", letterSpacing: "0.02em" }}
          >
            © GoGMGo. All rights reserved.
          </p>
          <p
            className="text-sm"
            style={{ color: "rgba(184,181,173,0.22)", letterSpacing: "0.02em" }}
          >
            The Connected Operating System for Modern Hospitality.
          </p>
          <p className="sr-only">
            GoGMGo is a restaurant POS and operating system for cafés, restaurants, bars, and F&B groups in Singapore and Southeast Asia.
            The platform includes restaurant point-of-sale software, kitchen management, HR and staff scheduling, procurement, inventory management, online ordering, and restaurant analytics — all connected in one system.
            Payment processing integrations include Stripe, Pine Labs, and Red Dot Payments.
            Delivery aggregator integrations include GrabFood and Foodpanda.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useScroll } from "framer-motion"
import { useModal } from "@/context/ModalContext"
import { AnalyticsEvents } from "@/lib/analytics"

const navItems = [
  { label: "Our Menu",      href: "#our-menu"      },
  { label: "Secret Sauce",  href: "#secret-sauce"  },
  { label: "Prep",          href: "#prep"          },
  { label: "4-Hands",       href: "#four-hands"    },
  { label: "Pricing",       href: "#pricing"       },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const { scrollY } = useScroll()
  const { openModal } = useModal()
  function openModalWithSource(source: string) {
    AnalyticsEvents.bookDemo(source)
    openModal()
  }

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setScrolled(latest > 60)
    })
  }, [scrollY])

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.slice(1))
    const handleScroll = () => {
      // Check point 40% down viewport — which section contains it is "active"
      const checkPoint = window.scrollY + window.innerHeight * 0.4
      let active: string | null = null
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        if (checkPoint >= el.offsetTop && checkPoint < el.offsetTop + el.offsetHeight) {
          active = id
          break
        }
      }
      setActiveSection(active)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? "rgba(5,5,5,0.90)" : "rgba(5,5,5,0.15)",
        borderBottom: scrolled
          ? "1px solid rgba(244,241,234,0.05)"
          : "1px solid transparent",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/brand/gogmgo-logo-white-2026.svg"
              alt="GoGMGo"
              width={101}
              height={28}
              unoptimized
              priority
              sizes="101px"
              style={{
                height: scrolled ? "30px" : "40px",
                width: "auto",
                transition: "height 0.4s ease",
              }}
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1)
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="group relative text-base font-medium transition-colors duration-300"
                  style={{ color: isActive ? "#f4f1ea" : "rgba(184,181,173,0.65)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f4f1ea")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? "#f4f1ea" : "rgba(184,181,173,0.65)")}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-green transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              )
            })}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Sign In — text only */}
            <a
              href="https://erp-beta.gogmgo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300"
              style={{ color: "rgba(184,181,173,0.60)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f4f1ea")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(184,181,173,0.60)")}
            >
              Sign In
            </a>
            {/* Sign Up — ghost border */}
            <a
              href="https://erp-beta.gogmgo.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-300"
              style={{
                borderColor: "rgba(244,241,234,0.14)",
                backgroundColor: "transparent",
                color: "rgba(244,241,234,0.70)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(244,241,234,0.28)"
                e.currentTarget.style.backgroundColor = "rgba(244,241,234,0.05)"
                e.currentTarget.style.color = "#f4f1ea"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(244,241,234,0.14)"
                e.currentTarget.style.backgroundColor = "transparent"
                e.currentTarget.style.color = "rgba(244,241,234,0.70)"
              }}
            >
              Sign Up
            </a>
            {/* Book a Demo — teal primary */}
            <button
              type="button"
              onClick={() => openModalWithSource("navbar_desktop")}
              className="cta-led inline-flex items-center justify-center rounded-lg border px-5 py-2 text-sm font-medium transition-all duration-300"
              style={{
                borderColor: "rgba(0,175,170,0.35)",
                backgroundColor: "rgba(0,175,170,0.08)",
                color: "#00afaa",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(0,175,170,0.16)"
                e.currentTarget.style.borderColor = "rgba(0,175,170,0.55)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(0,175,170,0.08)"
                e.currentTarget.style.borderColor = "rgba(0,175,170,0.35)"
              }}
            >
              Book a Demo
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-muted hover:text-warm-white transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            <div className="flex flex-col gap-[5px] w-5">
              <span
                className="h-px w-full bg-current transition-all duration-200 origin-center"
                style={{
                  transform: open ? "rotate(45deg) translateY(6px)" : "none",
                }}
              />
              <span
                className="h-px w-full bg-current transition-all duration-200"
                style={{ opacity: open ? 0 : 1 }}
              />
              <span
                className="h-px w-full bg-current transition-all duration-200 origin-center"
                style={{
                  transform: open ? "rotate(-45deg) translateY(-6px)" : "none",
                }}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            className="lg:hidden py-4 space-y-0.5"
            style={{ borderTop: "1px solid rgba(244,241,234,0.06)" }}
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-2 py-3 text-sm text-muted hover:text-warm-white transition-colors duration-200"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 pb-1 space-y-2">
              <div className="flex gap-2">
                <a
                  href="https://erp-beta.gogmgo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 block text-center rounded-lg py-3 text-sm font-medium transition-colors duration-200"
                  style={{
                    color: "rgba(184,181,173,0.65)",
                    border: "1px solid rgba(244,241,234,0.08)",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </a>
                <a
                  href="https://erp-beta.gogmgo.com/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 block text-center rounded-lg py-3 text-sm font-medium transition-colors duration-200"
                  style={{
                    color: "rgba(244,241,234,0.75)",
                    border: "1px solid rgba(244,241,234,0.14)",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </a>
              </div>
              <button
                type="button"
                onClick={() => { openModalWithSource("navbar_mobile"); setOpen(false) }}
                className="cta-led block w-full text-center rounded-lg py-3 text-sm font-medium cursor-pointer"
                style={{
                  color: "#00b1ae",
                  border: "1px solid rgba(0,177,174,0.35)",
                  backgroundColor: "rgba(0,177,174,0.08)",
                }}
              >
                Book a Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

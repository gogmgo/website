"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/legal/privacy-policy", label: "Privacy Policy" },
  { href: "/admin/legal/terms-and-conditions", label: "Terms & Conditions" },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: "220px",
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        borderRight: "1px solid rgba(244,241,234,0.07)",
        padding: "24px 0",
        flexShrink: 0,
      }}
    >
      <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(244,241,234,0.07)" }}>
        <span style={{ color: "#f4f1ea", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.04em" }}>
          GoGMGo Admin
        </span>
      </div>
      <nav style={{ padding: "16px 12px 0" }}>
        {links.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "block",
                padding: "9px 12px",
                borderRadius: "6px",
                fontSize: "0.8125rem",
                marginBottom: "2px",
                textDecoration: "none",
                color: active ? "#f4f1ea" : "rgba(184,181,173,0.55)",
                backgroundColor: active ? "rgba(244,241,234,0.06)" : "transparent",
                transition: "all 0.15s",
              }}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

import { ImageResponse } from "next/og"
import { readFileSync } from "fs"
import path from "path"

export const runtime = "nodejs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "GoGMGo — Restaurant Operating System for Modern F&B"

export default function OGImage() {
  let logoSrc = ""
  let heroBg  = ""

  try {
    const raw = readFileSync(path.join(process.cwd(), "public/brand/gogmgo-logo-white-2026.svg"))
    logoSrc = `data:image/svg+xml;base64,${raw.toString("base64")}`
  } catch { /* render text fallback */ }

  try {
    const raw = readFileSync(path.join(process.cwd(), "public/assets/new-hero.png"))
    heroBg = `data:image/png;base64,${raw.toString("base64")}`
  } catch { /* render without background */ }

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, 'Helvetica Neue', sans-serif",
          backgroundColor: "#050503",
        }}
      >
        {/* ── Café exterior background ──────────────────────────────────── */}
        {heroBg && (
          <img
            src={heroBg}
            alt=""
            style={{
              position: "absolute",
              top: 0, left: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              objectPosition: "62% 50%",
            }}
          />
        )}

        {/* ── Left panel gradient — mirrors Hero section exactly ────────── */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background:
              "linear-gradient(to right, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.90) 28%, rgba(5,5,5,0.72) 48%, rgba(5,5,5,0.38) 66%, rgba(5,5,5,0.10) 82%, transparent 100%)",
          }}
        />

        {/* ── Top darkening ─────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, height: "170px",
            background: "linear-gradient(to bottom, rgba(5,5,5,0.70) 0%, transparent 100%)",
          }}
        />

        {/* ── Bottom darkening ──────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0, height: "190px",
            background: "linear-gradient(to top, rgba(5,5,5,0.90) 0%, rgba(5,5,5,0.55) 50%, transparent 100%)",
          }}
        />

        {/* ── Teal top accent line ──────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, height: "3px",
            background: "linear-gradient(90deg, #00B1AE 0%, rgba(0,177,174,0.45) 55%, transparent 100%)",
          }}
        />

        {/* ── Warm approach glow from bottom-right (matches Hero) ───────── */}
        <div
          style={{
            position: "absolute",
            bottom: 0, right: 0, width: "55%", height: "60%",
            background:
              "radial-gradient(ellipse 70% 80% at 80% 100%, rgba(200,169,106,0.12) 0%, rgba(200,169,106,0.05) 45%, transparent 70%)",
          }}
        />

        {/* ── Content column (left ~65% of card) ───────────────────────── */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "54px 80px 58px",
            width: "66%",
          }}
        >
          {/* Logo */}
          {logoSrc ? (
            <img
              src={logoSrc}
              width={188}
              height={52}
              alt="GoGMGo"
              style={{ objectFit: "contain", objectPosition: "left center" }}
            />
          ) : (
            <span style={{ color: "#f4f1ea", fontSize: 26, fontWeight: 700 }}>GoGMGo</span>
          )}

          {/* Headline — matches Hero h1 structure */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                color: "#f4f1ea",
                fontSize: 58,
                fontWeight: 700,
                lineHeight: 1.06,
                letterSpacing: "-0.028em",
              }}
            >
              The Restaurant
            </div>
            <div
              style={{
                color: "#f4f1ea",
                fontSize: 58,
                fontWeight: 700,
                lineHeight: 1.06,
                letterSpacing: "-0.028em",
              }}
            >
              Operating System.
            </div>
            <div
              style={{
                color: "#b7d66d",
                fontSize: 58,
                fontWeight: 700,
                lineHeight: 1.10,
                letterSpacing: "-0.028em",
                marginTop: "6px",
              }}
            >
              Served Fresh.
            </div>

            {/* Sub line — matches Hero subtitle */}
            <div
              style={{
                color: "rgba(244,241,234,0.72)",
                fontSize: 21,
                fontWeight: 400,
                lineHeight: 1.55,
                marginTop: "22px",
                maxWidth: "580px",
              }}
            >
              POS, procurement, HR, analytics and online ordering —
              one connected platform for modern restaurants and cafés.
            </div>
          </div>

          {/* Bottom row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div
              style={{
                color: "rgba(0,177,174,0.80)",
                fontSize: 18,
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}
            >
              gogmgo.com
            </div>
            <div
              style={{
                color: "rgba(184,181,173,0.42)",
                fontSize: 14,
                fontWeight: 400,
                letterSpacing: "0.015em",
              }}
            >
              Restaurant POS · HR · Procurement · Analytics
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}

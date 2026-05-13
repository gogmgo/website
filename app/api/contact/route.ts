import { NextResponse } from "next/server"
import { getSiteSettings } from "@/lib/settings"

interface ContactPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName: string
  jobTitle: string
  websiteUrl: string
  companyType: string
  numOutlets: string
  productsOfInterest: string[]
  message: string
}

export async function POST(req: Request) {
  let body: ContactPayload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const { email, firstName, lastName, phone, companyName, jobTitle, websiteUrl,
    companyType, numOutlets, productsOfInterest, message } = body

  if (!email || !firstName || !lastName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const settings = await getSiteSettings()

  // ── HubSpot submission ────────────────────────────────────────────────────
  if (settings.hubspotPortalId && settings.hubspotFormId) {
    const hsPayload = {
      fields: [
        { name: "email",        value: email },
        { name: "firstname",    value: firstName },
        { name: "lastname",     value: lastName },
        { name: "phone",        value: phone },
        { name: "company",      value: companyName },
        { name: "jobtitle",     value: jobTitle },
        { name: "website",      value: websiteUrl },
        { name: "company_type", value: companyType },
        { name: "num_outlets",  value: numOutlets },
        { name: "products_of_interest", value: productsOfInterest.join("; ") },
        { name: "message",      value: message },
      ].filter((f) => f.value),
      context: {
        pageUri:  process.env.NEXTAUTH_URL ?? "https://gogmgo.com",
        pageName: "GoGMGo Demo Request",
      },
    }

    const hsRes = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${settings.hubspotPortalId}/${settings.hubspotFormId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hsPayload),
      }
    )

    if (!hsRes.ok) {
      const err = await hsRes.text()
      console.error("[contact] HubSpot error:", hsRes.status, err)
      return NextResponse.json({ error: "Submission failed" }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  }

  // ── Dev fallback: log to console ─────────────────────────────────────────
  console.log("[contact] Demo request (no HubSpot configured):", {
    name: `${firstName} ${lastName}`,
    email, phone, companyName, jobTitle, websiteUrl,
    companyType, numOutlets,
    productsOfInterest,
    message,
  })

  return NextResponse.json({ ok: true })
}

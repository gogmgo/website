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
  subject?: string
}

export async function POST(req: Request) {
  let body: ContactPayload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const { email, firstName, lastName, phone, companyName, jobTitle, websiteUrl,
    companyType, numOutlets, productsOfInterest, message, subject } = body

  if (!email || !firstName || !lastName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const settings = await getSiteSettings()

  // ── HubSpot submission ────────────────────────────────────────────────────
  if (settings.hubspotPortalId && settings.hubspotFormId) {
    const normalizedOutlets = numOutlets?.replace("–", "-")

    const hsFields: Array<{ name: string; value: string }> = []
    const seen = new Set<string>()

    const addField = (names: string[], value?: string) => {
      if (!value) return
      for (const name of names) {
        if (!name || seen.has(name)) continue
        hsFields.push({ name, value })
        seen.add(name)
      }
    }

    // Send values under multiple compatible field names to match HubSpot internal naming.
    addField(["firstname", "firstName"], firstName)
    addField(["lastname", "lastName"], lastName)
    addField(["email"], email)
    addField(["phone"], phone)
    addField(["company", "companyName"], companyName)
    addField(["jobtitle", "jobTitle"], jobTitle)
    addField(["website", "websiteUrl"], websiteUrl)
    addField(["company_category", "companyType", "0-2/company_category"], companyType)
    addField(["number_of_outlets", "numOutlets", "0-2/number_of_outlets"], normalizedOutlets)
    addField(["products_of_interest", "productsOfInterest", "0-2/products_of_interest"], productsOfInterest.join("; "))
    addField(["subject"], subject || "GoGMGo Demo Request")
    addField(["content", "message"], message)

    const hsPayload = {
      fields: hsFields,
      context: {
        pageUri:  process.env.NEXTAUTH_URL ?? "https://gogmgo.com",
        pageName: "GoGMGo Demo Request",
      },
    }

    const hsUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${settings.hubspotPortalId}/${settings.hubspotFormId}`
    console.log("[contact] Submitting to HubSpot:", hsUrl)

    const hsRes = await fetch(hsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hsPayload),
    })

    if (!hsRes.ok) {
      const errText = await hsRes.text()
      console.error("[contact] HubSpot error:", hsRes.status, errText)
      console.error("[contact] HubSpot payload:", JSON.stringify(hsPayload, null, 2))
      console.error("[contact] HubSpot settings - Portal:", settings.hubspotPortalId, "Form:", settings.hubspotFormId)
      
      // Try to parse HubSpot error response
      let hsErrorMessage = "Submission failed"
      try {
        const hsError = JSON.parse(errText)
        if (hsError.errors?.[0]?.message) {
          hsErrorMessage = hsError.errors[0].message
        } else if (hsError.message) {
          hsErrorMessage = hsError.message
        } else if (hsError.error) {
          hsErrorMessage = hsError.error
        }
      } catch {
        // If not JSON, use the text response or status-based message
        if (hsRes.status === 400) {
          hsErrorMessage = "Invalid form data. Please check your submission."
        } else if (hsRes.status === 401 || hsRes.status === 403) {
          hsErrorMessage = "Form submission is not configured correctly. Please contact support."
        } else if (hsRes.status === 404) {
          hsErrorMessage = "Form not found. Please contact support."
        } else if (hsRes.status === 429) {
          hsErrorMessage = "Too many requests. Please try again later."
        } else if (errText) {
          hsErrorMessage = errText.substring(0, 200) // Limit error message length
        }
      }
      
      return NextResponse.json({ 
        ok: false,
        error: hsErrorMessage,
        status: hsRes.status,
      }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } else {
    console.warn("[contact] HubSpot not configured - Portal:", !!settings.hubspotPortalId, "Form:", !!settings.hubspotFormId)
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

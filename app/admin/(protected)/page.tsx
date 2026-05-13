import { auth, signOut } from "@/auth"

export default async function AdminDashboard() {
  const session = await auth()

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
        <div>
          <h1 style={{ color: "#f4f1ea", fontSize: "1.375rem", fontWeight: 600, margin: 0 }}>
            Dashboard
          </h1>
          <p style={{ color: "rgba(184,181,173,0.50)", fontSize: "0.8125rem", marginTop: "4px" }}>
            Signed in as {session?.user?.email}
          </p>
        </div>
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/admin/login" })
          }}
        >
          <button
            type="submit"
            style={{
              background: "transparent",
              border: "1px solid rgba(244,241,234,0.12)",
              color: "rgba(184,181,173,0.55)",
              padding: "7px 16px",
              borderRadius: "6px",
              fontSize: "0.8125rem",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </form>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
        {[
          { title: "Site Settings", desc: "SEO, analytics, HubSpot, contact", href: "/admin/settings" },
          { title: "Privacy Policy", desc: "Rich text editor", href: "/admin/legal/privacy-policy" },
          { title: "Terms & Conditions", desc: "Rich text editor", href: "/admin/legal/terms-and-conditions" },
        ].map((card) => (
          <a
            key={card.href}
            href={card.href}
            style={{
              display: "block",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid rgba(244,241,234,0.08)",
              backgroundColor: "rgba(244,241,234,0.025)",
              textDecoration: "none",
              transition: "border-color 0.2s",
            }}
          >
            <p style={{ color: "#f4f1ea", fontSize: "0.875rem", fontWeight: 500, margin: "0 0 6px" }}>
              {card.title}
            </p>
            <p style={{ color: "rgba(184,181,173,0.45)", fontSize: "0.75rem", margin: 0 }}>
              {card.desc}
            </p>
          </a>
        ))}
      </div>
    </div>
  )
}

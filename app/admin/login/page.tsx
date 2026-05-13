import { redirect } from "next/navigation"
import { auth, signIn } from "@/auth"
import { AuthError } from "next-auth"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const session = await auth()
  if (session) redirect("/admin")

  const { error } = await searchParams

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#050505",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          border: "1px solid rgba(244,241,234,0.08)",
          borderRadius: "12px",
          backgroundColor: "rgba(244,241,234,0.02)",
          padding: "40px 36px",
        }}
      >
        <h1
          style={{
            color: "#f4f1ea",
            fontSize: "1.125rem",
            fontWeight: 600,
            margin: "0 0 8px",
          }}
        >
          GoGMGo Admin
        </h1>
        <p style={{ color: "rgba(184,181,173,0.45)", fontSize: "0.8125rem", margin: "0 0 28px" }}>
          Sign in to continue
        </p>

        {error && (
          <p
            style={{
              color: "#f87171",
              fontSize: "0.8rem",
              marginBottom: "16px",
              padding: "10px 14px",
              borderRadius: "6px",
              backgroundColor: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.18)",
            }}
          >
            Invalid email or password
          </p>
        )}

        <form
          action={async (formData: FormData) => {
            "use server"
            try {
              await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirectTo: "/admin",
              })
            } catch (e) {
              if (e instanceof AuthError) {
                redirect("/admin/login?error=invalid")
              }
              throw e
            }
          }}
        >
          <div style={{ marginBottom: "14px" }}>
            <label
              htmlFor="email"
              style={{ display: "block", color: "rgba(184,181,173,0.60)", fontSize: "0.75rem", marginBottom: "6px" }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "6px",
                border: "1px solid rgba(244,241,234,0.12)",
                backgroundColor: "rgba(244,241,234,0.04)",
                color: "#f4f1ea",
                fontSize: "0.875rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "22px" }}>
            <label
              htmlFor="password"
              style={{ display: "block", color: "rgba(184,181,173,0.60)", fontSize: "0.75rem", marginBottom: "6px" }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "6px",
                border: "1px solid rgba(244,241,234,0.12)",
                backgroundColor: "rgba(244,241,234,0.04)",
                color: "#f4f1ea",
                fontSize: "0.875rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "7px",
              backgroundColor: "#00afaa",
              border: "none",
              color: "#050505",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}

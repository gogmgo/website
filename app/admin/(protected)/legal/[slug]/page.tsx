import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { LegalEditor } from "./LegalEditor"

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await db.legalPage.findUnique({ where: { slug } })
  if (!page) notFound()

  return (
    <div>
      <h1 style={{ color: "#f4f1ea", fontSize: "1.375rem", fontWeight: 600, margin: "0 0 8px" }}>
        {page.title}
      </h1>
      <p style={{ color: "rgba(184,181,173,0.45)", fontSize: "0.8125rem", margin: "0 0 32px" }}>
        /{page.slug} · Last updated: {new Date(page.updatedAt).toLocaleDateString()}
      </p>
      <LegalEditor initialData={page} />
    </div>
  )
}

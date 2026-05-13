import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { slug } = await params
  const page = await db.legalPage.findUnique({ where: { slug } })
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(page)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { slug } = await params
  const body = await req.json()
  const page = await db.legalPage.update({
    where: { slug },
    data: body,
  })
  return NextResponse.json(page)
}

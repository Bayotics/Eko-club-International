import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { requireAdmin } from "@/lib/admin-auth"
import { presignUpload } from "@/lib/r2"
import { MAX_MAGAZINE_PDF_BYTES, MAX_MAGAZINE_PDF_MB } from "@/lib/magazine-limits"

export async function POST(request: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { contentType, size } = await request.json()

    if (contentType !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }
    if (typeof size !== "number" || size <= 0 || size > MAX_MAGAZINE_PDF_BYTES) {
      return NextResponse.json({ error: `PDF must be under ${MAX_MAGAZINE_PDF_MB} MB` }, { status: 400 })
    }

    const key = `eko-communicator/${new Date().getUTCFullYear()}/${randomUUID()}.pdf`
    const uploadUrl = await presignUpload(key, contentType)
    return NextResponse.json({ uploadUrl, key })
  } catch (error) {
    console.error("Error creating R2 upload URL:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not prepare the upload" },
      { status: 500 },
    )
  }
}

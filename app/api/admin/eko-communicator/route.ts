import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { requireAdmin } from "@/lib/admin-auth"
import { parseMagazineInput } from "@/lib/magazine-input"
import { verifyR2Upload } from "@/lib/magazine-storage"
import Magazine from "@/models/Magazine"

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    await connectToDatabase()
    const magazines = await Magazine.find({}).sort({ publishedDate: -1 }).lean()
    return NextResponse.json(magazines)
  } catch (error) {
    console.error("Error fetching magazines:", error)
    return NextResponse.json({ error: "Failed to fetch magazines" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const parsed = parseMagazineInput(await request.json())
    if (!parsed.data) return NextResponse.json({ error: parsed.error }, { status: 400 })

    if (parsed.data.pdfStorage === "r2") {
      const problem = await verifyR2Upload(parsed.data.pdfKey)
      if (problem) return NextResponse.json({ error: problem }, { status: 400 })
    }

    await connectToDatabase()
    const magazine = await Magazine.create(parsed.data)
    return NextResponse.json(magazine, { status: 201 })
  } catch (error) {
    console.error("Error creating magazine:", error)
    return NextResponse.json({ error: "Failed to create magazine" }, { status: 500 })
  }
}

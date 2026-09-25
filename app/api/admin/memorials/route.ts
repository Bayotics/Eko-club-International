import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { requireAdmin } from "@/lib/admin-auth"
import { parseMemorialInput } from "@/lib/memorial-input"
import Memorial from "@/models/Memorial"

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    await connectToDatabase()
    const memorials = await Memorial.find({}).sort({ dateOfPassing: -1 }).lean()
    return NextResponse.json(memorials)
  } catch (error) {
    console.error("Error fetching memorials:", error)
    return NextResponse.json({ error: "Failed to fetch memorials" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const parsed = parseMemorialInput(await request.json())
    if (!parsed.data) return NextResponse.json({ error: parsed.error }, { status: 400 })

    await connectToDatabase()
    const memorial = await Memorial.create(parsed.data)
    return NextResponse.json(memorial, { status: 201 })
  } catch (error) {
    console.error("Error creating memorial:", error)
    return NextResponse.json({ error: "Failed to create memorial" }, { status: 500 })
  }
}

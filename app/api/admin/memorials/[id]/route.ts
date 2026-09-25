import { NextResponse } from "next/server"
import mongoose from "mongoose"
import { connectToDatabase } from "@/lib/mongodb"
import { requireAdmin } from "@/lib/admin-auth"
import { parseMemorialInput } from "@/lib/memorial-input"
import Memorial from "@/models/Memorial"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { id } = await params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    const parsed = parseMemorialInput(await request.json())
    if (!parsed.data) return NextResponse.json({ error: parsed.error }, { status: 400 })

    await connectToDatabase()
    const updated = await Memorial.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true })
    if (!updated) {
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating memorial:", error)
    return NextResponse.json({ error: "Failed to update memorial" }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { id } = await params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    await connectToDatabase()
    const deleted = await Memorial.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Memorial deleted successfully" })
  } catch (error) {
    console.error("Error deleting memorial:", error)
    return NextResponse.json({ error: "Failed to delete memorial" }, { status: 500 })
  }
}

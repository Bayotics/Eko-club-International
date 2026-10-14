import { NextResponse } from "next/server"
import mongoose from "mongoose"
import { connectToDatabase } from "@/lib/mongodb"
import { requireAdmin } from "@/lib/admin-auth"
import { parseMagazineInput } from "@/lib/magazine-input"
import { isSamePdf, removeStoredPdf, verifyR2Upload } from "@/lib/magazine-storage"
import Magazine from "@/models/Magazine"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { id } = await params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Magazine not found" }, { status: 404 })
    }

    const parsed = parseMagazineInput(await request.json())
    if (!parsed.data) return NextResponse.json({ error: parsed.error }, { status: 400 })

    await connectToDatabase()
    const existing = await Magazine.findById(id)
    if (!existing) {
      return NextResponse.json({ error: "Magazine not found" }, { status: 404 })
    }

    const previous = { pdfStorage: existing.pdfStorage, pdfPublicId: existing.pdfPublicId, pdfKey: existing.pdfKey }
    const pdfChanged = !isSamePdf(previous, parsed.data)

    if (pdfChanged && parsed.data.pdfStorage === "r2") {
      const problem = await verifyR2Upload(parsed.data.pdfKey)
      if (problem) return NextResponse.json({ error: problem }, { status: 400 })
    }

    existing.set(parsed.data)
    await existing.save()

    if (pdfChanged) await removeStoredPdf(previous)

    return NextResponse.json(existing)
  } catch (error) {
    console.error("Error updating magazine:", error)
    return NextResponse.json({ error: "Failed to update magazine" }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { id } = await params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Magazine not found" }, { status: 404 })
    }

    await connectToDatabase()
    const deleted = await Magazine.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ error: "Magazine not found" }, { status: 404 })
    }

    await removeStoredPdf(deleted)
    return NextResponse.json({ message: "Magazine deleted successfully" })
  } catch (error) {
    console.error("Error deleting magazine:", error)
    return NextResponse.json({ error: "Failed to delete magazine" }, { status: 500 })
  }
}

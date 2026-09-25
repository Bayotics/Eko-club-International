import { NextResponse } from "next/server"
import mongoose from "mongoose"
import { v2 as cloudinary } from "cloudinary"
import { connectToDatabase } from "@/lib/mongodb"
import { requireAdmin } from "@/lib/admin-auth"
import { parseMagazineInput } from "@/lib/magazine-input"
import Magazine from "@/models/Magazine"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function destroyPdf(publicId: string) {
  if (!publicId) return
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true })
  } catch (error) {
    console.error("Failed to delete magazine PDF from Cloudinary:", error)
  }
}

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

    const previousPublicId = existing.pdfPublicId
    existing.set(parsed.data)
    await existing.save()

    if (previousPublicId && previousPublicId !== parsed.data.pdfPublicId) {
      await destroyPdf(previousPublicId)
    }

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

    await destroyPdf(deleted.pdfPublicId)
    return NextResponse.json({ message: "Magazine deleted successfully" })
  } catch (error) {
    console.error("Error deleting magazine:", error)
    return NextResponse.json({ error: "Failed to delete magazine" }, { status: 500 })
  }
}

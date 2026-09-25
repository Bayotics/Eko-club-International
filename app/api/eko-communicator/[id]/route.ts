import { NextResponse } from "next/server"
import mongoose from "mongoose"
import { connectToDatabase } from "@/lib/mongodb"
import Magazine from "@/models/Magazine"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Magazine not found" }, { status: 404 })
    }

    await connectToDatabase()
    const magazine = await Magazine.findById(id).select("-pdfPublicId").lean()
    if (!magazine) {
      return NextResponse.json({ error: "Magazine not found" }, { status: 404 })
    }
    return NextResponse.json(magazine)
  } catch (error) {
    console.error("Error fetching magazine:", error)
    return NextResponse.json({ error: "Failed to fetch magazine" }, { status: 500 })
  }
}

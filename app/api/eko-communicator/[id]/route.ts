import { NextResponse } from "next/server"
import mongoose from "mongoose"
import { connectToDatabase } from "@/lib/mongodb"
import { presignRead } from "@/lib/r2"
import Magazine from "@/models/Magazine"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Magazine not found" }, { status: 404 })
    }

    await connectToDatabase()
    const magazine = await Magazine.findById(id).select("-pdfPublicId").lean<Record<string, any>>()
    if (!magazine) {
      return NextResponse.json({ error: "Magazine not found" }, { status: 404 })
    }

    const { pdfKey, ...rest } = magazine
    // R2 bucket is private: readers get a short-lived signed URL instead of a permanent link.
    const pdfUrl = magazine.pdfStorage === "r2" ? await presignRead(pdfKey) : magazine.pdfUrl

    return NextResponse.json({ ...rest, pdfUrl }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("Error fetching magazine:", error)
    return NextResponse.json({ error: "Failed to fetch magazine" }, { status: 500 })
  }
}

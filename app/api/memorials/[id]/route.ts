import { NextResponse } from "next/server"
import mongoose from "mongoose"
import { connectToDatabase } from "@/lib/mongodb"
import Memorial from "@/models/Memorial"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    await connectToDatabase()
    const memorial = await Memorial.findById(id).lean()
    if (!memorial) {
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }
    return NextResponse.json(memorial)
  } catch (error) {
    console.error("Error fetching memorial:", error)
    return NextResponse.json({ error: "Failed to fetch memorial" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Magazine from "@/models/Magazine"

export async function GET() {
  try {
    await connectToDatabase()
    const magazines = await Magazine.find({}).select("-pdfPublicId").sort({ publishedDate: -1 }).lean()
    return NextResponse.json(magazines)
  } catch (error) {
    console.error("Error fetching magazines:", error)
    return NextResponse.json({ error: "Failed to fetch magazines" }, { status: 500 })
  }
}

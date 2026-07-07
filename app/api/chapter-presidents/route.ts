import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import ChapterPresident from "@/models/ChapterPresident"

export async function GET() {
  try {
    await connectToDatabase()

    const presidents = await ChapterPresident.find({}).sort({ chapter: 1 }).lean()

    return NextResponse.json(presidents)
  } catch (error) {
    console.error("Error fetching chapter presidents:", error)
    return NextResponse.json({ error: "Failed to fetch chapter presidents" }, { status: 500 })
  }
}

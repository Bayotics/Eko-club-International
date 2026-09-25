import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Memorial from "@/models/Memorial"

export async function GET() {
  try {
    await connectToDatabase()
    const memorials = await Memorial.find({}).select("-biography -gallery").sort({ dateOfPassing: -1 }).lean()
    return NextResponse.json(memorials)
  } catch (error) {
    console.error("Error fetching memorials:", error)
    return NextResponse.json({ error: "Failed to fetch memorials" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Event from "@/models/Event"

export async function GET(request: Request) {
  try {
    await connectToDatabase()

    const upcomingOnly = new URL(request.url).searchParams.get("upcoming") === "true"

    if (upcomingOnly) {
      // Event dates are stored as UTC midnight of the chosen day, so compare against today's UTC midnight.
      const startOfToday = new Date()
      startOfToday.setUTCHours(0, 0, 0, 0)
      const events = await Event.find({ date: { $gte: startOfToday } }).sort({ date: 1 }).lean()
      return NextResponse.json(events)
    }

    const events = await Event.find({}).sort({ date: -1 }).lean()
    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      { error: "Failed to fetch events", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

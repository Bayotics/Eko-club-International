import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"
import Event from "@/models/Event"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 })
    }

    await connectToDatabase()
    const event = await Event.findById(id).lean()

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

import { connectToDatabase } from "@/lib/mongodb"
import Event from "@/models/Event"

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    // Connect to database
    await connectToDatabase()

    let events

    // If user is logged in, check their role
    if (token) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
        events = await Event.find({}).sort({ date: 1 }).lean()
      } catch (error) {
          console.log(error)
      }
    } else {
      // If no token, return only public events
        console.log("Error fetching Events")
    }

    // Filter out past events
    const currentDate = new Date()
    const upcomingEvents = events.filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate >= currentDate
    })

    return NextResponse.json(upcomingEvents)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      { error: "Failed to fetch events", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

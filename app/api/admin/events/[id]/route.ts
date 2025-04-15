import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

import { connectToDatabase } from "@/lib/mongodb"
import Event from "@/models/Event"
// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Helper function to verify admin token
async function verifyAdminToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return { isAdmin: false, error: "Authentication required", status: 401 }
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    const userRole = payload.role || (payload.user && payload.user.role)

    if (userRole !== "admin") {
      return { isAdmin: false, error: "Admin access required", status: 403 }
    }

    return { isAdmin: true }
  } catch (error) {
    console.error("Token verification error:", error)
    return { isAdmin: false, error: "Invalid token", status: 401 }
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verify admin token
    const tokenVerification = await verifyAdminToken()
    if (!tokenVerification.isAdmin) {
      return NextResponse.json({ error: tokenVerification.error }, { status: tokenVerification.status })
    }

    const eventId = params.id

    await connectToDatabase()

    const event = await Event.findById(eventId).lean()

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json(
      { error: "Failed to fetch event", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verify admin token
    const tokenVerification = await verifyAdminToken()
    if (!tokenVerification.isAdmin) {
      return NextResponse.json({ error: tokenVerification.error }, { status: tokenVerification.status })
    }

    const eventId = params.id

    // Connect to database
    await connectToDatabase()

    const updatedData = await request.json()

    const event = await Event.findByIdAndUpdate(eventId, updatedData, { new: true, runValidators: true }).lean()

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json(
      { error: "Failed to update event", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verify admin token
    const tokenVerification = await verifyAdminToken()
    if (!tokenVerification.isAdmin) {
      return NextResponse.json({ error: tokenVerification.error }, { status: tokenVerification.status })
    }

    const eventId = params.id

    // Connect to database
    await connectToDatabase()

    const event = await Event.findByIdAndDelete(eventId)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json(
      { error: "Failed to delete event", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

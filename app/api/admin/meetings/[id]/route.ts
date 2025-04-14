import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

import { connectToDatabase } from "@/lib/mongodb"
import Meeting from "@/models/Meeting"

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

    // Get meeting ID from params
    const meetingId = params.id

    // Connect to database
    await connectToDatabase()

    // Find meeting by ID
    const meeting = await Meeting.findById(meetingId).lean()

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 })
    }

    return NextResponse.json(meeting)
  } catch (error) {
    console.error("Error fetching meeting:", error)
    return NextResponse.json(
      { error: "Failed to fetch meeting", details: error instanceof Error ? error.message : String(error) },
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

    // Get meeting ID from params
    const meetingId = params.id

    // Connect to database
    await connectToDatabase()

    // Get updated meeting data from request body
    const updatedData = await request.json()

    // Update meeting
    const meeting = await Meeting.findByIdAndUpdate(meetingId, updatedData, { new: true, runValidators: true }).lean()

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 })
    }

    return NextResponse.json(meeting)
  } catch (error) {
    console.error("Error updating meeting:", error)
    return NextResponse.json(
      { error: "Failed to update meeting", details: error instanceof Error ? error.message : String(error) },
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

    // Get meeting ID from params
    const meetingId = params.id

    // Connect to database
    await connectToDatabase()

    // Delete meeting
    const meeting = await Meeting.findByIdAndDelete(meetingId)

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Meeting deleted successfully" })
  } catch (error) {
    console.error("Error deleting meeting:", error)
    return NextResponse.json(
      { error: "Failed to delete meeting", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

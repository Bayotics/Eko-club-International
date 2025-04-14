import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

import { connectToDatabase } from "@/lib/mongodb"
import Meeting from "@/models/Meeting"

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    // Connect to database
    await connectToDatabase()

    // Get meeting ID from params
    const meetingId = params.id

    // Find meeting by ID
    const meeting = await Meeting.findById(meetingId).lean()
    console.log(meeting)
    console.log(meetingId)

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 })
    }

    // Check if user has permission to view this meeting
    if (token) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
        const userRole = payload.role || (payload.user && payload.user.role)

        // Admin can view all meetings
        if (userRole === "admin") {
          return NextResponse.json(meeting)
        }

        // Exco can view exco, member, and public meetings
        if (
          userRole === "exco" &&
          (meeting.meantFor.includes("excos") ||
            meeting.meantFor.includes("members") ||
            meeting.meantFor.includes("public"))
        ) {
          return NextResponse.json(meeting)
        }

        // Regular member can view member and public meetings
        if (meeting.meantFor.includes("members") || meeting.meantFor.includes("public")) {
          return NextResponse.json(meeting)
        }

        // If none of the above, user doesn't have permission
        return NextResponse.json({ error: "You don't have permission to view this meeting" }, { status: 403 })
      } catch (error) {
        // If token verification fails, check if meeting is public
        if (meeting.meantFor.includes("public")) {
          return NextResponse.json(meeting)
        }
        return NextResponse.json({ error: "Authentication required to view this meeting" }, { status: 401 })
      }
    } else {
      // If no token, check if meeting is public
      if (meeting.meantFor.includes("public")) {
        return NextResponse.json(meeting)
      }
      return NextResponse.json({ error: "Authentication required to view this meeting" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error fetching meeting:", error)
    return NextResponse.json(
      { error: "Failed to fetch meeting", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

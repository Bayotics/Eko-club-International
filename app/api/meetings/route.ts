import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

import { connectToDatabase } from "@/lib/mongodb"
import Meeting from "@/models/Meeting"

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    // Connect to database
    await connectToDatabase()

    // First, get all meetings from the database
    const allMeetings = await Meeting.find({}).sort({ date: 1 }).lean()

    let filteredMeetings = []

    // If user is logged in, check their role and filter meetings accordingly
    if (token) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
        const userRole = payload.role || (payload.user && payload.user.role)

        // If admin, return all meetings
        if (userRole === "admin") {
          filteredMeetings = allMeetings
        }
        // If exco, return exco, member, and public meetings
        else if (userRole === "exco") {
          filteredMeetings = allMeetings.filter(
            (meeting) =>
              meeting.meantFor &&
              (meeting.meantFor.includes("excos") ||
                meeting.meantFor.includes("members") ||
                meeting.meantFor.includes("public")),
          )
        }
        // If regular member, return member and public meetings
        else {
          filteredMeetings = allMeetings.filter(
            (meeting) =>
              meeting.meantFor && (meeting.meantFor.includes("members") || meeting.meantFor.includes("public")),
          )
        }
      } catch (error) {
        console.error("Token verification error:", error)
        // If token verification fails, return only public meetings
        filteredMeetings = allMeetings.filter((meeting) => meeting.meantFor && meeting.meantFor.includes("public"))
      }
    } else {
      // If no token, return only public meetings
      filteredMeetings = allMeetings.filter((meeting) => meeting.meantFor && meeting.meantFor.includes("public"))
    }

    // COMPLETELY NEW APPROACH: Don't filter by date at all for now
    // Just return all meetings that match the role criteria
    // This will ensure we're not accidentally filtering out meetings due to timezone issues

    return NextResponse.json(filteredMeetings)
  } catch (error) {
    console.error("Error fetching meetings:", error)
    return NextResponse.json(
      { error: "Failed to fetch meetings", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

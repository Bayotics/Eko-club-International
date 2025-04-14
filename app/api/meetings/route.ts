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

    let meetings

    // If user is logged in, check their role
    if (token) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
        const userRole = payload.role || (payload.user && payload.user.role)

        // If admin, return all meetings
        if (userRole === "admin") {
          meetings = await Meeting.find({}).sort({ date: 1 }).lean()
        }
        // If exco, return exco and member meetings
        else if (userRole === "exco") {
          meetings = await Meeting.find({
            meantFor: { $in: ["excos", "members", "public"] },
          })
            .sort({ date: 1 })
            .lean()
        }
        // If regular member, return member meetings
        else {
          meetings = await Meeting.find({
            meantFor: { $in: ["members", "public"] },
          })
            .sort({ date: 1 })
            .lean()
        }
      } catch (error) {
        // If token verification fails, return only public meetings
        meetings = await Meeting.find({
          meantFor: "public",
        })
          .sort({ date: 1 })
          .lean()
      }
    } else {
      // If no token, return only public meetings
      meetings = await Meeting.find({
        meantFor: "public",
      })
        .sort({ date: 1 })
        .lean()
    }

    // Filter out past meetings
    const currentDate = new Date()
    const upcomingMeetings = meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.date)
      return meetingDate >= currentDate
    })

    return NextResponse.json(upcomingMeetings)
  } catch (error) {
    console.error("Error fetching meetings:", error)
    return NextResponse.json(
      { error: "Failed to fetch meetings", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

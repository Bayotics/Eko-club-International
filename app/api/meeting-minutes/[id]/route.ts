import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

import { connectToDatabase } from "@/lib/mongodb"
import Minute from "@/models/Minute"

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    // Connect to database
    await connectToDatabase()

    // Get minute ID from params
    const minuteId = params.id

    // Find minute by ID
    const minute = await Minute.findById(minuteId).lean()
    console.log(minute)
    console.log(minuteId)

    if (!minute) {
      return NextResponse.json({ error: "Minute not found" }, { status: 404 })
    }

    // Check if user has permission to view this minute
    if (token) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
        const userRole = payload.role || (payload.user && payload.user.role)

        // Admin can view all minutes
        if (userRole === "admin") {
          return NextResponse.json(minute)
        }

        // Exco can view exco, member, and public minutes
        if (
          userRole === "exco" &&
          (minute.meantFor.includes("excos") ||
            minute.meantFor.includes("members") ||
            minute.meantFor.includes("public"))
        ) {
          return NextResponse.json(minute)
        }

        // Regular member can view member and public minutes
        if (minute.meantFor.includes("members") || minute.meantFor.includes("public")) {
          return NextResponse.json(minute)
        }

        // If none of the above, user doesn't have permission
        return NextResponse.json({ error: "You don't have permission to view this minute" }, { status: 403 })
      } catch (error) {
        // If token verification fails, check if minute is public
        if (minute.meantFor.includes("public")) {
          return NextResponse.json(minute)
        }
        return NextResponse.json({ error: "Authentication required to view this minute" }, { status: 401 })
      }
    } else {
      // If no token, check if minute is public
      if (minute.meantFor.includes("public")) {
        return NextResponse.json(minute)
      }
      return NextResponse.json({ error: "Authentication required to view this minute" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error fetching minute:", error)
    return NextResponse.json(
      { error: "Failed to fetch minute", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

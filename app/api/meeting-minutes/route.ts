import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

import { connectToDatabase } from "@/lib/mongodb"
import Minute from "@/models/Minute"

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    // Connect to database
    await connectToDatabase()

    let minutes

    // If user is logged in, check their role
    if (token) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
        const userRole = payload.role || (payload.user && payload.user.role)

        // If admin, return all minutes
        if (userRole === "admin") {
          minutes = await Minute.find({}).sort({ date: 1 }).lean()
        }
        // If exco, return exco and member minutes
        else if (userRole === "exco") {
          minutes = await Minute.find({
            meantFor: { $in: ["excos", "members", "public"] },
          })
            .sort({ date: 1 })
            .lean()
        }
        // If regular member, return member minutes
        else {
          minutes = await Minute.find({
            meantFor: { $in: ["members", "public"] },
          })
            .sort({ date: 1 })
            .lean()
        }
      } catch (error) {
        // If token verification fails, return only public minutes
        minutes = await Minute.find({
          meantFor: "public",
        })
          .sort({ date: 1 })
          .lean()
      }
    } else {
      // If no token, return only public minutes
      minutes = await Minute.find({
        meantFor: "public",
      })
        .sort({ date: 1 })
        .lean()
    }

    // Filter out past minutes

    return NextResponse.json(minutes)
  } catch (error) {
    console.error("Error fetching minutes:", error)
    return NextResponse.json(
      { error: "Failed to fetch minutes", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

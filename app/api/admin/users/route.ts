import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/user"

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify token
    let userRole
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))

      // Check if user is admin
      userRole = payload.role || (payload.user && payload.user.role)

      if (userRole !== "admin") {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 })
      }
    } catch (error) {
      console.error("Token verification error:", error)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Connect to database
    await connectToDatabase()

    // Fetch all users using Mongoose model
    const users = await User.find({}).select("-password").lean()

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

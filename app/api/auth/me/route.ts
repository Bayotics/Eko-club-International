import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/user"

export async function GET(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = cookies().get("token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as { userId: string }

    // Connect to the database
    await connectToDatabase()

    // Find the user
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Return the user data
    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ success: false, message: "Failed to authenticate" }, { status: 401 })
  }
}

import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/user"
import { verifyJwtToken } from "@/lib/jwt"

export async function GET(request: Request) {
  try {
    // Verify admin access
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyJwtToken(token)
    const userRole = payload.role || (payload.user && payload.user.role)

    if (userRole !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await connectToDatabase()

    // Find all pending users
    const pendingUsers = await User.find({
      role: "pending",
      isVerified: true,
    }).sort({ createdAt: -1 })

    return NextResponse.json({ users: pendingUsers })
  } catch (error) {
    console.error("Error fetching pending users:", error)
    return NextResponse.json({ message: "Failed to fetch pending users" }, { status: 500 })
  }
}

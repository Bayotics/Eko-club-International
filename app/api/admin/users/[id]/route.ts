import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/user"

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get token from cookies
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify token
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))

      // Check if user is admin
      const userRole = payload.role || (payload.user && payload.user.role)

      if (userRole !== "admin") {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 })
      }
    } catch (error) {
      console.error("Token verification error:", error)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get user ID from params
    const userId = params.id

    // Get update data from request body
    const updateData = await request.json()

    // Only allow specific fields to be updated
    const allowedFields = ["fullName", "role", "membershipId"]
    const filteredUpdateData: Record<string, any> = {}

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredUpdateData[field] = updateData[field]
      }
    }

    // Connect to database
    await connectToDatabase()

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: filteredUpdateData },
      { new: true, runValidators: true },
    ).select("-password")

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Failed to update user", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/user"

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log("PATCH /api/admin/users/[id] - Starting request for user:", params.id)

    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      console.log("No token found in cookies")
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify token
    let decoded
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
      decoded = payload
      console.log("Token verified successfully")
    } catch (error) {
      console.error("Token verification error:", error)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Check if user is admin
    const userRole = decoded.role || (decoded.user && decoded.user.role)
    if (userRole !== "admin") {
      console.log("User is not admin:", userRole)
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Parse request body
    let body
    try {
      body = await request.json()
      console.log("Request body parsed:", body)
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Get the admin user's full details including chapter
    const adminUser = await User.findById(decoded.userId).select("email role chapterName")
    if (!adminUser) {
      console.log("Admin user not found")
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 })
    }

    const adminEmail = adminUser.email
    const adminChapter = adminUser.chapterName

    // Get the user to be updated
    const userToUpdate = await User.findById(params.id)
    if (!userToUpdate) {
      console.log("User to update not found")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check permissions
    if (adminEmail !== "debozki@gmail.com") {
      // Regular admin can only edit users in their chapter
      if (userToUpdate.chapterName !== adminChapter) {
        console.log("Admin cannot edit user from different chapter")
        return NextResponse.json({ error: "You can only edit users from your chapter" }, { status: 403 })
      }

      // Regular admin cannot edit debozki@gmail.com
      if (userToUpdate.email === "debozki@gmail.com") {
        console.log("Regular admin cannot edit super admin")
        return NextResponse.json({ error: "You don't have permission to edit this user" }, { status: 403 })
      }
    }

    // Only allow specific fields to be updated (email is excluded)
    const allowedFields = ["fullName", "phone", "membershipId", "role"]
    const updateData: Record<string, any> = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    // Validate required fields if they're being updated
    if (updateData.fullName !== undefined && !updateData.fullName.trim()) {
      return NextResponse.json({ error: "Full name cannot be empty" }, { status: 400 })
    }

    if (updateData.phone !== undefined && !updateData.phone.trim()) {
      return NextResponse.json({ error: "Phone number cannot be empty" }, { status: 400 })
    }

    if (updateData.membershipId !== undefined && !updateData.membershipId.trim()) {
      return NextResponse.json({ error: "Membership ID cannot be empty" }, { status: 400 })
    }

    // Check for duplicate phone number (if phone is being updated)
    if (updateData.phone && updateData.phone !== userToUpdate.phone) {
      const existingUserByPhone = await User.findOne({ phone: updateData.phone, _id: { $ne: params.id } })
      if (existingUserByPhone) {
        return NextResponse.json({ error: "Phone number already exists" }, { status: 400 })
      }
    }

    // Check for duplicate membership ID (if membershipId is being updated)
    if (updateData.membershipId && updateData.membershipId !== userToUpdate.membershipId) {
      const existingUserByMembershipId = await User.findOne({
        membershipId: updateData.membershipId,
        _id: { $ne: params.id },
      })
      if (existingUserByMembershipId) {
        return NextResponse.json({ error: "Membership ID already exists" }, { status: 400 })
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken -emailVerificationExpire")

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("User updated successfully:", updatedUser._id)

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

import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/user"
import jwt from "jsonwebtoken"

export async function PUT(request: NextRequest) {
  try {
    // Get the token from the Authorization header
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Connect to the database
    await connectToDatabase()

    // Get the user data from the request body
    const userData = await request.json()

    // Find the user and update their profile
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      {
        $set: {
          fullName: userData.fullName,
          email: userData.email,
        //   phone: userData.phone,
        //   address: userData.address,
        //   city: userData.city,
        //   state: userData.state,
        //   country: userData.country,
        //   bio: userData.bio,
          updatedAt: new Date(),
        },
      },
      { new: true, runValidators: true },
    ).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user,
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

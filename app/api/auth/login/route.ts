import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/user"

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request) {
  try {
    // Parse request body
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: "Invalid email" }, { status: 401 })
    }

    // Check if user is blocked
    if (user.role === "blocked") {
      return NextResponse.json(
        { message: "Your account has been blocked. Please contact an administrator." },
        { status: 403 },
      )
    }

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json({ message: "Please verify your email before logging in." }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 })
    }

    // Check if user has a phone number, if not, add a default one
    // This handles users created before the phone field was required
    if (!user.phone) {
      // Update the user document directly without triggering validation
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            phone: "Not provided",
            lastLogin: new Date(),
          },
        },
        { runValidators: false },
      )
    } else {
      // Update last login time
      await User.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } }, { runValidators: false })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    // Return user data and token (without password)
    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      chapterName: user.chapterName,
      membershipId: user.membershipId,
      role: user.role,
      isVerified: user.isVerified,
    }

    // Set cookie with token
    const response = NextResponse.json({ message: "Login successful", user: userResponse, token }, { status: 200 })

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "An error occurred during login" }, { status: 500 })
  }
}

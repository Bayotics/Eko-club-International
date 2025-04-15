import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import User from "@/models/user"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    // Parse request body
    const { fullName, email, password, chapterName, membershipId } = await request.json()

    // Validate required fields
    if (!fullName || !email || !password) {
      return NextResponse.json({ message: "Name, email and password are required" }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      chapterName: chapterName || "",
      membershipId: membershipId || "",
      role: "member", // Default role
      createdAt: new Date(),
    })

    await newUser.save()

    // Return success response (without password)
    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          chapterName: newUser.chapterName,
          membershipId: newUser.membershipId,
          role: newUser.role,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })
  }
}

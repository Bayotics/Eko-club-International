import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import User from "@/models/user"
import { connectToDatabase } from "@/lib/mongodb"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    // Parse request body
    const { fullName, email, password, chapterName, phone, profileImage, membershipId } = await request.json()

    // Validate required fields
    if (!fullName || !email || !password || !phone) {
      return NextResponse.json({ message: "Name, email, phone, and password are required" }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    const existingPhone = await User.findOne({ phone })
    if (existingPhone) {
      return NextResponse.json({ message: "User with this phone number already exists!" }, { status: 409 })
    }

    // Check if user is blocked
    const blockedUser = await User.findOne({ email, role: "blocked" })
    if (blockedUser) {
      return NextResponse.json(
        { message: "This email has been blocked. Please contact an administrator." },
        { status: 403 },
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString("hex")
    const verificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create temporary user object (not saved to DB yet)
    const tempUser = {
      fullName,
      email,
      phone,
      password: hashedPassword,
      chapterName: chapterName || "",
      role: "pending", // Default role is now pending
      profileImage,
      createdAt: new Date(),
      emailVerificationToken: verificationToken,
      emailVerificationExpire: verificationExpire,
      isVerified: false,
      membershipId
    }

    // Send verification email
    await sendVerificationEmail(email, fullName, verificationToken)

    // Store user data in temporary storage (we'll use the token as the key)
    // In a real application, you might want to use Redis or another temporary storage
    // For simplicity, we'll save to the database but mark as unverified
    const newUser = new User(tempUser)
    await newUser.save()

    // Return success response
    return NextResponse.json(
      {
        message: "Registration initiated. Please check your email to verify your account. If you do not receive anything in your inbox, check your spam folder",
        verificationSent: true,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })
  }
}

async function sendVerificationEmail(email: string, name: string, token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ekoclub.org"
  const emailFrom = process.env.EMAIL_FROM || "noreply@ekoclub.org"
  const verificationUrl = `${appUrl}/verify-email?token=${token}`

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Eko_club_logo-removebg-preview-SAUiEpYRjmONtSd1YKYL42qyW13AzD.png" alt="Eko Club Logo" style="max-width: 150px;">
        </div>
        <h2 style="color: #C8A97E; text-align: center;">Verify Your Email Address</h2>
        <p>Dear ${name},</p>
        <p>Thank you for registering with Eko Club International. To complete your registration, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #C8A97E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p>This link will expire in 24 hours. If you did not create an account, please ignore this email.</p>
        <p>Best regards,<br>Eko Club International Team</p>
      </div>
  `

  try {
    const data = await resend.emails.send({
      from: `Eko Club <${emailFrom}>`,
      to: email,
      subject: "Verify Your Email - Eko Club International",
      html: htmlBody,
    })

    console.log("Resend API success:", data)
  } catch (error) {
    console.error("Resend email failed:", error)
    throw error
  }
}


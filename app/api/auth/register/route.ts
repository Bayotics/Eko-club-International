import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import User from "@/models/user"
import { connectToDatabase } from "@/lib/mongodb"
import { Resend } from "resend"

// Resend configuration with error handling
const RESEND_API_KEY = process.env.RESEND_API_KEY
let resend = null

if (RESEND_API_KEY) {
  try {
    resend = new Resend(RESEND_API_KEY)
  } catch (error) {
    console.error("Failed to initialize Resend:", error)
  }
} else {
  console.warn("RESEND_API_KEY environment variable is not set")
}

export async function POST(request: Request) {
  try {
    console.log("Registration request received")

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      console.error("Failed to parse request body:", error)
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
    }

    const { name, fullName, email, password, chapterName, phone, profileImage, recaptchaToken } = body
    const userName = name || fullName

    console.log("Registration attempt for email:", email)
    console.log("reCAPTCHA token received:", !!recaptchaToken)

    // Validate required fields
    if (!userName || !email || !password) {
      console.log("Missing required fields:", { userName: !!userName, email: !!email, password: !!password })
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    // Verify reCAPTCHA token if provided and secret key is configured
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY
    if (recaptchaToken && recaptchaSecretKey) {
      console.log("Verifying reCAPTCHA token...")
      try {
        const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            secret: recaptchaSecretKey,
            response: recaptchaToken,
          }),
        })

        const recaptchaResult = await recaptchaResponse.json()
        console.log("reCAPTCHA verification result:", recaptchaResult)

        if (!recaptchaResult.success) {
          console.error("reCAPTCHA verification failed:", recaptchaResult["error-codes"])
          return NextResponse.json(
            {
              message: "reCAPTCHA verification failed. Please try again.",
            },
            { status: 400 },
          )
        }

        console.log("reCAPTCHA verification successful")
      } catch (error) {
        console.error("Error verifying reCAPTCHA:", error)
        return NextResponse.json({ message: "reCAPTCHA verification failed" }, { status: 500 })
      }
    } else if (recaptchaToken && !recaptchaSecretKey) {
      console.warn("reCAPTCHA token provided but secret key not configured")
    } else if (!recaptchaToken && recaptchaSecretKey) {
      console.log("reCAPTCHA secret key configured but no token provided")
      return NextResponse.json({ message: "reCAPTCHA verification is required" }, { status: 400 })
    } else {
      console.log("reCAPTCHA not configured, proceeding without verification")
    }

    // Connect to database
    try {
      await connectToDatabase()
      console.log("Database connected successfully")
    } catch (error) {
      console.error("Database connection failed:", error)
      return NextResponse.json({ message: "Database connection failed" }, { status: 500 })
    }

    // Check if user already exists
    try {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        console.log("User already exists with email:", email)
        return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
      }

      // Only check phone if it's provided
      if (phone) {
        const existingPhone = await User.findOne({ phone })
        if (existingPhone) {
          console.log("User already exists with phone:", phone)
          return NextResponse.json({ message: "User with this phone number already exists!" }, { status: 409 })
        }
      }

      // Check if user is blocked
      const blockedUser = await User.findOne({ email, role: "blocked" })
      if (blockedUser) {
        console.log("Blocked user attempted registration:", email)
        return NextResponse.json(
          { message: "This email has been blocked. Please contact an administrator." },
          { status: 403 },
        )
      }
    } catch (error) {
      console.error("Error checking existing users:", error)
      return NextResponse.json({ message: "Error checking user existence" }, { status: 500 })
    }

    // Hash password
    let hashedPassword
    try {
      hashedPassword = await bcrypt.hash(password, 10)
      console.log("Password hashed successfully")
    } catch (error) {
      console.error("Password hashing failed:", error)
      return NextResponse.json({ message: "Password processing failed" }, { status: 500 })
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString("hex")
    const verificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user object
    const userData = {
      fullName: userName,
      email,
      phone: phone || "Not provided",
      password: hashedPassword,
      chapterName: chapterName || "",
      role: "pending",
      profileImage: profileImage || "",
      createdAt: new Date(),
      emailVerificationToken: verificationToken,
      emailVerificationExpire: verificationExpire,
      isVerified: false,
    }

    // Save user to database
    let newUser
    try {
      newUser = new User(userData)
      await newUser.save()
      console.log("User saved to database successfully")
    } catch (error) {
      console.error("Error saving user to database:", error)
      return NextResponse.json({ message: "Failed to create user account" }, { status: 500 })
    }

    // Send verification email
    try {
      await sendVerificationEmail(email, userName, verificationToken)
      console.log("Verification email sent successfully")
    } catch (error) {
      console.error("Failed to send verification email:", error)
      // Don't fail the registration if email fails, but log it
      console.log("Registration completed but email failed to send")
    }

    // Return success response
    return NextResponse.json(
      {
        message: "Registration initiated. Please check your email to verify your account.",
        verificationSent: true,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    console.error("Error stack:", error.stack)
    return NextResponse.json(
      {
        message: "An error occurred during registration",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}

async function sendVerificationEmail(email: string, name: string, token: string) {
  if (!resend) {
    console.warn("Resend not configured, skipping email send")
    throw new Error("Email service is not configured")
  }

  const appUrl = "https://eko-club-international.vercel.app"
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

  const textBody = `
    Dear ${name},

    Thank you for registering with Eko Club International. To complete your registration, please verify your email address by visiting the following link:

    ${verificationUrl}

    This link will expire in 24 hours. If you did not create an account, please ignore this email.

    Best regards,
    Eko Club International Team
  `

  try {
    const data = await resend.emails.send({
      from: `Eko Club <${emailFrom}>`,
      to: email,
      subject: "Verify Your Email - Eko Club International",
      html: htmlBody,
      text: textBody,
    })

    console.log("Resend API success:", data)
    return data
  } catch (error) {
    console.error("Resend email failed:", error)
    throw error
  }
}

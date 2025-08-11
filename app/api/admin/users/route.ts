import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/user"
import { Resend } from "resend"

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret"

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Generate 10-digit alphanumeric password
const generatePassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let password = ""
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

// Send welcome email with password
const sendWelcomeEmail = async (
  email: string,
  fullName: string,
  password: string,
  chapterName: string,
  membershipId: string,
) => {
  try {
    console.log("Starting email send process...")
    console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY)

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured")
      throw new Error("Email service not configured - RESEND_API_KEY missing")
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const loginUrl = `${appUrl}/login`

    console.log("Preparing email content for:", email)

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Eko Club International</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Eko_club_logo-removebg-preview-SAUiEpYRjmONtSd1YKYL42qyW13AzD.png" alt="Eko Club International" style="max-width: 200px; height: auto;">
          </div>
          
          <div style="background: linear-gradient(135deg, #C8A97E 0%, #B8956E 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Welcome to Eko Club International!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your account has been created successfully</p>
          </div>

          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #C8A97E; margin-top: 0; margin-bottom: 20px; font-size: 20px;">Hello ${fullName},</h2>
            <p style="margin-bottom: 15px;">Your administrator has created an account for you on the Eko Club International platform. You can now access all member features and stay connected with your chapter.</p>
            
            <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #C8A97E; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333; font-size: 16px;">Your Login Credentials:</h3>
              <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 8px 0;"><strong>Chapter:</strong> ${chapterName}</p>
              <p style="margin: 8px 0;"><strong>Membership ID:</strong> ${membershipId}</p>
              <p style="margin: 8px 0;"><strong>Temporary Password:</strong> 
                <span style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-family: 'Courier New', monospace; font-weight: bold; color: #495057;">${password}</span>
              </p>
            </div>
          </div>

          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="margin-top: 0; color: #856404; font-size: 16px;">🔒 Important Security Notice</h3>
            <p style="margin-bottom: 0; color: #856404;">For your security, please change your password immediately after your first login. This temporary password should not be shared with anyone.</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" style="background: linear-gradient(135deg, #C8A97E 0%, #B8956E 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(200, 169, 126, 0.3);">
              Login to Your Account
            </a>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 30px;">
            <h3 style="color: #C8A97E; margin-top: 0; font-size: 16px;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Log in using your credentials above</li>
              <li style="margin-bottom: 8px;">Update your password and complete your profile</li>
              <li style="margin-bottom: 8px;">Explore member features and connect with your chapter</li>
              <li style="margin-bottom: 0;">Stay updated with events and announcements</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <p style="color: #6c757d; font-size: 14px; margin-bottom: 10px;">
              Need help? Contact your chapter administrator or visit our support center.
            </p>
            <p style="color: #6c757d; font-size: 14px; margin: 0;">
              <strong>Eko Club International</strong><br>
              Connecting Eko people worldwide
            </p>
          </div>
        </body>
      </html>
    `

    const textContent = `
Welcome to Eko Club International!

Hello ${fullName},

Your administrator has created an account for you on the Eko Club International platform.

Your Login Credentials:
- Email: ${email}
- Chapter: ${chapterName}
- Membership ID: ${membershipId}
- Temporary Password: ${password}

IMPORTANT SECURITY NOTICE:
For your security, please change your password immediately after your first login. This temporary password should not be shared with anyone.

Login at: ${loginUrl}

What's Next?
1. Log in using your credentials above
2. Update your password and complete your profile
3. Explore member features and connect with your chapter
4. Stay updated with events and announcements

Need help? Contact your chapter administrator or visit our support center.

Best regards,
Eko Club International Team
Connecting Eko people worldwide
    `

    console.log("Sending email via Resend...")
    const result = await resend.emails.send({
      from: "Eko Club International <noreply@ekoclub.org>",
      to: [email],
      subject: "Welcome to Eko Club International - Your Account is Ready!",
      html: htmlContent,
      text: textContent,
    })

    console.log("Email sent successfully:", result)
    return { success: true, data: result }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown email error",
    }
  }
}

export async function GET() {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: string
    }

    console.log("Payload log", decoded)

    // Connect to database
    await connectToDatabase()

    // Get the admin user's full details including chapter
    const adminUser = await User.findById(decoded.userId).select("email role chapterName")

    if (!adminUser) {
      return NextResponse.json({ message: "Admin user not found" }, { status: 404 })
    }

    const userEmail = adminUser.email
    const userRole = adminUser.role
    const userChapter = adminUser.chapterName

    console.log("Admin accessing users:", {
      userEmail,
      userRole,
      userChapter,
    })

    // Check if user is admin
    if (userRole !== "admin") {
      return NextResponse.json({ message: "Access denied. Admin role required." }, { status: 403 })
    }

    // Build query based on admin's chapter
    let query = {}

    if (userEmail === "debozki@gmail.com") {
      // Super admin can see all users
      query = {}
      console.log("Super admin - showing all users")
    } else if (userChapter) {
      // Regular admin can only see users from their chapter
      query = { chapterName: userChapter }
      console.log(`Regular admin - showing users from chapter: ${userChapter}`)
    } else {
      // Admin without chapter sees no users
      query = { chapterName: "INVALID_CHAPTER_THAT_DOES_NOT_EXIST" }
      console.log("Admin without chapter - showing no users")
    }

    // Fetch users based on query
    const users = await User.find(query).select("-password").sort({ createdAt: -1 })

    console.log(`Found ${users.length} users for admin ${userEmail}`)

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ message: "Error fetching users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log("POST request received for user creation")

    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      console.log("No authentication token found")
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: string
    }

    console.log("Token decoded successfully:", { userId: decoded.userId, email: decoded.email, role: decoded.role })

    // Connect to database
    await connectToDatabase()
    console.log("Database connected successfully")

    // Get the admin user's full details including chapter
    const adminUser = await User.findById(decoded.userId).select("email role chapterName")

    if (!adminUser) {
      console.log("Admin user not found in database")
      return NextResponse.json({ message: "Admin user not found" }, { status: 404 })
    }

    const userEmail = adminUser.email
    const userRole = adminUser.role
    const userChapter = adminUser.chapterName

    console.log("Admin creating user:", {
      userEmail,
      userRole,
      userChapter,
    })

    // Check if user is admin
    if (userRole !== "admin") {
      console.log("User is not admin, access denied")
      return NextResponse.json({ message: "Access denied. Admin role required." }, { status: 403 })
    }

    // Check if admin has a chapter (except super admin)
    if (userEmail !== "debozki@gmail.com" && !userChapter) {
      console.log("Admin has no chapter assigned")
      return NextResponse.json({ message: "Admin must have a chapter assigned to create users" }, { status: 400 })
    }

    // Parse request body
    let body
    try {
      body = await request.json()
      console.log("Request body parsed:", body)
    } catch (error) {
      console.log("Invalid JSON in request body")
      return NextResponse.json({ message: "Invalid JSON in request body" }, { status: 400 })
    }

    const { fullName, email, phone, membershipId, role = "member" } = body

    // Validate required fields
    if (!fullName || !email || !phone || !membershipId) {
      console.log("Missing required fields:", {
        fullName: !!fullName,
        email: !!email,
        phone: !!phone,
        membershipId: !!membershipId,
      })
      return NextResponse.json(
        {
          message: "Full name, email, phone, and membership ID are required",
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("Invalid email format:", email)
      return NextResponse.json({ message: "Please provide a valid email address" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }, { membershipId }],
    })

    if (existingUser) {
      console.log("User already exists:", {
        email: existingUser.email,
        phone: existingUser.phone,
        membershipId: existingUser.membershipId,
      })
      if (existingUser.email === email) {
        return NextResponse.json({ message: "User with this email already exists" }, { status: 400 })
      }
      if (existingUser.phone === phone) {
        return NextResponse.json({ message: "User with this phone number already exists" }, { status: 400 })
      }
      if (existingUser.membershipId === membershipId) {
        return NextResponse.json({ message: "User with this membership ID already exists" }, { status: 400 })
      }
    }

    // Generate 10-digit alphanumeric password
    const tempPassword = generatePassword()
    const hashedPassword = await bcrypt.hash(tempPassword, 12)

    console.log("Generated temporary password:", tempPassword)

    // Determine chapter for new user
    const newUserChapter = userEmail === "debozki@gmail.com" ? userChapter || "Default" : userChapter

    console.log("Creating user with chapter:", newUserChapter)

    // Create new user
    const newUser = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
      chapterName: newUserChapter,
      membershipId,
      isVerified: true, // Auto-verify admin-created users
      isActive: true, // Auto-activate admin-created users
      createdAt: new Date(),
    })

    await newUser.save()
    console.log("User created successfully in database with ID:", newUser._id)

    // Send welcome email with password
    console.log("Attempting to send welcome email to:", email)
    const emailResult = await sendWelcomeEmail(email, fullName, tempPassword, newUserChapter, membershipId)

    console.log("Email sending result:", emailResult)

    // Return success response
    const response = {
      message: "User created successfully",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        chapterName: newUser.chapterName,
        membershipId: newUser.membershipId,
        isVerified: newUser.isVerified,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
      },
      tempPassword,
      emailSent: emailResult.success,
      emailError: emailResult.success ? null : emailResult.error,
    }

    console.log("Sending response:", { ...response, tempPassword: "[HIDDEN]" })
    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Invalid authentication token" }, { status: 401 })
    }

    if (error.name === "TokenExpiredError") {
      return NextResponse.json({ message: "Authentication token expired" }, { status: 401 })
    }

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return NextResponse.json(
        {
          message: `User with this ${field} already exists`,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        message: "Error creating user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

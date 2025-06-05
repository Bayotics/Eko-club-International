import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/user"
import { Resend } from "resend"

// Resend configuration
const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ message: "Verification token is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Find user with this verification token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpire: { $gt: Date.now() },
    })

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired verification token", success: false }, { status: 400 })
    }

    // Mark user as verified
    user.isVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpire = undefined
    await user.save()

    // Send notification to all admins
    await notifyAdmins(user)

    return NextResponse.json({
      message: "Email verified successfully. Your account is now pending admin approval.",
      success: true,
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ message: "An error occurred during verification", success: false }, { status: 500 })
  }
}

// Helper function to notify admins about new user registration
async function notifyAdmins(newUser) {
  try {
    await connectToDatabase()

    // Find all admin users
    const adminUsers = await User.find({ role: "admin" })

    if (!adminUsers || adminUsers.length === 0) {
      console.log("No admin users found to notify")
      return
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ekoclub.org"
    const emailFrom = process.env.EMAIL_FROM || "noreply@ekoclub.org"
    const pendingUsersUrl = `${appUrl}/admin/pending-users`

    // Create HTML email template
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Eko_club_logo-removebg-preview-SAUiEpYRjmONtSd1YKYL42qyW13AzD.png" alt="Eko Club Logo" style="max-width: 150px;">
        </div>
        <h2 style="color: #C8A97E; text-align: center;">New User Registration</h2>
        <p>A new user has registered and verified their email address. Their account is now pending approval.</p>
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Name:</strong> ${newUser.fullName}</p>
          <p><strong>Email:</strong> ${newUser.email}</p>
          <p><strong>Phone:</strong> ${newUser.phone}</p>
          <p><strong>Chapter:</strong> ${newUser.chapterName || "Not specified"}</p>
          <p><strong>Registration Date:</strong> ${new Date(newUser.createdAt).toLocaleString()}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${pendingUsersUrl}" style="background-color: #C8A97E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Review Pending Users</a>
        </div>
      </div>
    `

    // Send email to each admin
    for (const admin of adminUsers) {
      try {
        await resend.emails.send({
          from: emailFrom,
          to: [admin.email],
          subject: "New User Registration - Eko Club International",
          html: htmlBody,
        })

        console.log(`Admin notification sent to ${admin.email}`)
      } catch (error) {
        console.error(`Failed to send notification to admin ${admin.email}:`, error)
      }
    }
  } catch (error) {
    console.error("Failed to notify admins:", error)
    // Don't throw error here, as we don't want to fail the verification process
  }
}

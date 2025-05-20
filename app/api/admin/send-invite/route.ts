import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import InviteCode from "@/models/InviteCode"
import { verifyJwtToken } from "@/lib/jwt"
import crypto from "crypto"

// Postmark configuration
const POSTMARK_SERVER_TOKEN = process.env.POSTMARK_SERVER_TOKEN || ""
const POSTMARK_API_URL = "https://api.postmarkapp.com/email"

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyJwtToken(token)
    const userRole = payload.role || (payload.user && payload.user.role)
    const userId = payload._id || (payload.user && payload.user._id)

    if (userRole !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if an invite already exists for this email
    const existingInvite = await InviteCode.findOne({ email })

    if (existingInvite) {
      if (existingInvite.isUsed) {
        return NextResponse.json({ message: "This email is already registered" }, { status: 400 })
      }

      // Update the existing invite with a new expiration date
      existingInvite.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      await existingInvite.save()

      // Send the email with the existing code
      await sendInviteEmail(email, existingInvite.code)

      return NextResponse.json({
        message: "Invitation resent successfully",
      })
    }

    // Generate a unique invite code
    const code = generateInviteCode()

    // Create a new invite
    const newInvite = new InviteCode({
      email,
      code,
      createdBy: userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    })

    await newInvite.save()

    // Send the email
    await sendInviteEmail(email, code)

    return NextResponse.json({
      message: "Invitation sent successfully",
    })
  } catch (error) {
    console.error("Error sending invite:", error)
    return NextResponse.json({ message: "Failed to send invitation" }, { status: 500 })
  }
}

// Helper function to generate a unique invite code
function generateInviteCode() {
  // Generate a random 8-character code
  return crypto.randomBytes(4).toString("hex").toUpperCase()
}

// Helper function to send the invite email using Postmark
async function sendInviteEmail(email: string, code: string) {
  if (!POSTMARK_SERVER_TOKEN) {
    throw new Error("Postmark server token is not configured")
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ekoclub.org"
    // const emailFrom = process.env.EMAIL_FROM || "noreply@ekoclub.org"
    const emailFrom = process.env.EMAIL_FROM || "sabdullahi@cinnsol.com"

    // Create HTML email template
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Eko_club_logo-removebg-preview-SAUiEpYRjmONtSd1YKYL42qyW13AzD.png" alt="Eko Club Logo" style="max-width: 150px;">
        </div>
        <h2 style="color: #C8A97E; text-align: center;">Welcome to Eko Club International</h2>
        <p>You have been invited to join the Eko Club International community. To complete your registration, please use the following invitation code:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #333;">${code}</span>
        </div>
        <p>This code will expire in 7 days. To register, please visit our website and click on the "Register" button.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${appUrl}/register" style="background-color: #C8A97E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Register Now</a>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
          If you did not request this invitation, please ignore this email.
        </p>
      </div>
    `

    // Create text version as fallback
    const textBody = `
Welcome to Eko Club International

You have been invited to join the Eko Club International community. To complete your registration, please use the following invitation code:

${code}

This code will expire in 7 days. To register, please visit our website at ${appUrl}/register

If you did not request this invitation, please ignore this email.
    `

    // Send email using Postmark API
    const response = await fetch(POSTMARK_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": POSTMARK_SERVER_TOKEN,
      },
      body: JSON.stringify({
        From: emailFrom,
        To: email,
        Subject: "You're invited to join Eko Club International",
        HtmlBody: htmlBody,
        TextBody: textBody,
        MessageStream: "outbound",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Postmark API error: ${JSON.stringify(errorData)}`)
    }

    console.log(`Invitation email sent to ${email} via Postmark`)
  } catch (error) {
    console.error(`Failed to send invitation email to ${email}:`, error)
    throw error
  }
}

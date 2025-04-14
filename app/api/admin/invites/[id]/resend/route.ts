import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import InviteCode from "@/models/InviteCode"
import { verifyJwtToken } from "@/lib/jwt"
import nodemailer from "nodemailer"

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.ethereal.email",
  port: Number.parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER || "ethereal.user@ethereal.email",
    pass: process.env.EMAIL_PASSWORD || "ethereal_pass",
  },
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify admin access
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyJwtToken(token)
    const userRole = payload.role || (payload.user && payload.user.role)

    if (userRole !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { id } = params

    await connectToDatabase()

    // Find the invite
    const invite = await InviteCode.findById(id)

    if (!invite) {
      return NextResponse.json({ message: "Invite not found" }, { status: 404 })
    }

    if (invite.isUsed) {
      return NextResponse.json({ message: "This invitation has already been used" }, { status: 400 })
    }

    // Update the expiration date
    invite.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    await invite.save()

    // Send the email
    await sendInviteEmail(invite.email, invite.code)

    return NextResponse.json({
      message: "Invitation resent successfully",
    })
  } catch (error) {
    console.error("Error resending invite:", error)
    return NextResponse.json({ message: "Failed to resend invitation" }, { status: 500 })
  }
}

// Helper function to send the invite email
async function sendInviteEmail(email: string, code: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Eko Club" <noreply@ekoclub.org>',
    to: email,
    subject: "You're invited to join Eko Club International",
    html: `
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
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://ekoclub.org"}/register" style="background-color: #C8A97E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Register Now</a>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
          If you did not request this invitation, please ignore this email.
        </p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/user"
import { verifyJwtToken } from "@/lib/jwt"
import { Resend } from "resend"

// Resend configuration
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request, { params }: { params: { id: string } }) {
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

    const userId = params.id

    await connectToDatabase()

    // Find the pending user
    const user = await User.findOne({ _id: userId, role: "pending" })

    if (!user) {
      return NextResponse.json({ message: "Pending user not found" }, { status: 404 })
    }

    // Update user role to blocked
    user.role = "blocked"
    await user.save()

    // Send decline email to the user
    await sendDeclineEmail(user)

    return NextResponse.json({
      message: "User declined and blocked successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error declining user:", error)
    return NextResponse.json({ message: "Failed to decline user" }, { status: 500 })
  }
}

// Helper function to send decline email using Resend
async function sendDeclineEmail(user) {
  try {
    const emailFrom = process.env.EMAIL_FROM || "noreply@ekoclub.org"

    // Create HTML email template
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Eko_club_logo-removebg-preview-SAUiEpYRjmONtSd1YKYL42qyW13AzD.png" alt="Eko Club Logo" style="max-width: 150px;">
        </div>
        <h2 style="color: #C8A97E; text-align: center;">Registration Declined</h2>
        <p>Dear ${user.fullName},</p>
        <p>We regret to inform you that your registration request for Eko Club International has been declined.</p>
        <p>If you believe this is an error or would like more information, please contact our support team.</p>
        <p>Best regards,<br>Eko Club International Team</p>
      </div>
    `

    await resend.emails.send({
      from: emailFrom,
      to: [user.email],
      subject: "Eko Club International Registration Status",
      html: htmlBody,
    })

    console.log(`Decline email sent to ${user.email} via Resend`)
  } catch (error) {
    console.error(`Failed to send decline email to ${user.email}:`, error)
    throw error
  }
}

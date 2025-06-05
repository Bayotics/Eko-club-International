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
    const { membershipId } = await request.json()

    if (!membershipId) {
      return NextResponse.json({ message: "Membership ID is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Find the pending user
    const user = await User.findOne({ _id: userId, role: "pending" })

    if (!user) {
      return NextResponse.json({ message: "Pending user not found" }, { status: 404 })
    }

    // Update user role and add membership ID
    user.role = "member"
    user.membershipId = membershipId
    await user.save()

    // Send approval email to the user
    await sendApprovalEmail(user, membershipId)

    return NextResponse.json({
      message: "User approved successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        membershipId: user.membershipId,
      },
    })
  } catch (error) {
    console.error("Error approving user:", error)
    return NextResponse.json({ message: "Failed to approve user" }, { status: 500 })
  }
}

// Helper function to send approval email using Resend
async function sendApprovalEmail(user, membershipId) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ekoclub.org"
    const emailFrom = process.env.EMAIL_FROM || "noreply@ekoclub.org"
    const loginUrl = `${appUrl}/login`

    // Create HTML email template
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Eko_club_logo-removebg-preview-SAUiEpYRjmONtSd1YKYL42qyW13AzD.png" alt="Eko Club Logo" style="max-width: 150px;">
        </div>
        <h2 style="color: #C8A97E; text-align: center;">Account Approved</h2>
        <p>Dear ${user.fullName},</p>
        <p>Congratulations! Your Eko Club International account has been approved. You can now access all member features.</p>
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Your Membership ID:</strong> ${membershipId}</p>
          <p>Please keep this ID for your records. You may need it for future reference.</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="background-color: #C8A97E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Account</a>
        </div>
        <p>Welcome to the Eko Club International community!</p>
        <p>Best regards,<br>Eko Club International Team</p>
      </div>
    `

    await resend.emails.send({
      from: emailFrom,
      to: [user.email],
      subject: "Your Eko Club International Account Has Been Approved",
      html: htmlBody,
    })

    console.log(`Approval email sent to ${user.email} via Resend`)
  } catch (error) {
    console.error(`Failed to send approval email to ${user.email}:`, error)
    throw error
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import InviteCode from "@/models/InviteCode"
import { verifyJwtToken } from "@/lib/jwt"
import crypto from "crypto"
import fetch from "node-fetch"

// MailerLite configuration
const MAILERLITE_API_URL = "https://api.mailerlite.com/api/v2"
const MAILERLITE_API_TOKEN = process.env.MAILERLITE_API_TOKEN || ""
const DEFAULT_GROUP_NAME = "Eko Club International"

export async function GET(request: NextRequest) {
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

    await connectToDatabase()

    // Get all invites
    const invites = await InviteCode.find().sort({ createdAt: -1 })

    return NextResponse.json(invites)
  } catch (error) {
    console.error("Error fetching invites:", error)
    return NextResponse.json({ message: "Failed to fetch invites" }, { status: 500 })
  }
}

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

    const { emails } = await request.json()

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ message: "Emails are required" }, { status: 400 })
    }

    await connectToDatabase()

    const results = []
    const successfulEmails = []
    const failedEmails = []

    // Process each email
    for (const email of emails) {
      try {
        // Check if an invite already exists for this email
        const existingInvite = await InviteCode.findOne({ email })

        if (existingInvite) {
          if (existingInvite.isUsed) {
            results.push({
              email,
              success: false,
              message: "This email is already registered",
            })
            failedEmails.push(email)
            continue
          }

          // Update the existing invite with a new expiration date
          existingInvite.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
          await existingInvite.save()

          // Send the email with the existing code
          await sendInviteEmail(email, existingInvite.code)

          results.push({
            email,
            success: true,
            message: "Invitation resent successfully",
          })
          successfulEmails.push(email)
        } else {
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

          results.push({
            email,
            success: true,
            message: "Invitation sent successfully",
          })
          successfulEmails.push(email)
        }
      } catch (error) {
        console.error(`Error processing invite for ${email}:`, error)
        results.push({
          email,
          success: false,
          message: "Failed to send invitation",
        })
        failedEmails.push(email)
      }
    }

    return NextResponse.json({
      results,
      summary: {
        total: emails.length,
        successful: successfulEmails.length,
        failed: failedEmails.length,
        successfulEmails,
        failedEmails,
      },
    })
  } catch (error) {
    console.error("Error sending invites:", error)
    return NextResponse.json({ message: "Failed to send invitations" }, { status: 500 })
  }
}

// Helper function to generate a unique invite code
function generateInviteCode() {
  // Generate a random 8-character code
  return crypto.randomBytes(4).toString("hex").toUpperCase()
}

// Helper function to get or create a group for invitations
async function getOrCreateInvitationGroup() {
  if (!MAILERLITE_API_TOKEN) {
    throw new Error("MailerLite API token is not configured")
  }

  try {
    // First, check if the group already exists
    const groupsResponse = await fetch(`${MAILERLITE_API_URL}/groups`, {
      method: "GET",
      headers: {
        "X-MailerLite-ApiKey": MAILERLITE_API_TOKEN,
        "Content-Type": "application/json",
      },
    })

    if (!groupsResponse.ok) {
      throw new Error(`Failed to fetch groups: ${await groupsResponse.text()}`)
    }

    const groups = await groupsResponse.json()

    // Look for our default group
    const invitationGroup = groups.find((group: any) => group.name === DEFAULT_GROUP_NAME)

    if (invitationGroup) {
      return invitationGroup.id
    }

    // If the group doesn't exist, create it
    const createGroupResponse = await fetch(`${MAILERLITE_API_URL}/groups`, {
      method: "POST",
      headers: {
        "X-MailerLite-ApiKey": MAILERLITE_API_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: DEFAULT_GROUP_NAME,
      }),
    })

    if (!createGroupResponse.ok) {
      throw new Error(`Failed to create group: ${await createGroupResponse.text()}`)
    }

    const newGroup = await createGroupResponse.json()
    return newGroup.id
  } catch (error) {
    console.error("Error getting or creating invitation group:", error)
    throw error
  }
}

// Helper function to send the invite email using MailerLite
async function sendInviteEmail(email: string, code: string) {
  if (!MAILERLITE_API_TOKEN) {
    throw new Error("MailerLite API token is not configured")
  }

  try {
    // Get or create the invitation group
    const groupId = await getOrCreateInvitationGroup()

    // First, check if the subscriber exists
    const checkResponse = await fetch(`${MAILERLITE_API_URL}/subscribers/${email}`, {
      method: "GET",
      headers: {
        "X-MailerLite-ApiKey": MAILERLITE_API_TOKEN,
        "Content-Type": "application/json",
      },
    })

    if (checkResponse.status === 200) {
      // Subscriber exists, update their fields
      await fetch(`${MAILERLITE_API_URL}/subscribers/${email}`, {
        method: "PUT",
        headers: {
          "X-MailerLite-ApiKey": MAILERLITE_API_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            invite_code: code,
          },
        }),
      })
    } else {
      // Subscriber doesn't exist, create a new one
      const createResponse = await fetch(`${MAILERLITE_API_URL}/subscribers`, {
        method: "POST",
        headers: {
          "X-MailerLite-ApiKey": MAILERLITE_API_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          fields: {
            invite_code: code,
          },
        }),
      })

      if (!createResponse.ok) {
        throw new Error(`Failed to create subscriber: ${await createResponse.text()}`)
      }
    }

    // Add the subscriber to the invitation group
    const addToGroupResponse = await fetch(`${MAILERLITE_API_URL}/groups/${groupId}/subscribers`, {
      method: "POST",
      headers: {
        "X-MailerLite-ApiKey": MAILERLITE_API_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    })

    if (!addToGroupResponse.ok) {
      throw new Error(`Failed to add subscriber to group: ${await addToGroupResponse.text()}`)
    }

    // Send the email using a custom campaign
    const campaignResponse = await fetch(`${MAILERLITE_API_URL}/campaigns`, {
      method: "POST",
      headers: {
        "X-MailerLite-ApiKey": MAILERLITE_API_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: "You're invited to join Eko Club International",
        from: process.env.EMAIL_FROM || "noreply@ekoclub.org",
        from_name: "Eko Club",
        groups: [groupId], // Use the group ID here
        type: "regular",
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
      }),
    })

    if (!campaignResponse.ok) {
      throw new Error(`Failed to create campaign: ${await campaignResponse.text()}`)
    }

    console.log(`Invitation email sent to ${email}`)
  } catch (error) {
    console.error(`Failed to send invitation email to ${email}:`, error)
    throw error
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Subscriber from "@/models/Subscriber"

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { email, token } = await request.json()

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "Please provide a valid email address" }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Find subscriber
    const subscriber = await Subscriber.findOne({ email: email.toLowerCase() })

    if (!subscriber) {
      return NextResponse.json({ success: false, message: "Email not found in our subscription list" }, { status: 404 })
    }

    // Update status to unsubscribed
    subscriber.status = "unsubscribed"
    await subscriber.save()

    return NextResponse.json({
      success: true,
      message: "You have been successfully unsubscribed from our newsletter",
    })
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred while processing your request" },
      { status: 500 },
    )
  }
}

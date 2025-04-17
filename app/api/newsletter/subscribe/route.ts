import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Subscriber from "@/models/Subscriber"

export async function POST(request: NextRequest) {
  try {
    // Get client IP address for tracking (optional)
    const forwardedFor = request.headers.get("x-forwarded-for")
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : "unknown"

    // Parse request body
    const { email } = await request.json()

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "Please provide a valid email address" }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() })

    if (existingSubscriber) {
      // If already subscribed but unsubscribed before, reactivate
      if (existingSubscriber.status === "unsubscribed") {
        existingSubscriber.status = "active"
        existingSubscriber.subscriptionDate = new Date()
        await existingSubscriber.save()

        return NextResponse.json({
          success: true,
          message: "Your subscription has been reactivated!",
        })
      }

      // Already subscribed and active
      return NextResponse.json(
        { success: false, message: "This email is already subscribed to our newsletter" },
        { status: 409 },
      )
    }

    // Create new subscriber
    const newSubscriber = new Subscriber({
      email: email.toLowerCase(),
      subscriptionDate: new Date(),
      status: "active",
      source: "website",
      ipAddress,
    })

    await newSubscriber.save()

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing to our newsletter!",
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred while processing your request" },
      { status: 500 },
    )
  }
}

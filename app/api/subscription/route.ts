import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import Payment from "@/models/Payment"

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    const data = await req.json()

    // Calculate next billing date (1 month from now)
    const nextBillingDate = new Date()
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)

    // Create new subscription record
    const subscription = new Subscription({
      userId: data.userId || null,
      fullName: data.fullName,
      email: data.email,
      amount: data.amount,
      currency: data.currency,
      paymentMethod: data.paymentMethod,
      paymentToken: data.paymentToken,
      status: "active",
      lastBillingDate: new Date(),
      nextBillingDate: nextBillingDate,
      comment: data.comment,
      recognitionPreference: data.recognitionPreference,
    })

    await subscription.save()

    // Also create an initial payment record
    const payment = new Payment({
      userId: data.userId || null,
      fullName: data.fullName,
      email: data.email,
      amount: data.amount,
      currency: data.currency,
      paymentMethod: data.paymentMethod,
      transactionReference: data.transactionReference,
      status: "success",
      comment: data.comment,
      donationType: "recurring",
      recognitionPreference: data.recognitionPreference,
      subscriptionId: subscription._id,
    })

    await payment.save()

    return NextResponse.json({ success: true, subscription, payment }, { status: 201 })
  } catch (error) {
    console.error("Error creating subscription:", error)
    return NextResponse.json({ success: false, error: "Failed to create subscription" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    // Get query parameters
    const url = new URL(req.url)
    const email = url.searchParams.get("email")
    const status = url.searchParams.get("status")

    const query: any = {}
    if (email) {
      query.email = email
    }
    if (status) {
      query.status = status
    }

    const subscriptions = await Subscription.find(query).sort({ createdAt: -1 })

    return NextResponse.json({ success: true, subscriptions })
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch subscriptions" }, { status: 500 })
  }
}

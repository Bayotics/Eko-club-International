import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Payment from "@/models/Payment"

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    const data = await req.json()

    // Create new payment record
    const payment = new Payment({
      userId: data.userId || null,
      fullName: data.fullName,
      email: data.email,
      amount: data.amount,
      currency: data.currency,
      paymentMethod: data.paymentMethod,
      transactionReference: data.transactionReference,
      status: data.status || "success",
      comment: data.comment,
      donationType: data.donationType,
      recognitionPreference: data.recognitionPreference,
    })

    await payment.save()

    return NextResponse.json({ success: true, payment }, { status: 201 })
  } catch (error) {
    console.error("Error saving payment:", error)
    return NextResponse.json({ success: false, error: "Failed to save payment" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    // Get query parameters
    const url = new URL(req.url)
    const email = url.searchParams.get("email")

    let query = {}
    if (email) {
      query = { email }
    }

    const payments = await Payment.find(query).sort({ createdAt: -1 })

    return NextResponse.json({ success: true, payments })
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch payments" }, { status: 500 })
  }
}

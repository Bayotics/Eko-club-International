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

    // Public endpoint for the donor wall: do NOT expose PII.
    // Only return recent successful donations with minimal fields.
    const payments = await Payment.find({ status: "success" })
      .sort({ createdAt: -1 })
      .limit(50)
      .select({ fullName: 1, amount: 1, comment: 1, createdAt: 1, recognitionPreference: 1, currency: 1 })
      .lean()

    const sanitized = payments.map((p: any) => {
      const shouldAnonymize = p.recognitionPreference !== "full"
      return {
        fullName: shouldAnonymize ? "Anonymous" : p.fullName,
        amount: p.amount,
        comment: p.comment,
        createdAt: p.createdAt,
        currency: p.currency,
      }
    })

    return NextResponse.json(
      { success: true, payments: sanitized },
      {
        headers: {
          // Cache at the edge briefly to reduce DB pressure under bot traffic
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    )
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch payments" }, { status: 500 })
  }
}

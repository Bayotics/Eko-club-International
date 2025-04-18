import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Payment from "@/models/Payment"

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    const data = await req.json()
    const { reference, paymentMethod } = data

    // Verify with appropriate payment gateway
    let verificationResult

    if (paymentMethod === "paystack") {
      verificationResult = await verifyPaystackPayment(reference)
    } else if (paymentMethod === "flutterwave") {
      verificationResult = await verifyFlutterwavePayment(reference)
    } else if (paymentMethod === "paypal") {
      verificationResult = await verifyPayPalPayment(reference)
    } else {
      return NextResponse.json({ success: false, error: "Invalid payment method" }, { status: 400 })
    }

    if (verificationResult.success) {
      // Update payment status in database
      const payment = await Payment.findOneAndUpdate(
        { transactionReference: reference },
        { status: "success" },
        { new: true },
      )

      return NextResponse.json({ success: true, payment, verification: verificationResult })
    } else {
      return NextResponse.json({ success: false, error: verificationResult.message }, { status: 400 })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ success: false, error: "Failed to verify payment" }, { status: 500 })
  }
}

async function verifyPaystackPayment(reference: string) {
  try {
    // Replace with your actual Paystack secret key
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (data.status && data.data.status === "success") {
      return { success: true, data: data.data }
    } else {
      return { success: false, message: data.message || "Payment verification failed" }
    }
  } catch (error) {
    console.error("Paystack verification error:", error)
    return { success: false, message: "Error verifying Paystack payment" }
  }
}

async function verifyFlutterwavePayment(reference: string) {
  try {
    // Replace with your actual Flutterwave secret key
    const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY

    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${reference}/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (data.status === "success" && data.data.status === "successful") {
      return { success: true, data: data.data }
    } else {
      return { success: false, message: data.message || "Payment verification failed" }
    }
  } catch (error) {
    console.error("Flutterwave verification error:", error)
    return { success: false, message: "Error verifying Flutterwave payment" }
  }
}

async function verifyPayPalPayment(transactionId: string) {
  try {
    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
    const base64EncodedCredential = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")

    // 1. Generate an access token
    const authResponse = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${base64EncodedCredential}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    const authData = await authResponse.json()
    const accessToken = authData.access_token

    // 2. Get order details
    const orderResponse = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${transactionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    const orderData = await orderResponse.json()

    if (orderData.status === "COMPLETED") {
      return { success: true, data: orderData }
    } else {
      return { success: false, message: `PayPal payment verification failed. Status: ${orderData.status}` }
    }
  } catch (error) {
    console.error("PayPal verification error:", error)
    return { success: false, message: "Error verifying PayPal payment" }
  }
}

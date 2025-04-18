import { NextResponse } from "next/server"
import Subscription from "@/models/Subscription"
import Payment from "@/models/Payment"
import { connectToDatabase } from "@/lib/mongodb"

// This endpoint would be called by a cron job or scheduled task
export async function POST() {
  try {
    await connectToDatabase()
    const now = new Date()

    // Find all active subscriptions that are due for billing
    const dueSubscriptions = await Subscription.find({
      status: "active",
      nextBillingDate: { $lte: now },
    })

    const results = {
      processed: 0,
      failed: 0,
      details: [],
    }

    for (const subscription of dueSubscriptions) {
      try {
        // Process the payment based on the payment method
        let paymentResult

        if (subscription.paymentMethod === "paystack") {
          paymentResult = await processPaystackRecurring(subscription)
        } else if (subscription.paymentMethod === "flutterwave") {
          paymentResult = await processFlutterwaveRecurring(subscription)
        } else if (subscription.paymentMethod === "paypal") {
          paymentResult = await processPayPalRecurring(subscription)
        } else {
          throw new Error(`Unsupported payment method: ${subscription.paymentMethod}`)
        }

        if (paymentResult.success) {
          // Create a new payment record
          const payment = new Payment({
            userId: subscription.userId,
            fullName: subscription.fullName,
            email: subscription.email,
            amount: subscription.amount,
            currency: subscription.currency,
            paymentMethod: subscription.paymentMethod,
            transactionReference: paymentResult.transactionReference,
            status: "success",
            comment: subscription.comment,
            donationType: "recurring",
            recognitionPreference: subscription.recognitionPreference,
            subscriptionId: subscription._id,
          })

          await payment.save()

          // Update subscription with new billing dates
          const nextBillingDate = new Date()
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)

          subscription.lastBillingDate = now
          subscription.nextBillingDate = nextBillingDate
          await subscription.save()

          results.processed++
          results.details.push({
            subscriptionId: subscription._id,
            status: "success",
            paymentId: payment._id,
          })
        } else {
          // Handle failed payment
          results.failed++
          results.details.push({
            subscriptionId: subscription._id,
            status: "failed",
            error: paymentResult.error,
          })

          // If payment fails multiple times, we might want to pause the subscription
          // This would require additional logic to track failed attempts
        }
      } catch (error) {
        console.error(`Error processing subscription ${subscription._id}:`, error)
        results.failed++
        results.details.push({
          subscriptionId: subscription._id,
          status: "error",
          error: error.message,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.processed} subscriptions, ${results.failed} failed`,
      results,
    })
  } catch (error) {
    console.error("Error processing recurring payments:", error)
    return NextResponse.json({ success: false, error: "Failed to process recurring payments" }, { status: 500 })
  }
}

// Payment processor functions
async function processPaystackRecurring(subscription) {
  try {
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

    // Use the saved payment token to charge the customer
    const response = await fetch("https://api.paystack.co/transaction/charge_authorization", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authorization_code: subscription.paymentToken,
        email: subscription.email,
        amount: subscription.amount * 100, // Paystack expects amount in kobo
        currency: subscription.currency,
      }),
    })

    const data = await response.json()

    if (data.status && data.data.status === "success") {
      return {
        success: true,
        transactionReference: data.data.reference || `RECUR_${Date.now()}_${subscription._id}`,
      }
    } else {
      return {
        success: false,
        error: data.message || "Payment processing failed",
      }
    }
  } catch (error) {
    console.error("Paystack recurring payment error:", error)
    return { success: false, error: "Error processing Paystack payment" }
  }
}

async function processFlutterwaveRecurring(subscription) {
  try {
    const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY

    // Use the saved token to charge the customer
    const response = await fetch("https://api.flutterwave.com/v3/tokenized-charges", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: subscription.paymentToken,
        currency: subscription.currency,
        amount: subscription.amount,
        email: subscription.email,
        narration: `Monthly donation - ${subscription.fullName}`,
      }),
    })

    const data = await response.json()

    if (data.status === "success") {
      return {
        success: true,
        transactionReference: data.data.id.toString() || `RECUR_FLW_${Date.now()}_${subscription._id}`,
      }
    } else {
      return {
        success: false,
        error: data.message || "Payment processing failed",
      }
    }
  } catch (error) {
    console.error("Flutterwave recurring payment error:", error)
    return { success: false, error: "Error processing Flutterwave payment" }
  }
}

async function processPayPalRecurring(subscription) {
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

    // 2. Capture payment using the billing agreement
    const captureResponse = await fetch(
      `https://api-m.paypal.com/v2/billing/subscriptions/${subscription.paymentToken}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": `RECUR_PP_${Date.now()}_${subscription._id}`,
        },
        body: JSON.stringify({
          note: "Monthly recurring donation",
          capture_type: "OUTSTANDING_BALANCE",
        }),
      },
    )

    if (captureResponse.status === 200 || captureResponse.status === 201) {
      return {
        success: true,
        transactionReference: `RECUR_PP_${Date.now()}_${subscription._id}`,
      }
    } else {
      const errorData = await captureResponse.json()
      return {
        success: false,
        error: errorData.message || "PayPal payment processing failed",
      }
    }
  } catch (error) {
    console.error("PayPal recurring payment error:", error)
    return { success: false, error: "Error processing PayPal payment" }
  }
}

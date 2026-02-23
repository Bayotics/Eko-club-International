import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Check for a secret token to secure the endpoint
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  // This should be a secure token that only your cron job service knows
  if (token !== process.env.CRON_SECRET_TOKEN) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  try {
    const cronSecret = process.env.CRON_SECRET_TOKEN
    if (!cronSecret) {
      return NextResponse.json({ success: false, message: "CRON_SECRET_TOKEN is not configured" }, { status: 500 })
    }

    // Call the subscription processing endpoint (same deployment)
    const origin = new URL(request.url).origin
    const response = await fetch(`${origin}/api/subscription/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cronSecret}`,
      },
      cache: "no-store",
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in cron job:", error)
    return NextResponse.json({ success: false, message: "Error processing subscriptions" }, { status: 500 })
  }
}

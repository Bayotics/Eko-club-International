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
    // Call the subscription processing endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/subscriptions/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in cron job:", error)
    return NextResponse.json({ success: false, message: "Error processing subscriptions" }, { status: 500 })
  }
}

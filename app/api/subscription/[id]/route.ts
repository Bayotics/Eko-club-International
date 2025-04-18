import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Subscription from "@/models/Subscription"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const subscription = await Subscription.findById(params.id)

    if (!subscription) {
      return NextResponse.json({ success: false, error: "Subscription not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, subscription })
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch subscription" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const data = await req.json()

    // Only allow updating specific fields
    const allowedUpdates = ["status", "nextBillingDate"]
    const updates = {}

    Object.keys(data).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = data[key]
      }
    })

    const subscription = await Subscription.findByIdAndUpdate(params.id, updates, { new: true, runValidators: true })

    if (!subscription) {
      return NextResponse.json({ success: false, error: "Subscription not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, subscription })
  } catch (error) {
    console.error("Error updating subscription:", error)
    return NextResponse.json({ success: false, error: "Failed to update subscription" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const subscription = await Subscription.findByIdAndDelete(params.id)

    if (!subscription) {
      return NextResponse.json({ success: false, error: "Subscription not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Subscription deleted successfully" })
  } catch (error) {
    console.error("Error deleting subscription:", error)
    return NextResponse.json({ success: false, error: "Failed to delete subscription" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Subscriber from "@/models/Subscriber"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

// Helper function to verify admin
async function verifyAdmin(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return false
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string
      role: string
    }
    return decoded.role === "admin"
  } catch (error) {
    return false
  }
}

// Get all subscribers (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Connect to database
    await connectToDatabase()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const status = searchParams.get("status") || "all"
    const search = searchParams.get("search") || ""

    // Build query
    const query: any = {}
    if (status !== "all") {
      query.status = status
    }
    if (search) {
      query.email = { $regex: search, $options: "i" }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get subscribers
    const subscribers = await Subscriber.find(query).sort({ subscriptionDate: -1 }).skip(skip).limit(limit)

    // Get total count
    const total = await Subscriber.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: {
        subscribers,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error("Get subscribers error:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching subscribers" },
      { status: 500 },
    )
  }
}

// Delete subscriber (admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const { email } = await request.json()

    // Connect to database
    await connectToDatabase()

    // Delete subscriber
    const result = await Subscriber.deleteOne({ email })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Subscriber not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Subscriber deleted successfully",
    })
  } catch (error) {
    console.error("Delete subscriber error:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred while deleting the subscriber" },
      { status: 500 },
    )
  }
}

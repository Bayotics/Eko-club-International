import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/mongodb"
import Minute from "@/models/Minute"

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Helper function to verify admin token
async function verifyAdminToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return { isAdmin: false, error: "Authentication required", status: 401 }
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    const userRole = payload.role || (payload.user && payload.user.role)

    if (userRole !== "admin") {
      return { isAdmin: false, error: "Admin access required", status: 403 }
    }

    return { isAdmin: true }
  } catch (error) {
    console.error("Token verification error:", error)
    return { isAdmin: false, error: "Invalid token", status: 401 }
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verify admin token
    const tokenVerification = await verifyAdminToken()
    if (!tokenVerification.isAdmin) {
      return NextResponse.json({ error: tokenVerification.error }, { status: tokenVerification.status })
    }

    // Get minute ID from params
    const minuteId = params.id

    // Connect to database
    await connectToDatabase()

    // Find minute by ID
    const minute = await Minute.findById(minuteId).lean()

    if (!minute) {
      return NextResponse.json({ error: "Minute not found" }, { status: 404 })
    }

    return NextResponse.json(minute)
  } catch (error) {
    console.error("Error fetching minute:", error)
    return NextResponse.json(
      { error: "Failed to fetch minute", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verify admin token
    const tokenVerification = await verifyAdminToken()
    if (!tokenVerification.isAdmin) {
      return NextResponse.json({ error: tokenVerification.error }, { status: tokenVerification.status })
    }

    // Get minute ID from params
    const minuteId = params.id

    // Connect to database
    await connectToDatabase()

    // Get updated minute data from request body
    const updatedData = await request.json()

    // Update minute
    const minute = await Minute.findByIdAndUpdate(minuteId, updatedData, { new: true, runValidators: true }).lean()

    if (!minute) {
      return NextResponse.json({ error: "Minute not found" }, { status: 404 })
    }

    return NextResponse.json(minute)
  } catch (error) {
    console.error("Error updating minute:", error)
    return NextResponse.json(
      { error: "Failed to update minute", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verify admin token
    const tokenVerification = await verifyAdminToken()
    if (!tokenVerification.isAdmin) {
      return NextResponse.json({ error: tokenVerification.error }, { status: tokenVerification.status })
    }

    // Get minute ID from params
    const minuteId = params.id

    // Connect to database
    await connectToDatabase()

    // Delete minute
    const minute = await Minute.findByIdAndDelete(minuteId)

    if (!minute) {
      return NextResponse.json({ error: "Minute not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Minute deleted successfully" })
  } catch (error) {
    console.error("Error deleting minute:", error)
    return NextResponse.json(
      { error: "Failed to delete minute", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

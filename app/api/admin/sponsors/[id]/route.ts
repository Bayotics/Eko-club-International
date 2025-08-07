import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/mongodb"
import Sponsor from "@/models/Sponsor"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// GET - Fetch single sponsor
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))

      // Check if user is admin
      const userRole = payload.role || (payload.user && payload.user.role)

      if (userRole !== "admin") {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 })
      }
    } catch (error) {
      console.error("Token verification error:", error)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Connect to database
    await connectToDatabase()

    const sponsor = await Sponsor.findById(params.id)

    if (!sponsor) {
      return NextResponse.json({ error: "Sponsor not found" }, { status: 404 })
    }

    return NextResponse.json({ sponsor })
  } catch (error) {
    console.error("Error fetching sponsor:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update sponsor
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))

      // Check if user is admin
      const userRole = payload.role || (payload.user && payload.user.role)

      if (userRole !== "admin") {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 })
      }
    } catch (error) {
      console.error("Token verification error:", error)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Connect to database
    await connectToDatabase()

    const body = await request.json()
    const { name, description, pic, sponsorshipType, contribution, websiteLink } = body

    // Validate required fields
    if (!name || !sponsorshipType) {
      return NextResponse.json(
        {
          error: "Name, and sponsorship type are required",
        },
        { status: 400 },
      )
    }

    // Validate sponsorship type
    if (!["regular", "corporate"].includes(sponsorshipType)) {
      return NextResponse.json(
        {
          error: "Sponsorship type must be either 'regular' or 'corporate'",
        },
        { status: 400 },
      )
    }

    // Validate contribution based on type
    

// Only validate contribution if it is provided and has a type
if (contribution && contribution.type) {
  if (contribution.type === "monetary" && (!contribution.monetaryAmount || contribution.monetaryAmount <= 0)) {
    return NextResponse.json(
      {
        error: "Monetary amount is required for monetary contributions",
      },
      { status: 400 },
    )
  }

  if (contribution.type === "in-kind" && !contribution.inKindDescription) {
    return NextResponse.json(
      {
        error: "In-kind description is required for in-kind contributions",
      },
      { status: 400 },
    )
  }

  if (contribution.type === "both") {
    if (!contribution.monetaryAmount || contribution.monetaryAmount <= 0) {
      return NextResponse.json(
        {
          error: "Monetary amount is required for both type contributions",
        },
        { status: 400 },
      )
    }
    if (!contribution.inKindDescription) {
      return NextResponse.json(
        {
          error: "In-kind description is required for both type contributions",
        },
        { status: 400 },
      )
    }
  }
}

    const sponsor = await Sponsor.findByIdAndUpdate(
      params.id,
      {
        name,
        description,
        pic,
        sponsorshipType,
        websiteLink,
      },
      {
        new: true,
        runValidators: false, // We handle validation manually above
      },
    )

    if (!sponsor) {
      return NextResponse.json({ error: "Sponsor not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Sponsor updated successfully",
      sponsor,
    })
  } catch (error: any) {
    console.error("Error updating sponsor:", error)

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 })
    }

    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete sponsor
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))

      // Check if user is admin
      const userRole = payload.role || (payload.user && payload.user.role)

      if (userRole !== "admin") {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 })
      }
    } catch (error) {
      console.error("Token verification error:", error)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Connect to database
    await connectToDatabase()

    const sponsor = await Sponsor.findByIdAndDelete(params.id)

    if (!sponsor) {
      return NextResponse.json({ error: "Sponsor not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Sponsor deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting sponsor:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

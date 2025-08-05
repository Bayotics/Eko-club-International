import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/mongodb"
import Sponsor from "@/models/Sponsor"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// GET - Fetch all sponsors with filtering and pagination
export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const contributionType = searchParams.get("contributionType") || ""
    const sponsorshipType = searchParams.get("sponsorshipType") || ""

    // Build filter query
    const filter: any = {}

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "contribution.inKindDescription": { $regex: search, $options: "i" } },
      ]
    }

    if (contributionType && contributionType !== "all") {
      filter["contribution.type"] = contributionType
    }

    if (sponsorshipType && sponsorshipType !== "all") {
      filter.sponsorshipType = sponsorshipType
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Fetch sponsors with pagination
    const [sponsors, total] = await Promise.all([
      Sponsor.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Sponsor.countDocuments(filter),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      sponsors,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching sponsors:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new sponsor
export async function POST(request: Request) {
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

    // Validate required fields - only name and sponsorshipType are required
    if (!name || !sponsorshipType) {
      return NextResponse.json(
        {
          error: "Name and sponsorship type are required",
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

    // Only validate contribution if it's provided
    if (contribution && contribution.type) {
      // Validate contribution based on type
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

    // Create sponsor data - only include contribution if it has meaningful data
    const sponsorData: any = {
      name,
      description,
      pic,
      sponsorshipType,
      websiteLink,
    }

    // Only add contribution if type is provided and has valid data
    if (contribution && contribution.type) {
      sponsorData.contribution = contribution
    }

    const sponsor = new Sponsor(sponsorData)

    await sponsor.save()

    return NextResponse.json(
      {
        message: "Sponsor created successfully",
        sponsor,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error creating sponsor:", error)

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

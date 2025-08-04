import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/mongodb"
import Sponsor from "@/models/Sponsor"

// GET - Fetch all sponsors with filtering and search
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

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
    const search = searchParams.get("search") || ""
    const contributionType = searchParams.get("contributionType") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "contribution.inKindDescription": { $regex: search, $options: "i" } },
      ]
    }

    if (contributionType) {
      query["contribution.type"] = contributionType
    }

    const sponsors = await Sponsor.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Sponsor.countDocuments(query)

    return NextResponse.json({
      sponsors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
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
    const { name, description, pic, contribution, websiteLink } = body

    // Validate required fields
    if (!name || !contribution?.type) {
      return NextResponse.json(
        {
          error: "Name and contribution type are required",
        },
        { status: 400 },
      )
    }

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

    const sponsor = new Sponsor({
      name,
      description,
      pic,
      contribution,
      websiteLink,
    })

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

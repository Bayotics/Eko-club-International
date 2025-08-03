import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { connectToDatabase } from "@/lib/mongodb"
import ConventionEvent from "@/models/ConventionEvent"

// GET - Fetch all convention events

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    try{
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    
          // Check if user is admin
          const userRole = payload.role || (payload.user && payload.user.role)
    
          if (userRole !== "admin") {
            console.log("Not an admin")
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
    const year = searchParams.get("year")
    const type = searchParams.get("type")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Build filter object
    const filter: any = {}

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ]
    }

    if (year) {
      filter.year = Number.parseInt(year)
    }

    if (type) {
      filter.type = type
    }

    const skip = (page - 1) * limit

    const [events, total] = await Promise.all([
      ConventionEvent.find(filter).sort({ year: -1, dateFrom: -1 }).skip(skip).limit(limit),
      ConventionEvent.countDocuments(filter),
    ])

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching convention events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new convention event
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try{
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
    const { name, location, dateFrom, dateTo, year, type, title, video, sections } = body

    // Validation
    if (!name || !location || !dateFrom || !dateTo || !year || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (new Date(dateFrom) > new Date(dateTo)) {
      return NextResponse.json({ error: "Date From cannot be after Date To" }, { status: 400 })
    }

    const eventData: any = {
      name,
      location,
      dateFrom: new Date(dateFrom),
      dateTo: new Date(dateTo),
      year: Number.parseInt(year),
      type,
    }

    if (type === "Single") {
      if (!title || !video) {
        return NextResponse.json({ error: "Title and video are required for Single type events" }, { status: 400 })
      }
      eventData.title = title
      eventData.video = video
    } else if (type === "Sectioned") {
      if (!sections || sections.length === 0) {
        return NextResponse.json(
          { error: "At least one section is required for Sectioned type events" },
          { status: 400 },
        )
      }
      eventData.sections = sections
    }

    const conventionEvent = new ConventionEvent(eventData)
    await conventionEvent.save()

    return NextResponse.json(
      { message: "Convention event created successfully", event: conventionEvent },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating convention event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { connectToDatabase } from "@/lib/mongodb"
import ConventionEvent from "@/models/ConventionEvent"

// GET - Fetch single convention event
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
    const event = await ConventionEvent.findById(params.id)

    if (!event) {
      return NextResponse.json({ error: "Convention event not found" }, { status: 404 })
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error("Error fetching convention event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update convention event
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const body = await request.json()
    const { name, location, dateFrom, dateTo, year, type, title, video, sections } = body

    // Validation
    if (!name || !location || !dateFrom || !dateTo || !year || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (new Date(dateFrom) > new Date(dateTo)) {
      return NextResponse.json({ error: "Date From cannot be after Date To" }, { status: 400 })
    }

    const updateData: any = {
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
      updateData.title = title
      updateData.video = video
      updateData.$unset = { sections: 1 }
    } else if (type === "Sectioned") {
      if (!sections || sections.length === 0) {
        return NextResponse.json(
          { error: "At least one section is required for Sectioned type events" },
          { status: 400 },
        )
      }
      updateData.sections = sections
      updateData.$unset = { title: 1, video: 1 }
    }

    const event = await ConventionEvent.findByIdAndUpdate(params.id, updateData, { new: true, runValidators: true })

    if (!event) {
      return NextResponse.json({ error: "Convention event not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Convention event updated successfully", event })
  } catch (error) {
    console.error("Error updating convention event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete convention event
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const event = await ConventionEvent.findByIdAndDelete(params.id)

    if (!event) {
      return NextResponse.json({ error: "Convention event not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Convention event deleted successfully" })
  } catch (error) {
    console.error("Error deleting convention event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

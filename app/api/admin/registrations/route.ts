import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Registration from "@/models/Registration"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"


const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
       const token = cookieStore.get("token")?.value
   
       if (!token) {
         return NextResponse.json({ error: "Authentication required" }, { status: 401 })
       }
   
       // Verify token
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

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const chapterNames = searchParams.get("chapterNames")?.split(",") || []
    const shirtSizes = searchParams.get("shirtSizes")?.split(",") || []
    const registrationTypes = searchParams.get("registrationTypes")?.split(",") || []
    const attendanceDays = searchParams.get("attendanceDays")?.split(",") || []

    const query: any = {}

    // Search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { chapterName: { $regex: search, $options: "i" } },
        { registrationId: { $regex: search, $options: "i" } },
        { membershipId: { $regex: search, $options: "i" } },
      ]
    }

    // Filter functionality
    if (chapterNames.length > 0) {
      query.chapterName = { $in: chapterNames }
    }

    if (shirtSizes.length > 0) {
      query.shirtSize = { $in: shirtSizes }
    }

    if (registrationTypes.length > 0) {
      query.registrationType = { $in: registrationTypes }
    }

    if (attendanceDays.length > 0) {
      query.attendanceDays = { $in: attendanceDays }
    }

    const registrations = await Registration.find(query).sort({ createdAt: -1 })

    return NextResponse.json({ registrations })
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value
    
        if (!token) {
          return NextResponse.json({ error: "Authentication required" }, { status: 401 })
        }
    
        // Verify token
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

    await connectToDatabase()

    const data = await request.json()

    // Generate unique registration ID
    const registrationId = `REG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const registration = new Registration({
      ...data,
      registrationId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await registration.save()

    return NextResponse.json({ registration }, { status: 201 })
  } catch (error) {
    console.error("Error creating registration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

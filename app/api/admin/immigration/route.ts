import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { connectToDatabase } from "@/lib/mongodb"
import immigrationService from "@/models/immigrationService"

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
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const filter: any = {}

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit

    const [consularRegs, total] = await Promise.all([
      immigrationService.find(filter).skip(skip).limit(limit),
      immigrationService.countDocuments(filter),
    ])

    return NextResponse.json({
      consularRegs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching consular registrations", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
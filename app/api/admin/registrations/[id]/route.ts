import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Registration from "@/models/Registration"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"


const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const registration = await Registration.findById(params.id)

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    return NextResponse.json({ registration })
  } catch (error) {
    console.error("Error fetching registration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const registration = await Registration.findByIdAndUpdate(
      params.id,
      { ...data, updatedAt: new Date() },
      { new: true },
    )

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    return NextResponse.json({ registration })
  } catch (error) {
    console.error("Error updating registration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const registration = await Registration.findByIdAndDelete(params.id)

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Registration deleted successfully" })
  } catch (error) {
    console.error("Error deleting registration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

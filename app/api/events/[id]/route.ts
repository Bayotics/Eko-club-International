import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyJwtToken } from "@/lib/jwt"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const event = await db.collection("events").findOne({ _id: new ObjectId(id) })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check if user is logged in
    const token = request.cookies.get("token")?.value
    let userRole = "public"
    
    if (token) {
      try {
        const payload = await verifyJwtToken(token)
        if (payload) {
          userRole = payload.role
        }
      } catch (error) {
        console.error("Error verifying token:", error)
      }
    }
    
    // Check if user has permission to view this event
    if (
      event.visibility === "exco" && userRole !== "admin" && userRole !== "exco" ||
      event.visibility === "members" && userRole === "public"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

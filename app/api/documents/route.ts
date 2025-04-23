import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Document from "@/models/Document"
import { jwtVerify } from "jose"


const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]
    let userRole = "public"

    if (token) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
        if (payload) {
          userRole = payload.role
        }
      } catch (error) {
        console.error("Error verifying token:", error)
      }
    }

    await connectToDatabase()

    let documents

    if (userRole === "admin") {
      // Admins can see all documents
      documents = await Document.find().sort({ createdAt: -1 })
    } else if (userRole === "exco") {
      // Excos can see documents meant for excos, members, and public
      documents = await Document.find({
        meantFor: { $in: ["exco", "member", "public"] },
      }).sort({ createdAt: -1 })
    } else if (userRole === "member") {
      // Members can see documents meant for members and public
      documents = await Document.find({
        meantFor: { $in: ["member", "public"] },
      }).sort({ createdAt: -1 })
    } else {
      // Public users can only see public documents
      documents = await Document.find({
        meantFor: "public",
      }).sort({ createdAt: -1 })
    }

    return NextResponse.json(documents)
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

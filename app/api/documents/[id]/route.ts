import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Document from "@/models/Document"
import { jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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
    const document = await Document.findById(params.id)

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Check if the user has permission to access this document
    if (
      userRole === "admin" ||
      (userRole === "exco" && document.meantFor.includes("exco")) ||
      (userRole === "member" && document.meantFor.includes("member")) ||
      document.meantFor.includes("public")
    ) {
      return NextResponse.json(document)
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
  } catch (error) {
    console.error("Error fetching document:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Document from "@/models/Document"
import { jwtVerify } from "jose"


const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    const documents = await Document.find().sort({ createdAt: -1 })

    return NextResponse.json(documents)
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, content, meantFor } = await req.json()

    if (!title || !description || !content || !meantFor) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()
    const document = new Document({
      title,
      description,
      content,
      meantFor,
      createdBy: payload.userId,
    })

    await document.save()
    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error("Error creating document:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

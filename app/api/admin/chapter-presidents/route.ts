import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/mongodb"
import ChapterPresident from "@/models/ChapterPresident"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

async function verifyAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    const typedPayload = payload as { role?: string; user?: { role?: string } }
    const userRole = typedPayload.role || typedPayload.user?.role

    if (userRole !== "admin") {
      return { error: NextResponse.json({ error: "Admin access required" }, { status: 403 }) }
    }

    return { error: null }
  } catch (error) {
    console.error("Token verification error:", error)
    return { error: NextResponse.json({ error: "Invalid token" }, { status: 401 }) }
  }
}

export async function GET() {
  try {
    const { error } = await verifyAdmin()
    if (error) return error

    await connectToDatabase()

    const presidents = await ChapterPresident.find({}).sort({ chapter: 1 }).lean()

    return NextResponse.json(presidents)
  } catch (error) {
    console.error("Error fetching chapter presidents:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { error } = await verifyAdmin()
    if (error) return error

    await connectToDatabase()

    const body = await request.json()
    const name = body?.name?.trim()
    const chapter = body?.chapter?.trim()
    const image = body?.image?.trim() || ""

    if (!name || !chapter) {
      return NextResponse.json({ error: "Name and chapter are required" }, { status: 400 })
    }

    const existing = await ChapterPresident.findOne({ chapter })
    if (existing) {
      return NextResponse.json({ error: "A president already exists for this chapter" }, { status: 409 })
    }

    const president = await ChapterPresident.create({
      name,
      chapter,
      image,
    })

    return NextResponse.json(president, { status: 201 })
  } catch (error: any) {
    console.error("Error creating chapter president:", error)

    if (error?.code === 11000) {
      return NextResponse.json({ error: "A president already exists for this chapter" }, { status: 409 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    const existing = await ChapterPresident.findOne({
      chapter,
      _id: { $ne: params.id },
    })

    if (existing) {
      return NextResponse.json({ error: "A president already exists for this chapter" }, { status: 409 })
    }

    const updated = await ChapterPresident.findByIdAndUpdate(
      params.id,
      {
        name,
        chapter,
        image,
      },
      { new: true, runValidators: true },
    )

    if (!updated) {
      return NextResponse.json({ error: "Chapter president not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("Error updating chapter president:", error)

    if (error?.code === 11000) {
      return NextResponse.json({ error: "A president already exists for this chapter" }, { status: 409 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await verifyAdmin()
    if (error) return error

    await connectToDatabase()

    const deleted = await ChapterPresident.findByIdAndDelete(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "Chapter president not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Chapter president deleted successfully" })
  } catch (error) {
    console.error("Error deleting chapter president:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

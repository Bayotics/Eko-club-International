import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const VIDEO_MAX_BYTES = 5 * 1024 * 1024 // 5 MB

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm", "video/avi", "video/x-msvideo"]

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
      const userRole = payload.role || (payload.user && (payload.user as { role?: string }).role)
      if (userRole !== "admin") {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const isImage = IMAGE_TYPES.includes(file.type)
    const isVideo = VIDEO_TYPES.includes(file.type)

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Unsupported file type. Upload JPG, PNG, WEBP images or MP4, MOV, WEBM videos." },
        { status: 400 },
      )
    }

    if (isVideo && file.size > VIDEO_MAX_BYTES) {
      return NextResponse.json({ error: "Video exceeds the 5 MB limit. Please upload a smaller file." }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")
    const dataURI = `data:${file.type};base64,${base64}`

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: "eko-club-events",
          resource_type: isVideo ? "video" : "image",
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        },
      )
    })

    return NextResponse.json({ ...(result as object), mediaType: isVideo ? "video" : "image" })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Failed to upload file", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

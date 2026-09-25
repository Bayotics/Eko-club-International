import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { requireAdmin } from "@/lib/admin-auth"

const ALLOWED_FOLDERS = ["eko-communicator", "in-loving-memory"]

// Files go browser -> Cloudinary directly; Vercel functions reject request bodies over 4.5 MB.
export async function POST(request: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { folder } = await request.json().catch(() => ({ folder: "" }))
  if (!ALLOWED_FOLDERS.includes(folder)) {
    return NextResponse.json({ error: "Invalid upload folder" }, { status: 400 })
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!apiSecret || !apiKey || !cloudName) {
    return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 500 })
  }

  const timestamp = Math.round(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, apiSecret)

  return NextResponse.json({ signature, timestamp, folder, apiKey, cloudName })
}

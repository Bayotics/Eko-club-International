import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function requireAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    const typed = payload as { role?: string; user?: { role?: string } }
    const role = typed.role || typed.user?.role
    if (role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }
    return null
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}

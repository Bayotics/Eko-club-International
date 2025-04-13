import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// Routes that require authentication
const protectedRoutes = ["/members/dashboard"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the path is a protected route
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    const token = request.cookies.get("token")?.value

    // If no token exists, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      // Verify token (using jose for edge compatibility)
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
      await jwtVerify(token, secret)

      // Token is valid, continue to protected route
      return NextResponse.next()
    } catch (error) {
      // Token is invalid, redirect to login
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // For non-protected routes, continue normally
  return NextResponse.next()
}

export const config = {
  matcher: ["/members/:path*"],
}

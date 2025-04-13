import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Protected routes that require authentication
const protectedRoutes = ["/members/dashboard", "/members/profile"]

// Admin-only routes
const adminRoutes = ["/admin"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get token from cookies
  const token = request.cookies.get("token")?.value

  // If no token and trying to access protected route, redirect to login
  if (
    !token &&
    (protectedRoutes.some((route) => pathname.startsWith(route)) ||
      adminRoutes.some((route) => pathname.startsWith(route)))
  ) {
    const url = new URL("/login", request.url)
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  // If has token, verify it
  if (token) {
    try {
      // Verify token
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))

      // Check if trying to access admin routes
      if (adminRoutes.some((route) => pathname.startsWith(route))) {
        // The role might be in different places depending on your JWT structure
        // Check both common locations
        const userRole = payload.role || (payload.user && payload.user.role)

        // If not admin, redirect to dashboard
        if (userRole !== "admin") {
          return NextResponse.redirect(new URL("/members/dashboard", request.url))
        }
      }

      // Token is valid, allow access to protected routes
      return NextResponse.next()
    } catch (error) {
      // Invalid token, redirect to login
      if (
        protectedRoutes.some((route) => pathname.startsWith(route)) ||
        adminRoutes.some((route) => pathname.startsWith(route))
      ) {
        const url = new URL("/login", request.url)
        url.searchParams.set("from", pathname)
        return NextResponse.redirect(url)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/members/:path*", "/admin/:path*"],
}

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Middleware to protect routes based on authentication and user roles
 * - Redirects unauthenticated users to login page when accessing protected routes
 * - Redirects authenticated users away from public routes like login
 * - Checks user role for accessing admin routes
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const path = request.nextUrl.pathname

  // Get user data from cookies if available
  const userDataCookie = request.cookies.get("user")?.value
  let userData = null

  if (userDataCookie) {
    try {
      userData = JSON.parse(userDataCookie)
    } catch (e) {
      console.error("Failed to parse user data from cookie")
    }
  }

  // Define route access rules
  const adminRoutes = ["/admin"] // Routes that require admin/manager role
  const protectedRoutes = ["/dashboard", "/profile"] // Routes that require any authenticated user
  const publicRoutes = ["/login", "/register"] // Routes accessible without authentication

  // Check if the current path matches any of our defined route types
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route))
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isPublicRoute = publicRoutes.some((route) => path === route)

  // If trying to access admin route
  if (isAdminRoute) {
    // No token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Has token but not admin/manager role
    if (userData && userData.cargo !== "ADMIN" && userData.cargo !== "MANAGER") {
      return NextResponse.redirect(new URL("/login?error=unauthorized", request.url))
    }
  }

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If trying to access public route with token, redirect to appropriate dashboard
  if (isPublicRoute && token) {
    if (userData && (userData.cargo === "ADMIN" || userData.cargo === "MANAGER")) {
      return NextResponse.redirect(new URL("/admin", request.url))
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except for static files, api routes, and _next
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
}

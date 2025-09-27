import { NextResponse } from "next/server"

export function middleware(request) {
  // Add security headers
  const response = NextResponse.next()

  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // Handle service worker registration
  if (request.nextUrl.pathname === "/service-worker.js") {
    response.headers.set("Service-Worker-Allowed", "/")
    response.headers.set("Cache-Control", "no-cache")
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icon-|offline).*)"],
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

export function RouteGuard({ children, requiredRole = null, redirectTo = "/auth" }) {
  const { user, loading, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // Not authenticated
    if (!user) {
      router.push(redirectTo)
      return
    }

    // Check role requirements
    if (requiredRole && !hasRole(requiredRole)) {
      // Redirect based on user role
      const roleRedirects = {
        student: "/student",
        teacher: "/teacher",
        admin: "/admin",
      }

      router.push(roleRedirects[user.role] || "/auth")
      return
    }
  }, [user, loading, requiredRole, hasRole, router, redirectTo])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-700 font-medium">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated or insufficient role
  if (!user || (requiredRole && !hasRole(requiredRole))) {
    return null
  }

  return children
}

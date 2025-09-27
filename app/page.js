"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push("/auth")
      return
    }

    // Redirect based on user role
    const roleRedirects = {
      student: "/student",
      teacher: "/teacher",
      admin: "/admin",
    }

    router.push(roleRedirects[user.role] || "/auth")
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-700 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return null
}

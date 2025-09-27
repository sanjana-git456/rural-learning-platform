"use client"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { OfflineIndicator } from "@/components/ui/offline-indicator"
import { Home, BookOpen, Users, BarChart3, Settings, LogOut, User } from "lucide-react"
import Link from "next/link"

export function Navigation() {
  const { user, logout, isStudent, isTeacher, isAdmin } = useAuth()

  if (!user) return null

  const getNavigationItems = () => {
    if (isStudent) {
      return [
        { href: "/student", icon: Home, label: "Home" },
        { href: "/student/lessons", icon: BookOpen, label: "Lessons" },
        { href: "/student/progress", icon: BarChart3, label: "Progress" },
      ]
    }

    if (isTeacher) {
      return [
        { href: "/teacher", icon: Home, label: "Dashboard" },
        { href: "/teacher/create-lesson", icon: BookOpen, label: "Create Lesson" },
        { href: "/teacher/attendance", icon: Users, label: "Attendance" },
        { href: "/teacher/students", icon: Users, label: "Students" },
      ]
    }

    if (isAdmin) {
      return [
        { href: "/admin", icon: BarChart3, label: "Reports" },
        { href: "/admin/users", icon: Users, label: "Users" },
        { href: "/admin/content", icon: BookOpen, label: "Content" },
        { href: "/admin/settings", icon: Settings, label: "Settings" },
      ]
    }

    return []
  }

  const navigationItems = getNavigationItems()

  return (
    <nav className="bg-white border-b border-orange-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="text-2xl">📚</div>
          <div>
            <h1 className="font-bold text-lg text-orange-600 font-fredoka">Rural Learning</h1>
            <p className="text-xs text-gray-500 capitalize">{user.role} Dashboard</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* User Info and Actions */}
        <div className="flex items-center gap-3">
          <OfflineIndicator />

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{user.name}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden mt-3 flex gap-1 overflow-x-auto">
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 whitespace-nowrap">
              <item.icon className="w-4 h-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  )
}

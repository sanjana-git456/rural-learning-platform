"use client"

import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { OfflineBadge } from "@/components/ui/offline-badge"

export function Header({ userRole, isOnline = true }) {
  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem("user_session")
    window.location.href = "/auth"
  }

  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-2xl">📚</div>
            <div>
              <h1 className="text-xl font-bold font-display text-primary">Rural Learning</h1>
              <p className="text-xs text-muted-foreground capitalize">{userRole} Dashboard</p>
            </div>
          </div>

          {/* Status and Controls */}
          <div className="flex items-center gap-4">
            <OfflineBadge isOnline={isOnline} />
            <LanguageSwitcher />
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

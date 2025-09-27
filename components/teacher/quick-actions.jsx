"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function QuickActions({ isOnline }) {
  const actions = [
    {
      title: "Create Lesson",
      description: "Upload new lesson content",
      icon: "📚",
      href: "/teacher/create-lesson",
      requiresOnline: false,
    },
    {
      title: "Take Attendance",
      description: "Mark student attendance",
      icon: "📋",
      href: "/teacher/attendance",
      requiresOnline: false,
    },
    {
      title: "View Reports",
      description: "Student progress reports",
      icon: "📊",
      href: "/teacher/reports",
      requiresOnline: true,
    },
    {
      title: "Manage Classes",
      description: "Edit class information",
      icon: "👥",
      href: "/teacher/classes",
      requiresOnline: true,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
              onClick={() => (window.location.href = action.href)}
              disabled={action.requiresOnline && !isOnline}
            >
              <div className="text-2xl">{action.icon}</div>
              <div className="text-center">
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
              {action.requiresOnline && !isOnline && <div className="text-xs text-orange-600">Requires internet</div>}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

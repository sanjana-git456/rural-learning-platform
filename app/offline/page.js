"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-6xl">📚</div>
          <CardTitle className="text-2xl font-display">You're Offline</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Don't worry! You can still access your downloaded lessons and continue learning.
          </p>
          <Button onClick={() => (window.location.href = "/")} className="w-full">
            View Downloaded Lessons
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

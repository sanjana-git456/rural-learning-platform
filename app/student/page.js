"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RouteGuard } from "@/components/auth/route-guard"
import { Navigation } from "@/components/layout/navigation"
import { LessonCard } from "@/components/student/lesson-card"
import { ProgressSummary } from "@/components/student/progress-summary"
import { OfflineBadge } from "@/components/ui/offline-badge"

// Mock data for lessons
const mockLessons = [
  {
    id: 1,
    title: "Numbers 1-10",
    subject: "Math",
    duration: "15 min",
    isDownloaded: true,
    isCompleted: false,
    audioUrl: "/audio/numbers-1-10.mp3",
    imageUrl: "/colorful-numbers-1-to-10.jpg",
    difficulty: "Easy",
  },
  {
    id: 2,
    title: "Animal Sounds",
    subject: "Science",
    duration: "12 min",
    isDownloaded: false,
    isCompleted: true,
    audioUrl: "/audio/animal-sounds.mp3",
    imageUrl: "/cute-farm-animals.jpg",
    difficulty: "Easy",
  },
  {
    id: 3,
    title: "Colors and Shapes",
    subject: "Art",
    duration: "18 min",
    isDownloaded: true,
    isCompleted: false,
    audioUrl: "/audio/colors-shapes.mp3",
    imageUrl: "/colorful-shapes-and-colors.jpg",
    difficulty: "Medium",
  },
  {
    id: 4,
    title: "Simple Words",
    subject: "Language",
    duration: "20 min",
    isDownloaded: false,
    isCompleted: false,
    audioUrl: "/audio/simple-words.mp3",
    imageUrl: "/alphabet-letters-and-simple-words.jpg",
    difficulty: "Easy",
  },
]

export default function StudentHome() {
  const [lessons, setLessons] = useState(mockLessons)
  const [isOnline, setIsOnline] = useState(true)
  const [queuedItems, setQueuedItems] = useState(2)

  useEffect(() => {
    // Monitor online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleDownloadLesson = (lessonId) => {
    setLessons((prev) => prev.map((lesson) => (lesson.id === lessonId ? { ...lesson, isDownloaded: true } : lesson)))
  }

  const completedLessons = lessons.filter((lesson) => lesson.isCompleted).length
  const totalLessons = lessons.length
  const downloadedLessons = lessons.filter((lesson) => lesson.isDownloaded).length

  return (
    <RouteGuard requiredRole="student">
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <Navigation />

        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Welcome Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold font-display text-primary">Welcome Back, Student!</h1>
            <p className="text-muted-foreground text-lg">Ready to continue learning?</p>
          </div>

          {/* Progress Summary */}
          <ProgressSummary
            completedLessons={completedLessons}
            totalLessons={totalLessons}
            downloadedLessons={downloadedLessons}
          />

          {/* Offline Status */}
          {!isOnline && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <OfflineBadge />
                  <div>
                    <p className="font-medium">You're offline</p>
                    <p className="text-sm text-muted-foreground">
                      You can still access {downloadedLessons} downloaded lessons
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Queued Items Indicator */}
          {queuedItems > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium">Items waiting to sync</p>
                      <p className="text-sm text-muted-foreground">
                        {queuedItems} completed activities will sync when online
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Queue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Audio Instructions */}
          <div className="text-center">
            <Button
              variant="ghost"
              size="lg"
              className="audio-indicator"
              onClick={() => {
                const text = `Welcome to your learning dashboard! You have ${completedLessons} completed lessons out of ${totalLessons} total lessons. ${downloadedLessons} lessons are downloaded for offline use. Tap on any lesson to start learning.`

                if ("speechSynthesis" in window) {
                  const utterance = new SpeechSynthesisUtterance(text)
                  utterance.rate = 0.8
                  utterance.pitch = 1.1
                  speechSynthesis.speak(utterance)
                }
              }}
            >
              🔊 Listen to Overview
            </Button>
          </div>

          {/* Lessons Grid */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-primary">Your Lessons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onDownload={() => handleDownloadLesson(lesson.id)}
                  isOnline={isOnline}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  )
}

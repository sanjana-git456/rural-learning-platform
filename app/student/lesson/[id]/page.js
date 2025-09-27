"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { MediaPlayer } from "@/components/student/media-player"
import { Progress } from "@/components/ui/progress"

// Mock lesson data
const mockLessonData = {
  1: {
    id: 1,
    title: "Numbers 1-10",
    subject: "Math",
    duration: "15 min",
    description: "Learn to count from 1 to 10 with fun audio and visual aids",
    audioUrl: "/audio/numbers-1-10.mp3",
    videoUrl: "/video/numbers-1-10.mp4",
    imageUrl: "/colorful-numbers-1-to-10-educational.jpg",
    content: [
      { type: "audio", url: "/audio/intro-numbers.mp3", title: "Introduction" },
      { type: "image", url: "/placeholder.svg?height=200&width=300&query=number 1", title: "Number 1" },
      { type: "audio", url: "/audio/count-1-5.mp3", title: "Count 1 to 5" },
      { type: "image", url: "/placeholder.svg?height=200&width=300&query=numbers 1 to 5", title: "Numbers 1-5" },
      { type: "audio", url: "/audio/count-6-10.mp3", title: "Count 6 to 10" },
      { type: "image", url: "/placeholder.svg?height=200&width=300&query=numbers 6 to 10", title: "Numbers 6-10" },
    ],
    hasQuiz: true,
    isDownloaded: true,
  },
}

export default function LessonDetail() {
  const params = useParams()
  const router = useRouter()
  const lessonId = Number.parseInt(params.id)
  const lesson = mockLessonData[lessonId]

  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
            <Button onClick={() => router.push("/student")}>Back to Lessons</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentContent = lesson.content[currentContentIndex]
  const progressPercentage = ((currentContentIndex + 1) / lesson.content.length) * 100

  const handleNext = () => {
    if (currentContentIndex < lesson.content.length - 1) {
      setCurrentContentIndex((prev) => prev + 1)
      setProgress(progressPercentage)
    }
  }

  const handlePrevious = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex((prev) => prev - 1)
      setProgress(progressPercentage)
    }
  }

  const handleStartQuiz = () => {
    router.push(`/student/assessment/${lessonId}`)
  }

  const handleDownload = () => {
    // Simulate download
    alert("Lesson downloaded for offline use!")
  }

  const handleReportIssue = () => {
    // Store issue report for offline sync
    const issue = {
      lessonId,
      timestamp: Date.now(),
      type: "content_issue",
    }
    localStorage.setItem(`issue_${Date.now()}`, JSON.stringify(issue))
    alert("Issue reported! It will be sent when you're back online.")
  }

  const handleTTS = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text || currentContent.title)
      utterance.rate = 0.8
      utterance.pitch = 1.1
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Header userRole="student" isOnline={isOnline} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Lesson Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push("/student")}>
            ← Back to Lessons
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload} disabled={lesson.isDownloaded}>
              {lesson.isDownloaded ? "Downloaded" : "Download"}
            </Button>
            <Button variant="outline" onClick={handleReportIssue}>
              Report Issue
            </Button>
          </div>
        </div>

        {/* Lesson Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-display">{lesson.title}</CardTitle>
                <p className="text-muted-foreground mt-2">
                  {lesson.subject} • {lesson.duration}
                </p>
                <p className="mt-2">{lesson.description}</p>
              </div>
              <Button
                variant="ghost"
                size="lg"
                className="audio-indicator"
                onClick={() => handleTTS(lesson.description)}
              >
                🔊
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {currentContentIndex + 1} of {lesson.content.length} sections
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Media Player */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {currentContent.title}
              <Button variant="ghost" onClick={() => handleTTS(currentContent.title)} className="audio-indicator">
                🔊 Read Aloud
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MediaPlayer content={currentContent} isPlaying={isPlaying} onPlayStateChange={setIsPlaying} />
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <Button variant="outline" size="lg" onClick={handlePrevious} disabled={currentContentIndex === 0}>
            ← Previous
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {currentContentIndex + 1} / {lesson.content.length}
            </p>
          </div>

          {currentContentIndex === lesson.content.length - 1 ? (
            <Button
              size="lg"
              onClick={handleStartQuiz}
              disabled={!lesson.hasQuiz}
              className="bg-green-600 hover:bg-green-700"
            >
              Start Quiz →
            </Button>
          ) : (
            <Button size="lg" onClick={handleNext}>
              Next →
            </Button>
          )}
        </div>

        {/* Audio Instructions */}
        <div className="text-center">
          <Button
            variant="ghost"
            size="lg"
            className="audio-indicator"
            onClick={() => {
              const text = `You are viewing ${lesson.title}. This is section ${currentContentIndex + 1} of ${lesson.content.length}. Use the previous and next buttons to navigate, or tap the speaker button to hear content read aloud.`
              handleTTS(text)
            }}
          >
            🔊 Listen to Instructions
          </Button>
        </div>
      </main>
    </div>
  )
}

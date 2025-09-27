"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function LessonCard({ lesson, onDownload, isOnline }) {
  const handleStartLesson = () => {
    window.location.href = `/student/lesson/${lesson.id}`
  }

  const handlePlayAudio = () => {
    if ("speechSynthesis" in window) {
      const text = `${lesson.title}. ${lesson.subject} lesson. Duration: ${lesson.duration}. Difficulty: ${lesson.difficulty}.`
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1.1
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <Card className={`transition-all hover:shadow-md ${lesson.isCompleted ? "border-green-200 bg-green-50" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-display">{lesson.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{lesson.subject}</p>
          </div>
          <Button variant="ghost" size="sm" className="audio-indicator" onClick={handlePlayAudio}>
            🔊
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Lesson Image */}
        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
          <img src={lesson.imageUrl || "/placeholder.svg"} alt={lesson.title} className="w-full h-full object-cover" />
        </div>

        {/* Lesson Info */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{lesson.duration}</span>
          <Badge
            variant={
              lesson.difficulty === "Easy" ? "secondary" : lesson.difficulty === "Medium" ? "default" : "destructive"
            }
          >
            {lesson.difficulty}
          </Badge>
        </div>

        {/* Status Badges */}
        <div className="flex gap-2">
          {lesson.isCompleted && (
            <Badge variant="default" className="bg-green-600">
              ✓ Completed
            </Badge>
          )}
          {lesson.isDownloaded && <Badge variant="outline">📱 Downloaded</Badge>}
          {!isOnline && !lesson.isDownloaded && <Badge variant="destructive">⚠ Needs Download</Badge>}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleStartLesson} className="flex-1" disabled={!isOnline && !lesson.isDownloaded}>
            {lesson.isCompleted ? "Review" : "Start"} Lesson
          </Button>

          {!lesson.isDownloaded && isOnline && (
            <Button variant="outline" onClick={onDownload} size="sm">
              📥 Download
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

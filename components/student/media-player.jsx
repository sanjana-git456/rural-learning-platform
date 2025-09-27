"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function MediaPlayer({ content, isPlaying, onPlayStateChange }) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", () => onPlayStateChange(false))

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", () => onPlayStateChange(false))
    }
  }, [onPlayStateChange])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    onPlayStateChange(!isPlaying)
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Visual Content */}
      {content.type === "image" && (
        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
          <img src={content.url || "/placeholder.svg"} alt={content.title} className="w-full h-full object-cover" />
        </div>
      )}

      {content.type === "video" && (
        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
          <video src={content.url} controls className="w-full h-full" poster="/video-thumbnail.png">
            Your browser does not support video playback.
          </video>
        </div>
      )}

      {/* Audio Player */}
      {content.type === "audio" && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Audio Element (hidden) */}
              <audio ref={audioRef} src={content.url} preload="metadata" />

              {/* Play Controls */}
              <div className="flex items-center justify-center">
                <Button onClick={togglePlay} size="lg" className="w-16 h-16 rounded-full">
                  {isPlaying ? "⏸️" : "▶️"}
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Audio Visualization */}
              <div className="flex items-center justify-center gap-1 h-8">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-primary rounded-full transition-all ${isPlaying ? "animate-pulse" : ""}`}
                    style={{
                      height: `${Math.random() * 100 + 20}%`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Text-to-Speech Button */}
      <div className="text-center">
        <Button
          variant="outline"
          size="lg"
          className="audio-indicator bg-transparent"
          onClick={() => {
            if ("speechSynthesis" in window) {
              const utterance = new SpeechSynthesisUtterance(content.title)
              utterance.rate = 0.8
              utterance.pitch = 1.1
              speechSynthesis.speak(utterance)
            }
          }}
        >
          🔊 Read Title Aloud
        </Button>
      </div>
    </div>
  )
}

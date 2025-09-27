"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function MediaUpload({ onUpload }) {
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = (type, files) => {
    if (files && files.length > 0) {
      onUpload(type, Array.from(files))
    }
  }

  const handleDrop = (e, type) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    handleFileSelect(type, files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  return (
    <div className="space-y-6">
      {/* Audio Upload */}
      <Card
        className={`border-2 border-dashed transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`}
      >
        <CardContent
          className="p-6 text-center"
          onDrop={(e) => handleDrop(e, "audio")}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-4xl mb-2">🎵</div>
          <h3 className="font-medium mb-2">Audio Content</h3>
          <p className="text-sm text-muted-foreground mb-4">Upload audio files for narration and instructions</p>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => handleFileSelect("audio", e.target.files)}
            className="hidden"
            id="audio-upload"
          />
          <Button variant="outline" onClick={() => document.getElementById("audio-upload").click()}>
            Choose Audio Files
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Supported: MP3, WAV, M4A</p>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card
        className={`border-2 border-dashed transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`}
      >
        <CardContent
          className="p-6 text-center"
          onDrop={(e) => handleDrop(e, "image")}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-4xl mb-2">🖼️</div>
          <h3 className="font-medium mb-2">Images</h3>
          <p className="text-sm text-muted-foreground mb-4">Upload images, diagrams, and visual aids</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect("image", e.target.files)}
            className="hidden"
            id="image-upload"
          />
          <Button variant="outline" onClick={() => document.getElementById("image-upload").click()}>
            Choose Images
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Supported: JPG, PNG, GIF (Multiple files allowed)</p>
        </CardContent>
      </Card>

      {/* Video Upload */}
      <Card
        className={`border-2 border-dashed transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`}
      >
        <CardContent
          className="p-6 text-center"
          onDrop={(e) => handleDrop(e, "video")}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-4xl mb-2">🎬</div>
          <h3 className="font-medium mb-2">Video Content</h3>
          <p className="text-sm text-muted-foreground mb-4">Upload video lessons and demonstrations</p>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileSelect("video", e.target.files)}
            className="hidden"
            id="video-upload"
          />
          <Button variant="outline" onClick={() => document.getElementById("video-upload").click()}>
            Choose Video Files
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Supported: MP4, MOV, AVI</p>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>💡 Tip: Keep file sizes small for better offline performance</p>
      </div>
    </div>
  )
}

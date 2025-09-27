"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/layout/header"
import { MediaUpload } from "@/components/teacher/media-upload"

export default function CreateLesson() {
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    grade: "",
    duration: "",
    description: "",
    difficulty: "Easy",
    audioFile: null,
    imageFiles: [],
    videoFile: null,
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMediaUpload = (type, files) => {
    if (type === "audio") {
      setFormData((prev) => ({ ...prev, audioFile: files[0] }))
    } else if (type === "image") {
      setFormData((prev) => ({ ...prev, imageFiles: [...prev.imageFiles, ...files] }))
    } else if (type === "video") {
      setFormData((prev) => ({ ...prev, videoFile: files[0] }))
    }
  }

  const handleSaveDraft = async () => {
    setIsLoading(true)

    try {
      // Save as draft (offline-capable)
      const draft = {
        ...formData,
        id: Date.now(),
        status: "draft",
        createdAt: new Date().toISOString(),
        isOnline,
      }

      if (isOnline) {
        // Save to server
        console.log("Saving draft to server:", draft)
      } else {
        // Save locally for offline sync
        const drafts = JSON.parse(localStorage.getItem("lesson_drafts") || "[]")
        drafts.push(draft)
        localStorage.setItem("lesson_drafts", JSON.stringify(drafts))
      }

      alert("Lesson saved as draft!")
      router.push("/teacher")
    } catch (error) {
      alert("Failed to save draft. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = async () => {
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.subject || !formData.grade) {
        alert("Please fill in all required fields")
        return
      }

      const lesson = {
        ...formData,
        id: Date.now(),
        status: "published",
        createdAt: new Date().toISOString(),
        isOnline,
      }

      if (isOnline) {
        // Publish to server
        console.log("Publishing lesson to server:", lesson)
      } else {
        // Queue for offline sync
        const queuedLessons = JSON.parse(localStorage.getItem("queued_lessons") || "[]")
        queuedLessons.push(lesson)
        localStorage.setItem("queued_lessons", JSON.stringify(queuedLessons))
      }

      alert("Lesson published successfully!")
      router.push("/teacher")
    } catch (error) {
      alert("Failed to publish lesson. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Header userRole="teacher" isOnline={isOnline} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display text-primary">Create New Lesson</h1>
            <p className="text-muted-foreground">Upload content and create engaging lessons</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/teacher")}>
            ← Back to Dashboard
          </Button>
        </div>

        {/* Offline Warning */}
        {!isOnline && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Working Offline</p>
                  <p className="text-sm text-muted-foreground">
                    Your lesson will be saved locally and published when you're back online
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lesson Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Lesson Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter lesson title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select onValueChange={(value) => handleInputChange("subject", value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="language">Language</SelectItem>
                        <SelectItem value="art">Art</SelectItem>
                        <SelectItem value="social">Social Studies</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="grade">Grade Level *</Label>
                    <Select onValueChange={(value) => handleInputChange("grade", value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Grade 1</SelectItem>
                        <SelectItem value="2">Grade 2</SelectItem>
                        <SelectItem value="3">Grade 3</SelectItem>
                        <SelectItem value="4">Grade 4</SelectItem>
                        <SelectItem value="5">Grade 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="15"
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => handleInputChange("difficulty", value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Lesson Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what students will learn in this lesson..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="min-h-24"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Media Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Lesson Content</CardTitle>
                <p className="text-sm text-muted-foreground">Upload audio, images, and video content for your lesson</p>
              </CardHeader>
              <CardContent>
                <MediaUpload onUpload={handleMediaUpload} />
              </CardContent>
            </Card>
          </div>

          {/* Preview & Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  {formData.imageFiles.length > 0 ? (
                    <img
                      src={URL.createObjectURL(formData.imageFiles[0]) || "/placeholder.svg"}
                      alt="Lesson preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <div className="text-4xl mb-2">📚</div>
                      <p>Upload images to see preview</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">{formData.title || "Lesson Title"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formData.subject && formData.grade
                      ? `${formData.subject} • Grade ${formData.grade}`
                      : "Subject • Grade"}
                  </p>
                  <p className="text-sm">{formData.description || "Lesson description will appear here..."}</p>
                </div>

                {/* Content Summary */}
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-medium text-sm">Content Summary:</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Audio files:</span>
                      <span>{formData.audioFile ? 1 : 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Images:</span>
                      <span>{formData.imageFiles.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Video files:</span>
                      <span>{formData.videoFile ? 1 : 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleSaveDraft}
                variant="outline"
                size="lg"
                className="w-full bg-transparent"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save as Draft"}
              </Button>
              <Button
                onClick={handlePublish}
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading || !formData.title || !formData.subject || !formData.grade}
              >
                {isLoading ? "Publishing..." : "Publish Lesson"}
              </Button>
            </div>

            {/* Audio Instructions */}
            <div className="text-center">
              <Button
                variant="ghost"
                className="audio-indicator"
                onClick={() => {
                  const text =
                    "Create lesson page. Fill in the lesson title, subject, and grade level. Upload audio, images, or video content. Save as draft or publish when ready."

                  if ("speechSynthesis" in window) {
                    const utterance = new SpeechSynthesisUtterance(text)
                    utterance.rate = 0.8
                    utterance.pitch = 1.1
                    speechSynthesis.speak(utterance)
                  }
                }}
              >
                🔊 Listen to Instructions
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

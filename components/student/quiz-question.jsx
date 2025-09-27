"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function QuizQuestion({ question, selectedAnswer, onAnswerSelect }) {
  const handlePlayAudio = () => {
    if (question.audioUrl && "speechSynthesis" in window) {
      // In a real app, this would play the actual audio file
      // For now, we'll use TTS as fallback
      const utterance = new SpeechSynthesisUtterance(question.question)
      utterance.rate = 0.8
      utterance.pitch = 1.1
      speechSynthesis.speak(utterance)
    }
  }

  const handleOptionAudio = (option, index) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(`Option ${index + 1}: ${option}`)
      utterance.rate = 0.8
      utterance.pitch = 1.1
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-display">{question.question}</CardTitle>
          <Button variant="ghost" size="sm" className="audio-indicator" onClick={handlePlayAudio}>
            🔊
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question Image */}
        {question.imageUrl && (
          <div className="aspect-video rounded-lg overflow-hidden bg-muted max-w-md mx-auto">
            <img
              src={question.imageUrl || "/placeholder.svg"}
              alt="Question illustration"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Audio Question Indicator */}
        {question.type === "audio" && (
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-4xl mb-2">🎧</div>
            <p className="text-blue-700 font-medium">Listen carefully to the audio</p>
            <Button variant="outline" onClick={handlePlayAudio} className="mt-2 bg-transparent">
              🔊 Play Audio
            </Button>
          </div>
        )}

        {/* Answer Options */}
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              size="lg"
              onClick={() => onAnswerSelect(index)}
              className="h-auto p-4 text-left justify-start relative"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1 text-lg">{option}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOptionAudio(option, index)
                  }}
                  className="flex-shrink-0"
                >
                  🔊
                </Button>
              </div>
            </Button>
          ))}
        </div>

        {/* Instructions */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Tap an option to select your answer, or use the speaker buttons to hear options read aloud.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

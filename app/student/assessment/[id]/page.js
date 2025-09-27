"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { QuizQuestion } from "@/components/student/quiz-question"
import { Progress } from "@/components/ui/progress"

// Mock quiz data
const mockQuizData = {
  1: {
    id: 1,
    lessonId: 1,
    title: "Numbers 1-10 Quiz",
    questions: [
      {
        id: 1,
        type: "mcq",
        question: "What comes after number 5?",
        audioUrl: "/audio/question-1.mp3",
        options: ["4", "6", "7", "3"],
        correctAnswer: 1,
        imageUrl: "/number-five.png",
      },
      {
        id: 2,
        type: "audio",
        question: "Listen and choose the correct number",
        audioUrl: "/audio/question-2-audio.mp3",
        options: ["8", "3", "9", "2"],
        correctAnswer: 2,
        imageUrl: null,
      },
      {
        id: 3,
        type: "mcq",
        question: "How many fingers do you have on one hand?",
        audioUrl: "/audio/question-3.mp3",
        options: ["3", "4", "5", "6"],
        correctAnswer: 2,
        imageUrl: "/hand-with-5-fingers.jpg",
      },
      {
        id: 4,
        type: "mcq",
        question: "Which is the biggest number?",
        audioUrl: "/audio/question-4.mp3",
        options: ["7", "10", "3", "8"],
        correctAnswer: 1,
        imageUrl: "/numbers-7-10-3-8.jpg",
      },
    ],
  },
}

export default function Assessment() {
  const params = useParams()
  const router = useRouter()
  const lessonId = Number.parseInt(params.id)
  const quiz = mockQuizData[lessonId]

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(timer)
    }
  }, [])

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Not Found</h2>
            <Button onClick={() => router.push("/student")}>Back to Lessons</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      handleSubmitQuiz()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSubmitQuiz = () => {
    // Calculate score
    let correctAnswers = 0
    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / quiz.questions.length) * 100)

    // Store results (offline-capable)
    const result = {
      lessonId,
      quizId: quiz.id,
      answers,
      score,
      completedAt: Date.now(),
      isOnline,
    }

    if (isOnline) {
      // Submit immediately
      console.log("Submitting quiz result:", result)
    } else {
      // Queue for offline sync
      const queuedResults = JSON.parse(localStorage.getItem("queued_quiz_results") || "[]")
      queuedResults.push(result)
      localStorage.setItem("queued_quiz_results", JSON.stringify(queuedResults))
    }

    setShowResults(true)
  }

  const calculateScore = () => {
    let correctAnswers = 0
    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })
    return Math.round((correctAnswers / quiz.questions.length) * 100)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (showResults) {
    const score = calculateScore()
    const passed = score >= 70

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <Header userRole="student" isOnline={isOnline} />

        <main className="container mx-auto px-4 py-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">{passed ? "🎉" : "📚"}</div>
              <CardTitle className="text-3xl font-display">{passed ? "Great Job!" : "Keep Learning!"}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-2">
                <p className="text-4xl font-bold text-primary">{score}%</p>
                <p className="text-muted-foreground">
                  You got{" "}
                  {
                    Object.values(answers).filter((answer, index) => answer === quiz.questions[index]?.correctAnswer)
                      .length
                  }{" "}
                  out of {quiz.questions.length} questions correct
                </p>
              </div>

              {!isOnline && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Your results have been saved and will sync when you're back online.
                  </p>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push(`/student/lesson/${lessonId}`)} variant="outline">
                  Review Lesson
                </Button>
                <Button onClick={() => router.push("/student")} className="bg-green-600 hover:bg-green-700">
                  Continue Learning
                </Button>
              </div>

              <Button
                variant="ghost"
                size="lg"
                className="audio-indicator"
                onClick={() => {
                  const text = `Quiz completed! You scored ${score} percent. ${passed ? "Excellent work! You passed the quiz." : "Keep practicing! Review the lesson and try again."}`

                  if ("speechSynthesis" in window) {
                    const utterance = new SpeechSynthesisUtterance(text)
                    utterance.rate = 0.8
                    utterance.pitch = 1.1
                    speechSynthesis.speak(utterance)
                  }
                }}
              >
                🔊 Listen to Results
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Header userRole="student" isOnline={isOnline} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Quiz Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push(`/student/lesson/${lessonId}`)}>
            ← Back to Lesson
          </Button>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">Time: {formatTime(timeLeft)}</div>
            {!isOnline && <div className="bg-orange-100 px-3 py-1 rounded-full text-sm">Offline Mode</div>}
          </div>
        </div>

        {/* Quiz Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-display">{quiz.title}</CardTitle>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>
                  {currentQuestionIndex + 1} of {quiz.questions.length}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Question */}
        <QuizQuestion
          question={currentQuestion}
          selectedAnswer={answers[currentQuestion.id]}
          onAnswerSelect={(answerIndex) => handleAnswerSelect(currentQuestion.id, answerIndex)}
        />

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" size="lg" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            ← Previous
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
          </div>

          <Button
            size="lg"
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined}
            className={currentQuestionIndex === quiz.questions.length - 1 ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? "Submit Quiz" : "Next →"}
          </Button>
        </div>
      </main>
    </div>
  )
}

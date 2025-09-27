"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RouteGuard } from "@/components/auth/route-guard"
import { Navigation } from "@/components/layout/navigation"
import { ClassSummaryCard } from "@/components/teacher/class-summary-card"
import { QuickActions } from "@/components/teacher/quick-actions"
import { PendingApprovals } from "@/components/teacher/pending-approvals"

// Mock data for classes
const mockClasses = [
  {
    id: 1,
    name: "Grade 1A",
    totalStudents: 25,
    presentToday: 22,
    lessonsCompleted: 15,
    totalLessons: 20,
    averageScore: 78,
  },
  {
    id: 2,
    name: "Grade 1B",
    totalStudents: 28,
    presentToday: 25,
    lessonsCompleted: 12,
    totalLessons: 20,
    averageScore: 82,
  },
  {
    id: 3,
    name: "Grade 2A",
    totalStudents: 23,
    presentToday: 20,
    lessonsCompleted: 18,
    totalLessons: 22,
    averageScore: 75,
  },
]

const mockPendingApprovals = [
  {
    id: 1,
    type: "lesson",
    title: "New Math Lesson: Addition",
    submittedBy: "Teacher Sarah",
    submittedAt: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    type: "student",
    title: "Student Registration: Raj Kumar",
    submittedBy: "Guardian",
    submittedAt: "1 day ago",
    status: "pending",
  },
  {
    id: 3,
    type: "attendance",
    title: "Attendance Correction: Grade 1A",
    submittedBy: "Teacher John",
    submittedAt: "3 hours ago",
    status: "pending",
  },
]

export default function TeacherHome() {
  const [classes, setClasses] = useState(mockClasses)
  const [pendingApprovals, setPendingApprovals] = useState(mockPendingApprovals)
  const [isOnline, setIsOnline] = useState(true)

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

  const totalStudents = classes.reduce((sum, cls) => sum + cls.totalStudents, 0)
  const totalPresent = classes.reduce((sum, cls) => sum + cls.presentToday, 0)
  const attendanceRate = Math.round((totalPresent / totalStudents) * 100)

  return (
    <RouteGuard requiredRole="teacher">
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        {/* Navigation Component */}
        <Navigation />

        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Welcome Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold font-display text-primary">Teacher Dashboard</h1>
            <p className="text-muted-foreground text-lg">Manage your classes and lessons</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{classes.length}</p>
                <p className="text-sm text-muted-foreground">Classes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{totalPresent}</p>
                <p className="text-sm text-muted-foreground">Present Today</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">{attendanceRate}%</p>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <QuickActions isOnline={isOnline} />

          {/* Pending Approvals */}
          <PendingApprovals
            approvals={pendingApprovals}
            onApprove={(id) => {
              setPendingApprovals((prev) => prev.filter((approval) => approval.id !== id))
            }}
            onReject={(id) => {
              setPendingApprovals((prev) => prev.filter((approval) => approval.id !== id))
            }}
          />

          {/* Class Summary Cards */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-primary">Your Classes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((classData) => (
                <ClassSummaryCard key={classData.id} classData={classData} isOnline={isOnline} />
              ))}
            </div>
          </div>

          {/* Audio Instructions */}
          <div className="text-center">
            <Button
              variant="ghost"
              size="lg"
              className="audio-indicator"
              onClick={() => {
                const text = `Teacher dashboard overview: You have ${classes.length} classes with ${totalStudents} total students. ${totalPresent} students are present today, giving an attendance rate of ${attendanceRate} percent. You have ${pendingApprovals.length} pending approvals to review.`

                if ("speechSynthesis" in window) {
                  const utterance = new SpeechSynthesisUtterance(text)
                  utterance.rate = 0.8
                  utterance.pitch = 1.1
                  speechSynthesis.speak(utterance)
                }
              }}
            >
              🔊 Listen to Dashboard Overview
            </Button>
          </div>
        </main>
      </div>
    </RouteGuard>
  )
}

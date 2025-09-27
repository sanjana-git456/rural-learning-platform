"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function ClassSummaryCard({ classData, isOnline }) {
  const attendanceRate = Math.round((classData.presentToday / classData.totalStudents) * 100)
  const lessonProgress = Math.round((classData.lessonsCompleted / classData.totalLessons) * 100)

  const handleViewClass = () => {
    window.location.href = `/teacher/class/${classData.id}`
  }

  const handleTakeAttendance = () => {
    window.location.href = `/teacher/attendance?class=${classData.id}`
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display">{classData.name}</CardTitle>
          <Badge variant={attendanceRate >= 80 ? "default" : "destructive"}>{attendanceRate}% Present</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{classData.totalStudents}</p>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{classData.presentToday}</p>
            <p className="text-xs text-muted-foreground">Present Today</p>
          </div>
        </div>

        {/* Lesson Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Lesson Progress</span>
            <span>
              {classData.lessonsCompleted}/{classData.totalLessons}
            </span>
          </div>
          <Progress value={lessonProgress} className="h-2" />
        </div>

        {/* Average Score */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Average Score</span>
          <span className="font-semibold text-primary">{classData.averageScore}%</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewClass}
            className="flex-1 bg-transparent"
            disabled={!isOnline}
          >
            View Details
          </Button>
          <Button size="sm" onClick={handleTakeAttendance} className="flex-1">
            Take Attendance
          </Button>
        </div>

        {/* Offline Indicator */}
        {!isOnline && (
          <div className="text-xs text-orange-600 text-center">Some features require internet connection</div>
        )}
      </CardContent>
    </Card>
  )
}

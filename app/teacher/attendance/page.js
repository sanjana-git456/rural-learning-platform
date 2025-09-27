"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/layout/header"
import { AttendanceRow } from "@/components/teacher/attendance-row"
import { Calendar } from "@/components/ui/calendar"

// Mock data for classes and students
const mockClasses = [
  { id: 1, name: "Grade 1A" },
  { id: 2, name: "Grade 1B" },
  { id: 3, name: "Grade 2A" },
]

const mockStudents = {
  1: [
    { id: 1, name: "Raj Kumar", rollNumber: "001", isPresent: true },
    { id: 2, name: "Priya Sharma", rollNumber: "002", isPresent: true },
    { id: 3, name: "Amit Singh", rollNumber: "003", isPresent: false },
    { id: 4, name: "Sunita Devi", rollNumber: "004", isPresent: true },
    { id: 5, name: "Ravi Gupta", rollNumber: "005", isPresent: true },
    { id: 6, name: "Meera Patel", rollNumber: "006", isPresent: false },
    { id: 7, name: "Vikash Kumar", rollNumber: "007", isPresent: true },
    { id: 8, name: "Anita Singh", rollNumber: "008", isPresent: true },
  ],
  2: [
    { id: 9, name: "Deepak Yadav", rollNumber: "001", isPresent: true },
    { id: 10, name: "Kavita Devi", rollNumber: "002", isPresent: false },
    { id: 11, name: "Suresh Kumar", rollNumber: "003", isPresent: true },
    { id: 12, name: "Pooja Sharma", rollNumber: "004", isPresent: true },
  ],
  3: [
    { id: 13, name: "Ramesh Singh", rollNumber: "001", isPresent: true },
    { id: 14, name: "Sita Devi", rollNumber: "002", isPresent: true },
    { id: 15, name: "Mohan Kumar", rollNumber: "003", isPresent: false },
  ],
}

export default function Attendance() {
  const router = useRouter()
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [students, setStudents] = useState([])
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    if (selectedClass) {
      setStudents(mockStudents[selectedClass] || [])
    }
  }, [selectedClass])

  const handleAttendanceChange = (studentId, isPresent) => {
    setStudents((prev) => prev.map((student) => (student.id === studentId ? { ...student, isPresent } : student)))
  }

  const handleBulkAction = (action) => {
    if (action === "mark_all_present") {
      setStudents((prev) => prev.map((student) => ({ ...student, isPresent: true })))
    } else if (action === "mark_all_absent") {
      setStudents((prev) => prev.map((student) => ({ ...student, isPresent: false })))
    }
  }

  const handleSaveAttendance = async () => {
    if (!selectedClass) {
      alert("Please select a class first")
      return
    }

    setIsLoading(true)

    try {
      const attendanceData = {
        classId: selectedClass,
        date: selectedDate.toISOString().split("T")[0],
        students: students.map((student) => ({
          id: student.id,
          isPresent: student.isPresent,
        })),
        submittedAt: new Date().toISOString(),
        isOnline,
      }

      if (isOnline) {
        // Submit to server
        console.log("Submitting attendance to server:", attendanceData)
        alert("Attendance saved successfully!")
      } else {
        // Queue for offline sync
        const queuedAttendance = JSON.parse(localStorage.getItem("queued_attendance") || "[]")
        queuedAttendance.push(attendanceData)
        localStorage.setItem("queued_attendance", JSON.stringify(queuedAttendance))
        alert("Attendance saved offline. Will sync when online.")
      }

      router.push("/teacher")
    } catch (error) {
      alert("Failed to save attendance. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const presentCount = students.filter((student) => student.isPresent).length
  const totalCount = students.length
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Header userRole="teacher" isOnline={isOnline} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display text-primary">Mark Attendance</h1>
            <p className="text-muted-foreground">Record student attendance for your classes</p>
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
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-medium">Working Offline</p>
                  <p className="text-sm text-muted-foreground">
                    Attendance will be saved locally and synced when you're back online
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Class & Date</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Class</label>
                  <Select onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClasses.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Date</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedClass && (
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => handleBulkAction("mark_all_present")}
                  >
                    Mark All Present
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => handleBulkAction("mark_all_absent")}
                  >
                    Mark All Absent
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Attendance List */}
          <div className="lg:col-span-3 space-y-6">
            {selectedClass ? (
              <>
                {/* Summary */}
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                        <p className="text-sm text-muted-foreground">Present</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">{totalCount - presentCount}</p>
                        <p className="text-sm text-muted-foreground">Absent</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">{attendanceRate}%</p>
                        <p className="text-sm text-muted-foreground">Attendance Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Student List */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {mockClasses.find((cls) => cls.id.toString() === selectedClass)?.name} -{" "}
                      {selectedDate.toLocaleDateString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {students.map((student) => (
                        <AttendanceRow key={student.id} student={student} onAttendanceChange={handleAttendanceChange} />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveAttendance}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Attendance"}
                  </Button>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold mb-2">Select a Class</h3>
                  <p className="text-muted-foreground">Choose a class from the dropdown to start marking attendance</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Audio Instructions */}
        <div className="text-center">
          <Button
            variant="ghost"
            size="lg"
            className="audio-indicator"
            onClick={() => {
              const text = selectedClass
                ? `Attendance page for ${mockClasses.find((cls) => cls.id.toString() === selectedClass)?.name}. ${presentCount} students present out of ${totalCount}. Use the checkboxes to mark attendance or use bulk actions.`
                : "Attendance page. Select a class and date to start marking attendance. Use bulk actions to mark all students present or absent at once."

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
      </main>
    </div>
  )
}

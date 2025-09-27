"use client"

import { Checkbox } from "@/components/ui/checkbox"

export function AttendanceRow({ student, onAttendanceChange }) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
        student.isPresent ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary">
          {student.rollNumber}
        </div>
        <div>
          <p className="font-medium">{student.name}</p>
          <p className="text-sm text-muted-foreground">Roll No: {student.rollNumber}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`present-${student.id}`}
            checked={student.isPresent}
            onCheckedChange={(checked) => onAttendanceChange(student.id, checked)}
          />
          <label htmlFor={`present-${student.id}`} className="text-sm font-medium cursor-pointer">
            Present
          </label>
        </div>

        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            student.isPresent ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {student.isPresent ? "Present" : "Absent"}
        </div>
      </div>
    </div>
  )
}

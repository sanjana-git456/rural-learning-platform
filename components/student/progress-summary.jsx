import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function ProgressSummary({ completedLessons, totalLessons, downloadedLessons }) {
  const completionPercentage = (completedLessons / totalLessons) * 100
  const downloadPercentage = (downloadedLessons / totalLessons) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-display">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Completion Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Lessons Completed</span>
            <span>
              {completedLessons} of {totalLessons}
            </span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
          <p className="text-xs text-muted-foreground">{Math.round(completionPercentage)}% complete</p>
        </div>

        {/* Download Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Downloaded for Offline</span>
            <span>
              {downloadedLessons} of {totalLessons}
            </span>
          </div>
          <Progress value={downloadPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">{Math.round(downloadPercentage)}% downloaded</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{completedLessons}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{totalLessons - completedLessons}</p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{downloadedLessons}</p>
            <p className="text-xs text-muted-foreground">Downloaded</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function PendingApprovals({ approvals, onApprove, onReject }) {
  if (approvals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-muted-foreground">No pending approvals</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "lesson":
        return "📚"
      case "student":
        return "👤"
      case "attendance":
        return "📋"
      default:
        return "📄"
    }
  }

  const getTypeBadge = (type) => {
    switch (type) {
      case "lesson":
        return <Badge variant="default">Lesson</Badge>
      case "student":
        return <Badge variant="secondary">Student</Badge>
      case "attendance":
        return <Badge variant="outline">Attendance</Badge>
      default:
        return <Badge>Other</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Pending Approvals
          <Badge variant="destructive">{approvals.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {approvals.map((approval) => (
            <div key={approval.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{getTypeIcon(approval.type)}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{approval.title}</h4>
                    {getTypeBadge(approval.type)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    By {approval.submittedBy} • {approval.submittedAt}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onReject(approval.id)}>
                  Reject
                </Button>
                <Button size="sm" onClick={() => onApprove(approval.id)} className="bg-green-600 hover:bg-green-700">
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

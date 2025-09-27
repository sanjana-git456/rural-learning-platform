"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { RouteGuard } from "@/components/auth/route-guard"
import { Navigation } from "@/components/layout/navigation"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, BookOpen, TrendingUp, Award, Download, Filter, Calendar } from "lucide-react"

const COLORS = ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#fff7ed"]

export default function AdminReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState(null)

  useEffect(() => {
    // Simulate loading admin data
    setTimeout(() => {
      setReportData({
        overview: {
          totalStudents: 1247,
          activeTeachers: 89,
          completedLessons: 3456,
          averageProgress: 67,
        },
        enrollmentTrend: [
          { month: "Jan", students: 850, teachers: 65 },
          { month: "Feb", students: 920, teachers: 71 },
          { month: "Mar", students: 1050, teachers: 78 },
          { month: "Apr", students: 1180, teachers: 84 },
          { month: "May", students: 1247, teachers: 89 },
        ],
        subjectPerformance: [
          { subject: "Math", completion: 78, avgScore: 85 },
          { subject: "Science", completion: 72, avgScore: 82 },
          { subject: "Language", completion: 85, avgScore: 88 },
          { subject: "Social Studies", completion: 69, avgScore: 79 },
        ],
        regionDistribution: [
          { name: "North Region", value: 35, students: 436 },
          { name: "South Region", value: 28, students: 349 },
          { name: "East Region", value: 22, students: 274 },
          { name: "West Region", value: 15, students: 188 },
        ],
        deviceUsage: [
          { type: "Mobile", percentage: 68 },
          { type: "Tablet", percentage: 25 },
          { type: "Desktop", percentage: 7 },
        ],
      })
      setLoading(false)
    }, 1000)
  }, [selectedPeriod, selectedRegion])

  const exportReport = () => {
    // Simulate report export
    const reportContent = JSON.stringify(reportData, null, 2)
    const blob = new Blob([reportContent], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `admin-report-${selectedPeriod}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-600">Loading admin reports...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <RouteGuard requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <Navigation />

        <div className="p-4">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-fredoka">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Comprehensive platform analytics and reports</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="north">North Region</SelectItem>
                    <SelectItem value="south">South Region</SelectItem>
                    <SelectItem value="east">East Region</SelectItem>
                    <SelectItem value="west">West Region</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={exportReport} className="bg-orange-500 hover:bg-orange-600">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {reportData.overview.totalStudents.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
                  <BookOpen className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{reportData.overview.activeTeachers}</div>
                  <p className="text-xs text-gray-600 mt-1">+6% from last month</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
                  <Award className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {reportData.overview.completedLessons.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">+18% from last month</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{reportData.overview.averageProgress}%</div>
                  <Progress value={reportData.overview.averageProgress} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="font-fredoka">Enrollment Trends</CardTitle>
                  <CardDescription>Student and teacher growth over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={reportData.enrollmentTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="students" stroke="#f97316" strokeWidth={3} />
                      <Line type="monotone" dataKey="teachers" stroke="#fb923c" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="font-fredoka">Regional Distribution</CardTitle>
                  <CardDescription>Student distribution across regions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportData.regionDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {reportData.regionDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="font-fredoka">Subject Performance</CardTitle>
                  <CardDescription>Completion rates and average scores by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.subjectPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completion" fill="#f97316" />
                      <Bar dataKey="avgScore" fill="#fb923c" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="font-fredoka">Device Usage</CardTitle>
                  <CardDescription>Platform access by device type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.deviceUsage.map((device, index) => (
                      <div key={device.type} className="flex items-center justify-between">
                        <span className="font-medium">{device.type}</span>
                        <div className="flex items-center gap-3">
                          <Progress value={device.percentage} className="w-32" />
                          <span className="text-sm font-medium w-12">{device.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Reports Table */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="font-fredoka">Regional Performance Details</CardTitle>
                <CardDescription>Detailed breakdown by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-orange-200">
                        <th className="text-left p-3 font-medium">Region</th>
                        <th className="text-left p-3 font-medium">Students</th>
                        <th className="text-left p-3 font-medium">Teachers</th>
                        <th className="text-left p-3 font-medium">Completion Rate</th>
                        <th className="text-left p-3 font-medium">Avg Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.regionDistribution.map((region, index) => (
                        <tr key={region.name} className="border-b border-orange-100 hover:bg-orange-50">
                          <td className="p-3 font-medium">{region.name}</td>
                          <td className="p-3">{region.students}</td>
                          <td className="p-3">{Math.floor(region.students / 14)}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Progress value={75 + index * 3} className="w-20" />
                              <span className="text-sm">{75 + index * 3}%</span>
                            </div>
                          </td>
                          <td className="p-3">{82 + index * 2}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}

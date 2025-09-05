"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  BookOpen,
  Users,
  Eye,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  Calendar,
  Clock,
  CheckCircle,
  Download,
  Edit,
  Copy,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { LiveProctoringPanel } from "./live-proctoring-panel"
import { ExamReports } from "./exam-reports"

// Mock data for demonstration
const upcomingExams = [
  {
    id: "1",
    title: "Mathematics Final Exam",
    subject: "Advanced Calculus",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: "2 hours",
    studentsEnrolled: 45,
    studentsActive: 0,
    status: "scheduled",
  },
  {
    id: "2",
    title: "Physics Midterm",
    subject: "Quantum Mechanics",
    date: "2024-01-18",
    time: "2:00 PM",
    duration: "1.5 hours",
    studentsEnrolled: 32,
    studentsActive: 0,
    status: "scheduled",
  },
]

const activeExams = [
  {
    id: "3",
    title: "Computer Science Quiz",
    subject: "Data Structures",
    date: "2024-01-12",
    time: "9:00 AM",
    duration: "45 minutes",
    studentsEnrolled: 28,
    studentsActive: 24,
    status: "active",
    violations: 3,
  },
]

const completedExams = [
  {
    id: "4",
    title: "Chemistry Lab Test",
    subject: "Organic Chemistry",
    date: "2024-01-10",
    studentsCompleted: 38,
    averageScore: "84%",
    averageIntegrity: "92%",
    status: "completed",
  },
  {
    id: "5",
    title: "History Essay Exam",
    subject: "World War II",
    date: "2024-01-08",
    studentsCompleted: 42,
    averageScore: "78%",
    averageIntegrity: "89%",
    status: "completed",
  },
]

export function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Satark</h1>
                <p className="text-sm text-muted-foreground">Teacher Dashboard</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">Dr. Sarah Johnson</span>
              </div>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, Dr. Johnson!</h2>
          <p className="text-muted-foreground">Manage your exams and monitor academic integrity.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Exams</p>
                  <p className="text-2xl font-bold">{upcomingExams.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Exams</p>
                  <p className="text-2xl font-bold">{activeExams.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Students Active</p>
                  <p className="text-2xl font-bold">
                    {activeExams.reduce((sum, exam) => sum + exam.studentsActive, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed Exams</p>
                  <p className="text-2xl font-bold">{completedExams.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="proctoring">Live Proctoring</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your exams and get started quickly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Link href="/teacher/exam/create">
                    <Button className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Create New Exam</span>
                    </Button>
                  </Link>
                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    <span>Export Reports</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                    <Settings className="h-4 w-4" />
                    <span>Exam Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Active Exams Alert */}
            {activeExams.length > 0 && (
              <Card className="border-accent/50 bg-accent/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-accent">
                    <Eye className="h-5 w-5" />
                    <span>Active Exams Requiring Attention</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeExams.map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <h4 className="font-semibold">{exam.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {exam.studentsActive} students active • {exam.violations} violations detected
                        </p>
                      </div>
                      <Button onClick={() => setActiveTab("proctoring")}>Monitor Now</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Upcoming Exams */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Upcoming Exams</CardTitle>
                  <CardDescription>Scheduled examinations</CardDescription>
                </div>
                <Link href="/teacher/exam/create">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Exam
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingExams.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No upcoming exams</h3>
                    <p className="text-muted-foreground mb-4">Create your first exam to get started.</p>
                    <Link href="/teacher/exam/create">
                      <Button>Create Exam</Button>
                    </Link>
                  </div>
                ) : (
                  upcomingExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{exam.title}</h4>
                          <Badge variant="outline">{exam.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{exam.subject}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {exam.date} at {exam.time}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{exam.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{exam.studentsEnrolled} students</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recent Completed Exams */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Recent Completed Exams</CardTitle>
                <CardDescription>View results and analytics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {completedExams.map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{exam.title}</h4>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{exam.subject}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span>
                          <span className="text-muted-foreground">Students:</span> {exam.studentsCompleted}
                        </span>
                        <span>
                          <span className="text-muted-foreground">Avg Score:</span> {exam.averageScore}
                        </span>
                        <span>
                          <span className="text-muted-foreground">Avg Integrity:</span> {exam.averageIntegrity}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setActiveTab("reports")}>
                        View Report
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proctoring">
            <LiveProctoringPanel />
          </TabsContent>

          <TabsContent value="reports">
            <ExamReports />
          </TabsContent>

          <TabsContent value="settings">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Dashboard Settings</CardTitle>
                <CardDescription>Configure your dashboard preferences and exam defaults</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Notification Preferences</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Email notifications for exam violations</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Real-time alerts during active exams</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Weekly summary reports</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Default Exam Settings</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Enable proctoring by default</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Require face verification</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Auto-submit at 60% integrity score</span>
                      </label>
                    </div>
                  </div>

                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

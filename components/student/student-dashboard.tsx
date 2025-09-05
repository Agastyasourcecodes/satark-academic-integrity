"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, BookOpen, Trophy, AlertCircle, CheckCircle, Play, Shield, LogOut } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const upcomingExams = [
  {
    id: "1",
    title: "Mathematics Final Exam",
    subject: "Advanced Calculus",
    teacher: "Dr. Sarah Johnson",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: "2 hours",
    status: "upcoming",
    integrityRequired: true,
  },
  {
    id: "2",
    title: "Physics Midterm",
    subject: "Quantum Mechanics",
    teacher: "Prof. Michael Chen",
    date: "2024-01-18",
    time: "2:00 PM",
    duration: "1.5 hours",
    status: "upcoming",
    integrityRequired: true,
  },
  {
    id: "3",
    title: "Computer Science Quiz",
    subject: "Data Structures",
    teacher: "Dr. Emily Rodriguez",
    date: "2024-01-20",
    time: "9:00 AM",
    duration: "45 minutes",
    status: "upcoming",
    integrityRequired: false,
  },
]

const completedExams = [
  {
    id: "4",
    title: "Chemistry Lab Test",
    subject: "Organic Chemistry",
    teacher: "Dr. James Wilson",
    date: "2024-01-10",
    score: "92%",
    integrityScore: "98%",
    status: "completed",
  },
  {
    id: "5",
    title: "History Essay Exam",
    subject: "World War II",
    teacher: "Prof. Lisa Anderson",
    date: "2024-01-08",
    score: "88%",
    integrityScore: "95%",
    status: "completed",
  },
]

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("upcoming")

  const getTimeUntilExam = (date: string, time: string) => {
    const examDateTime = new Date(`${date} ${time}`)
    const now = new Date()
    const diff = examDateTime.getTime() - now.getTime()

    if (diff < 0) return "Past due"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

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
                <p className="text-sm text-muted-foreground">Student Dashboard</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">John Doe</span>
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
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-border">
              <CardHeader className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback className="text-lg">JD</AvatarFallback>
                </Avatar>
                <CardTitle>John Doe</CardTitle>
                <CardDescription>Computer Science Student</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Student ID:</span>
                    <span className="font-medium">CS2024001</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Institution:</span>
                    <span className="font-medium">MIT</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Year:</span>
                    <span className="font-medium">3rd Year</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium mb-2">Integrity Score</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "96%" }}></div>
                    </div>
                    <span className="text-sm font-medium text-primary">96%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Excellent academic integrity record</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, John!</h2>
              <p className="text-muted-foreground">Here's what's coming up in your academic schedule.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
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
                    <Trophy className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Completed Exams</p>
                      <p className="text-2xl font-bold">{completedExams.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Average Score</p>
                      <p className="text-2xl font-bold">90%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Exams Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming Exams</TabsTrigger>
                <TabsTrigger value="completed">Completed Exams</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {upcomingExams.length === 0 ? (
                  <Card className="border-border">
                    <CardContent className="p-8 text-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No upcoming exams</h3>
                      <p className="text-muted-foreground">You're all caught up! Check back later for new exams.</p>
                    </CardContent>
                  </Card>
                ) : (
                  upcomingExams.map((exam) => (
                    <Card key={exam.id} className="border-border">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold">{exam.title}</h3>
                              {exam.integrityRequired && (
                                <Badge variant="secondary" className="bg-primary/10 text-primary">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Proctored
                                </Badge>
                              )}
                            </div>

                            <p className="text-muted-foreground mb-3">{exam.subject}</p>

                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{exam.teacher}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {exam.date} at {exam.time}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{exam.duration}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <AlertCircle className="h-4 w-4 text-accent" />
                                <span className="text-accent font-medium">
                                  Starts in {getTimeUntilExam(exam.date, exam.time)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="ml-4">
                            <Link href={`/student/exam/${exam.id}`}>
                              <Button className="flex items-center space-x-2">
                                <Play className="h-4 w-4" />
                                <span>Start Exam</span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {completedExams.length === 0 ? (
                  <Card className="border-border">
                    <CardContent className="p-8 text-center">
                      <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No completed exams</h3>
                      <p className="text-muted-foreground">Your completed exams will appear here.</p>
                    </CardContent>
                  </Card>
                ) : (
                  completedExams.map((exam) => (
                    <Card key={exam.id} className="border-border">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold">{exam.title}</h3>
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            </div>

                            <p className="text-muted-foreground mb-3">{exam.subject}</p>

                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{exam.teacher}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{exam.date}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Trophy className="h-4 w-4 text-primary" />
                                <span className="font-medium">Score: {exam.score}</span>
                              </div>
                            </div>
                          </div>

                          <div className="ml-4 text-right">
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="text-muted-foreground">Integrity: </span>
                                <span className="font-medium text-primary">{exam.integrityScore}</span>
                              </div>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

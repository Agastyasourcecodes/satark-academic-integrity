"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, AlertTriangle, Users, Clock, Shield, RefreshCw } from "lucide-react"

// Mock data for active exam monitoring
const activeExam = {
  id: "3",
  title: "Computer Science Quiz",
  subject: "Data Structures",
  timeRemaining: 1800, // 30 minutes in seconds
  totalStudents: 28,
  activeStudents: 24,
}

const studentFeeds = [
  {
    id: "s1",
    name: "Alice Johnson",
    integrityScore: 98,
    violations: [],
    faceDetected: true,
    status: "normal",
  },
  {
    id: "s2",
    name: "Bob Smith",
    integrityScore: 85,
    violations: ["Tab switching"],
    faceDetected: true,
    status: "warning",
  },
  {
    id: "s3",
    name: "Carol Davis",
    integrityScore: 92,
    violations: [],
    faceDetected: false,
    status: "alert",
  },
  {
    id: "s4",
    name: "David Wilson",
    integrityScore: 76,
    violations: ["Multiple faces", "Right-click attempt"],
    faceDetected: true,
    status: "critical",
  },
  {
    id: "s5",
    name: "Emma Brown",
    integrityScore: 95,
    violations: [],
    faceDetected: true,
    status: "normal",
  },
  {
    id: "s6",
    name: "Frank Miller",
    integrityScore: 88,
    violations: ["Copy attempt"],
    faceDetected: true,
    status: "warning",
  },
]

export function LiveProctoringPanel() {
  const [timeRemaining, setTimeRemaining] = useState(activeExam.timeRemaining)
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "border-primary/20 bg-primary/5"
      case "warning":
        return "border-yellow-500/50 bg-yellow-500/10"
      case "alert":
        return "border-orange-500/50 bg-orange-500/10"
      case "critical":
        return "border-destructive/50 bg-destructive/10"
      default:
        return "border-border"
    }
  }

  const getStatusBadge = (status: string, integrityScore: number) => {
    switch (status) {
      case "normal":
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Normal
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Warning
          </Badge>
        )
      case "alert":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
            Alert
          </Badge>
        )
      case "critical":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            Critical
          </Badge>
        )
      default:
        return null
    }
  }

  const criticalStudents = studentFeeds.filter((s) => s.status === "critical" || s.status === "alert")

  return (
    <div className="space-y-6">
      {/* Exam Overview */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-primary" />
                <span>Live Proctoring - {activeExam.title}</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{activeExam.subject}</p>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Time Remaining</p>
                <p className="font-mono font-medium">{formatTime(timeRemaining)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Active Students</p>
                <p className="font-medium">
                  {activeExam.activeStudents}/{activeExam.totalStudents}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Violations</p>
                <p className="font-medium">{studentFeeds.reduce((sum, s) => sum + s.violations.length, 0)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Integrity</p>
                <p className="font-medium">
                  {Math.round(studentFeeds.reduce((sum, s) => sum + s.integrityScore, 0) / studentFeeds.length)}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {criticalStudents.length > 0 && (
        <Alert className="border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Immediate Attention Required:</strong> {criticalStudents.length} student(s) have critical violations
            or integrity issues.
          </AlertDescription>
        </Alert>
      )}

      {/* Student Monitoring Grid */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Student Monitoring Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {studentFeeds.map((student) => (
              <Card
                key={student.id}
                className={`cursor-pointer transition-all hover:shadow-md ${getStatusColor(student.status)} ${
                  selectedStudent === student.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedStudent(selectedStudent === student.id ? null : student.id)}
              >
                <CardContent className="p-4">
                  {/* Webcam Feed Placeholder */}
                  <div className="aspect-video bg-muted rounded-lg mb-3 relative overflow-hidden">
                    <img
                      src={`/student-webcam-feed-for-.jpg?height=120&width=160&query=student webcam feed for ${student.name}`}
                      alt={`${student.name} webcam feed`}
                      className="w-full h-full object-cover"
                    />
                    {!student.faceDetected && (
                      <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(student.status, student.integrityScore)}
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`/ceholder-svg-height-24.jpg?height=24&width=24`} />
                        <AvatarFallback className="text-xs">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium truncate">{student.name}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Integrity:</span>
                      <span
                        className={`font-medium ${
                          student.integrityScore >= 80
                            ? "text-primary"
                            : student.integrityScore >= 60
                              ? "text-yellow-600"
                              : "text-destructive"
                        }`}
                      >
                        {student.integrityScore}%
                      </span>
                    </div>

                    {student.violations.length > 0 && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">Violations:</span>
                        <div className="mt-1 space-y-1">
                          {student.violations.slice(0, 2).map((violation, index) => (
                            <div key={index} className="text-destructive">
                              • {violation}
                            </div>
                          ))}
                          {student.violations.length > 2 && (
                            <div className="text-muted-foreground">+{student.violations.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Student Details */}
      {selectedStudent && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Student Details - {studentFeeds.find((s) => s.id === selectedStudent)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Live Feed</h4>
                <div className="aspect-video bg-muted rounded-lg">
                  <img
                    src={`/placeholder.svg?height=240&width=320&query=detailed webcam feed`}
                    alt="Detailed webcam feed"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Integrity Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Current Score:</span>
                      <span className="font-medium">
                        {studentFeeds.find((s) => s.id === selectedStudent)?.integrityScore}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Face Detection:</span>
                      <span
                        className={
                          studentFeeds.find((s) => s.id === selectedStudent)?.faceDetected
                            ? "text-primary"
                            : "text-destructive"
                        }
                      >
                        {studentFeeds.find((s) => s.id === selectedStudent)?.faceDetected ? "Active" : "Missing"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Violation History</h4>
                  <div className="space-y-1 text-sm">
                    {studentFeeds
                      .find((s) => s.id === selectedStudent)
                      ?.violations.map((violation, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <AlertTriangle className="h-3 w-3 text-destructive" />
                          <span>{violation}</span>
                        </div>
                      ))}
                    {studentFeeds.find((s) => s.id === selectedStudent)?.violations.length === 0 && (
                      <p className="text-muted-foreground">No violations recorded</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Send Warning
                  </Button>
                  <Button variant="destructive" size="sm">
                    End Exam
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, AlertTriangle, Eye, EyeOff, Volume2, Maximize2, Flag, Download } from "lucide-react"

interface StudentProctoringData {
  id: string
  name: string
  faceDetected: boolean
  faceCount: number
  gazeDirection: string
  attentionScore: number
  integrityScore: number
  violations: string[]
  connectionStatus: string
  lastActivity: Date
}

// Mock student data for demonstration
const mockStudents: StudentProctoringData[] = [
  {
    id: "1",
    name: "Alice Johnson",
    faceDetected: true,
    faceCount: 1,
    gazeDirection: "center",
    attentionScore: 95,
    integrityScore: 98,
    violations: [],
    connectionStatus: "connected",
    lastActivity: new Date(),
  },
  {
    id: "2",
    name: "Bob Smith",
    faceDetected: false,
    faceCount: 0,
    gazeDirection: "away",
    attentionScore: 45,
    integrityScore: 78,
    violations: ["No face detected", "Looking away from screen"],
    connectionStatus: "connected",
    lastActivity: new Date(),
  },
  {
    id: "3",
    name: "Carol Davis",
    faceDetected: true,
    faceCount: 2,
    gazeDirection: "left",
    attentionScore: 60,
    integrityScore: 85,
    violations: ["Multiple faces detected"],
    connectionStatus: "connected",
    lastActivity: new Date(),
  },
]

export function EnhancedLiveProctoring() {
  const [students, setStudents] = useState<StudentProctoringData[]>(mockStudents)
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [alertsFilter, setAlertsFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [isRecording, setIsRecording] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStudents((prev) =>
        prev.map((student) => ({
          ...student,
          attentionScore: Math.max(0, Math.min(100, student.attentionScore + (Math.random() - 0.5) * 10)),
          gazeDirection:
            Math.random() > 0.8
              ? ["center", "left", "right", "up", "down", "away"][Math.floor(Math.random() * 6)]
              : student.gazeDirection,
          faceDetected: Math.random() > 0.05,
          faceCount: Math.random() > 0.95 ? 2 : Math.random() > 0.05 ? 1 : 0,
          lastActivity: new Date(),
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getViolationSeverity = (violations: string[]) => {
    if (violations.some((v) => v.includes("Multiple faces") || v.includes("No face"))) return "high"
    if (violations.some((v) => v.includes("Looking away") || v.includes("Tab switch"))) return "medium"
    return "low"
  }

  const getStatusColor = (student: StudentProctoringData) => {
    if (student.integrityScore < 60) return "border-destructive bg-destructive/5"
    if (student.integrityScore < 80) return "border-yellow-500 bg-yellow-50"
    return "border-primary bg-primary/5"
  }

  const flagStudent = (studentId: string) => {
    console.log("[v0] Student flagged for manual review:", studentId)
    // In real implementation, this would send an alert to administrators
  }

  const exportReport = () => {
    const reportData = students.map((student) => ({
      name: student.name,
      integrityScore: student.integrityScore,
      attentionScore: student.attentionScore,
      violations: student.violations.length,
      status: student.connectionStatus,
    }))

    console.log("[v0] Exporting proctoring report:", reportData)
    // In real implementation, this would generate and download a CSV/PDF report
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Live Proctoring Dashboard</span>
              <Badge variant="outline">{students.length} Students</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={isRecording ? "destructive" : "default"}
                size="sm"
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
              <Button variant="outline" size="sm" onClick={exportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Filter Alerts:</span>
              {(["all", "high", "medium", "low"] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={alertsFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAlertsFilter(filter)}
                  className="capitalize"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <Card
            key={student.id}
            className={`cursor-pointer transition-all hover:shadow-md ${getStatusColor(student)} ${
              selectedStudent === student.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedStudent(student.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{student.name}</CardTitle>
                <div className="flex items-center space-x-1">
                  {student.connectionStatus === "connected" ? (
                    <Eye className="h-4 w-4 text-primary" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-destructive" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      flagStudent(student.id)
                    }}
                  >
                    <Flag className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Video Feed Placeholder */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative">
                <div className="text-xs text-muted-foreground">Live Feed</div>
                {!student.faceDetected && (
                  <div className="absolute top-2 right-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                )}
                {student.faceCount > 1 && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="destructive" className="text-xs">
                      {student.faceCount} faces
                    </Badge>
                  </div>
                )}
              </div>

              {/* Status Indicators */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
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
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Attention:</span>
                  <span
                    className={`font-medium ${
                      student.attentionScore >= 80
                        ? "text-primary"
                        : student.attentionScore >= 60
                          ? "text-yellow-600"
                          : "text-destructive"
                    }`}
                  >
                    {student.attentionScore}%
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Gaze:</span>
                  <Badge variant="outline" className="text-xs">
                    {student.gazeDirection}
                  </Badge>
                </div>
              </div>

              {/* Violations */}
              {student.violations.length > 0 && (
                <Alert className="py-2">
                  <AlertTriangle className="h-3 w-3" />
                  <AlertDescription className="text-xs">
                    {student.violations.length} violation(s) detected
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View for Selected Student */}
      {selectedStudent && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Detailed View: {students.find((s) => s.id === selectedStudent)?.name}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedStudent(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const student = students.find((s) => s.id === selectedStudent)
              if (!student) return null

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Enhanced Video Feed */}
                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-sm text-muted-foreground">Enhanced Live Feed</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Volume2 className="h-4 w-4 mr-2" />
                        Audio
                      </Button>
                      <Button variant="outline" size="sm">
                        <Maximize2 className="h-4 w-4 mr-2" />
                        Fullscreen
                      </Button>
                    </div>
                  </div>

                  {/* Detailed Analytics */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{student.integrityScore}%</div>
                        <div className="text-xs text-muted-foreground">Integrity Score</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{student.attentionScore}%</div>
                        <div className="text-xs text-muted-foreground">Attention Score</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Recent Violations</h4>
                      {student.violations.length > 0 ? (
                        <div className="space-y-1">
                          {student.violations.slice(-5).map((violation, index) => (
                            <div
                              key={index}
                              className="text-xs p-2 bg-destructive/10 rounded border-l-2 border-destructive"
                            >
                              {violation}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">No violations detected</div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

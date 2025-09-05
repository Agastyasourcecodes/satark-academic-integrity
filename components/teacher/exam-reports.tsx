"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Download, Search, Users, Shield, AlertTriangle } from "lucide-react"

// Mock data for reports
const examReports = [
  {
    id: "4",
    title: "Chemistry Lab Test",
    subject: "Organic Chemistry",
    date: "2024-01-10",
    studentsCompleted: 38,
    averageScore: 84,
    averageIntegrity: 92,
    totalViolations: 12,
    aiDetections: 3,
    status: "completed",
  },
  {
    id: "5",
    title: "History Essay Exam",
    subject: "World War II",
    date: "2024-01-08",
    studentsCompleted: 42,
    averageScore: 78,
    averageIntegrity: 89,
    totalViolations: 18,
    aiDetections: 7,
    status: "completed",
  },
  {
    id: "6",
    title: "Mathematics Quiz",
    subject: "Calculus I",
    date: "2024-01-05",
    studentsCompleted: 35,
    averageScore: 91,
    averageIntegrity: 96,
    totalViolations: 5,
    aiDetections: 1,
    status: "completed",
  },
]

const studentReports = [
  {
    id: "s1",
    name: "Alice Johnson",
    examTitle: "Chemistry Lab Test",
    score: 92,
    integrityScore: 98,
    violations: [],
    aiLikelihood: 5,
    plagiarismScore: 2,
  },
  {
    id: "s2",
    name: "Bob Smith",
    examTitle: "Chemistry Lab Test",
    score: 78,
    integrityScore: 85,
    violations: ["Tab switching", "Right-click attempt"],
    aiLikelihood: 15,
    plagiarismScore: 8,
  },
  {
    id: "s3",
    name: "Carol Davis",
    examTitle: "Chemistry Lab Test",
    score: 88,
    integrityScore: 92,
    violations: ["Face missing (2 min)"],
    aiLikelihood: 8,
    plagiarismScore: 3,
  },
]

export function ExamReports() {
  const [selectedExam, setSelectedExam] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const exportReport = (format: "csv" | "pdf") => {
    console.log(`[v0] Exporting report in ${format} format`)
    // Simulate export
    alert(`Report exported as ${format.toUpperCase()}`)
  }

  return (
    <div className="space-y-6">
      {/* Reports Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Exams</p>
                <p className="text-2xl font-bold">{examReports.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Students Assessed</p>
                <p className="text-2xl font-bold">
                  {examReports.reduce((sum, exam) => sum + exam.studentsCompleted, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Integrity</p>
                <p className="text-2xl font-bold">
                  {Math.round(examReports.reduce((sum, exam) => sum + exam.averageIntegrity, 0) / examReports.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Total Violations</p>
                <p className="text-2xl font-bold">{examReports.reduce((sum, exam) => sum + exam.totalViolations, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Exam Reports</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => exportReport("csv")}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportReport("pdf")}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exams</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {examReports.map((exam) => (
              <Card
                key={exam.id}
                className={`border-border cursor-pointer transition-all hover:shadow-md ${
                  selectedExam === exam.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedExam(selectedExam === exam.id ? null : exam.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{exam.title}</h4>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {exam.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {exam.subject} • {exam.date}
                      </p>

                      <div className="grid md:grid-cols-6 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Students:</span>
                          <div className="font-medium">{exam.studentsCompleted}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Avg Score:</span>
                          <div className="font-medium">{exam.averageScore}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Integrity:</span>
                          <div className="font-medium text-primary">{exam.averageIntegrity}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Violations:</span>
                          <div className="font-medium text-accent">{exam.totalViolations}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">AI Detections:</span>
                          <div className="font-medium text-destructive">{exam.aiDetections}</div>
                        </div>
                        <div className="flex items-center">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Student Reports */}
      {selectedExam && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Student Reports - {examReports.find((e) => e.id === selectedExam)?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentReports.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{student.name}</h4>
                    <div className="grid md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Score:</span>
                        <div className="font-medium">{student.score}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Integrity:</span>
                        <div className="font-medium text-primary">{student.integrityScore}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">AI Likelihood:</span>
                        <div className="font-medium text-destructive">{student.aiLikelihood}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Plagiarism:</span>
                        <div className="font-medium text-accent">{student.plagiarismScore}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Violations:</span>
                        <div className="font-medium">{student.violations.length}</div>
                      </div>
                    </div>
                    {student.violations.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Violations: {student.violations.join(", ")}
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    Detailed Report
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

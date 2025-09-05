"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Shield,
  Save,
  Eye,
  CalendarIcon,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileText,
  Code,
  CheckSquare,
  AlertTriangle,
} from "lucide-react"
import { format } from "date-fns"
import { QuestionEditor } from "./question-editor"
import { ExamPreview } from "./exam-preview"

interface Question {
  id: string
  type: "mcq" | "essay" | "coding" | "short-answer"
  question: string
  options?: string[]
  correctAnswer?: string
  maxWords?: number
  language?: string
  points: number
  image?: string
}

interface ExamSettings {
  title: string
  subject: string
  description: string
  duration: number // minutes
  date: Date | undefined
  time: string
  totalPoints: number
  passingScore: number
  // Proctoring settings
  enableProctoring: boolean
  requireFaceVerification: boolean
  enableFullscreenLock: boolean
  integrityThreshold: number
  enableAIDetection: boolean
  allowTabSwitching: boolean
  enableCopyPaste: boolean
  // Advanced settings
  shuffleQuestions: boolean
  showResults: boolean
  allowReview: boolean
  timeWarnings: number[]
}

export function ExamCreationForm() {
  const [activeTab, setActiveTab] = useState("details")
  const [examSettings, setExamSettings] = useState<ExamSettings>({
    title: "",
    subject: "",
    description: "",
    duration: 60,
    date: undefined,
    time: "09:00",
    totalPoints: 0,
    passingScore: 60,
    enableProctoring: true,
    requireFaceVerification: true,
    enableFullscreenLock: true,
    integrityThreshold: 60,
    enableAIDetection: true,
    allowTabSwitching: false,
    enableCopyPaste: false,
    shuffleQuestions: false,
    showResults: true,
    allowReview: true,
    timeWarnings: [15, 5],
  })

  const [questions, setQuestions] = useState<Question[]>([])
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const addQuestion = (type: Question["type"]) => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      type,
      question: "",
      points: 1,
      ...(type === "mcq" && { options: ["", "", "", ""], correctAnswer: "" }),
      ...(type === "essay" && { maxWords: 500 }),
      ...(type === "coding" && { language: "javascript" }),
    }
    setQuestions([...questions, newQuestion])
    setEditingQuestion(newQuestion)
  }

  const updateQuestion = (updatedQuestion: Question) => {
    setQuestions(questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)))
    setExamSettings((prev) => ({
      ...prev,
      totalPoints: questions.reduce(
        (sum, q) => sum + (q.id === updatedQuestion.id ? updatedQuestion.points : q.points),
        0,
      ),
    }))
  }

  const deleteQuestion = (questionId: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== questionId)
    setQuestions(updatedQuestions)
    setExamSettings((prev) => ({
      ...prev,
      totalPoints: updatedQuestions.reduce((sum, q) => sum + q.points, 0),
    }))
    if (editingQuestion?.id === questionId) {
      setEditingQuestion(null)
    }
  }

  const moveQuestion = (questionId: string, direction: "up" | "down") => {
    const currentIndex = questions.findIndex((q) => q.id === questionId)
    if ((direction === "up" && currentIndex === 0) || (direction === "down" && currentIndex === questions.length - 1)) {
      return
    }

    const newQuestions = [...questions]
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    ;[newQuestions[currentIndex], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[currentIndex]]
    setQuestions(newQuestions)
  }

  const saveExam = (status: "draft" | "published") => {
    const examData = {
      ...examSettings,
      questions,
      status,
      createdAt: new Date(),
    }
    console.log("[v0] Saving exam:", examData)
    alert(`Exam ${status === "draft" ? "saved as draft" : "published"} successfully!`)
  }

  const getQuestionIcon = (type: Question["type"]) => {
    switch (type) {
      case "mcq":
        return <CheckSquare className="h-4 w-4" />
      case "essay":
        return <FileText className="h-4 w-4" />
      case "coding":
        return <Code className="h-4 w-4" />
      case "short-answer":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (showPreview) {
    return (
      <ExamPreview
        examSettings={examSettings}
        questions={questions}
        onClose={() => setShowPreview(false)}
        onEdit={() => setShowPreview(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Create New Exam</h1>
                <p className="text-sm text-muted-foreground">Build secure examinations with integrity monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setShowPreview(true)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" onClick={() => saveExam("draft")}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={() => saveExam("published")}>Publish Exam</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Exam Details</TabsTrigger>
                <TabsTrigger value="questions">Questions ({questions.length})</TabsTrigger>
                <TabsTrigger value="settings">Security Settings</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Exam Title *</Label>
                        <Input
                          id="title"
                          placeholder="Enter exam title"
                          value={examSettings.title}
                          onChange={(e) => setExamSettings((prev) => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          placeholder="Enter subject"
                          value={examSettings.subject}
                          onChange={(e) => setExamSettings((prev) => ({ ...prev, subject: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter exam description and instructions"
                        value={examSettings.description}
                        onChange={(e) => setExamSettings((prev) => ({ ...prev, description: e.target.value }))}
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Schedule & Duration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Exam Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal bg-transparent"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {examSettings.date ? format(examSettings.date, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={examSettings.date}
                              onSelect={(date) => setExamSettings((prev) => ({ ...prev, date }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time">Start Time *</Label>
                        <Input
                          id="time"
                          type="time"
                          value={examSettings.time}
                          onChange={(e) => setExamSettings((prev) => ({ ...prev, time: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes) *</Label>
                        <Input
                          id="duration"
                          type="number"
                          min="1"
                          value={examSettings.duration}
                          onChange={(e) =>
                            setExamSettings((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) || 60 }))
                          }
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="totalPoints">Total Points</Label>
                        <Input
                          id="totalPoints"
                          type="number"
                          value={examSettings.totalPoints}
                          readOnly
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">Calculated automatically from questions</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="passingScore">Passing Score (%)</Label>
                        <Input
                          id="passingScore"
                          type="number"
                          min="0"
                          max="100"
                          value={examSettings.passingScore}
                          onChange={(e) =>
                            setExamSettings((prev) => ({
                              ...prev,
                              passingScore: Number.parseInt(e.target.value) || 60,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="questions" className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Question Bank</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Select onValueChange={(value) => addQuestion(value as Question["type"])}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Add Question Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mcq">Multiple Choice</SelectItem>
                            <SelectItem value="essay">Essay Question</SelectItem>
                            <SelectItem value="short-answer">Short Answer</SelectItem>
                            <SelectItem value="coding">Coding Question</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {questions.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No questions added yet</h3>
                        <p className="text-muted-foreground mb-4">Start building your exam by adding questions.</p>
                        <Select onValueChange={(value) => addQuestion(value as Question["type"])}>
                          <SelectTrigger className="w-48 mx-auto">
                            <SelectValue placeholder="Add First Question" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mcq">Multiple Choice</SelectItem>
                            <SelectItem value="essay">Essay Question</SelectItem>
                            <SelectItem value="short-answer">Short Answer</SelectItem>
                            <SelectItem value="coding">Coding Question</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {questions.map((question, index) => (
                          <Card
                            key={question.id}
                            className={`border-border cursor-pointer transition-all hover:shadow-md ${
                              editingQuestion?.id === question.id ? "ring-2 ring-primary" : ""
                            }`}
                            onClick={() => setEditingQuestion(question)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Badge variant="outline" className="capitalize">
                                      {getQuestionIcon(question.type)}
                                      <span className="ml-1">{question.type.replace("-", " ")}</span>
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">Question {index + 1}</span>
                                    <span className="text-sm text-muted-foreground">• {question.points} pts</span>
                                  </div>
                                  <p className="text-sm">{question.question || "Click to add question text..."}</p>
                                  {question.type === "mcq" && question.options && (
                                    <div className="mt-2 text-xs text-muted-foreground">
                                      {question.options.filter((opt) => opt.trim()).length} options
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      moveQuestion(question.id, "up")
                                    }}
                                    disabled={index === 0}
                                  >
                                    <ArrowUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      moveQuestion(question.id, "down")
                                    }}
                                    disabled={index === questions.length - 1}
                                  >
                                    <ArrowDown className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteQuestion(question.id)
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span>Proctoring & Security</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enableProctoring">Enable Proctoring</Label>
                        <p className="text-sm text-muted-foreground">Monitor students during the exam</p>
                      </div>
                      <Switch
                        id="enableProctoring"
                        checked={examSettings.enableProctoring}
                        onCheckedChange={(checked) =>
                          setExamSettings((prev) => ({ ...prev, enableProctoring: checked }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="requireFaceVerification">Face Verification</Label>
                          <p className="text-sm text-muted-foreground">Require face detection before starting</p>
                        </div>
                        <Switch
                          id="requireFaceVerification"
                          checked={examSettings.requireFaceVerification}
                          onCheckedChange={(checked) =>
                            setExamSettings((prev) => ({ ...prev, requireFaceVerification: checked }))
                          }
                          disabled={!examSettings.enableProctoring}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="enableFullscreenLock">Fullscreen Lock</Label>
                          <p className="text-sm text-muted-foreground">Force fullscreen mode during exam</p>
                        </div>
                        <Switch
                          id="enableFullscreenLock"
                          checked={examSettings.enableFullscreenLock}
                          onCheckedChange={(checked) =>
                            setExamSettings((prev) => ({ ...prev, enableFullscreenLock: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="enableAIDetection">AI Content Detection</Label>
                          <p className="text-sm text-muted-foreground">Detect AI-generated responses</p>
                        </div>
                        <Switch
                          id="enableAIDetection"
                          checked={examSettings.enableAIDetection}
                          onCheckedChange={(checked) =>
                            setExamSettings((prev) => ({ ...prev, enableAIDetection: checked }))
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="integrityThreshold">Integrity Threshold (%)</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Auto-submit exam when integrity drops below this level
                        </p>
                        <Input
                          id="integrityThreshold"
                          type="number"
                          min="0"
                          max="100"
                          value={examSettings.integrityThreshold}
                          onChange={(e) =>
                            setExamSettings((prev) => ({
                              ...prev,
                              integrityThreshold: Number.parseInt(e.target.value) || 60,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-5 w-5 text-accent mt-0.5" />
                        <div>
                          <h4 className="font-medium">Security Notice</h4>
                          <p className="text-sm text-muted-foreground">
                            These settings ensure academic integrity. Students will be informed about monitoring before
                            starting the exam.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="shuffleQuestions">Shuffle Questions</Label>
                        <p className="text-sm text-muted-foreground">Randomize question order for each student</p>
                      </div>
                      <Switch
                        id="shuffleQuestions"
                        checked={examSettings.shuffleQuestions}
                        onCheckedChange={(checked) =>
                          setExamSettings((prev) => ({ ...prev, shuffleQuestions: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="showResults">Show Results</Label>
                        <p className="text-sm text-muted-foreground">Display results to students after submission</p>
                      </div>
                      <Switch
                        id="showResults"
                        checked={examSettings.showResults}
                        onCheckedChange={(checked) => setExamSettings((prev) => ({ ...prev, showResults: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="allowReview">Allow Review</Label>
                        <p className="text-sm text-muted-foreground">Let students review answers before submission</p>
                      </div>
                      <Switch
                        id="allowReview"
                        checked={examSettings.allowReview}
                        onCheckedChange={(checked) => setExamSettings((prev) => ({ ...prev, allowReview: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Exam Summary */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Exam Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Questions:</span>
                    <span className="font-medium">{questions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Points:</span>
                    <span className="font-medium">{examSettings.totalPoints}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{examSettings.duration} min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Proctoring:</span>
                    <Badge variant={examSettings.enableProctoring ? "default" : "outline"} className="text-xs">
                      {examSettings.enableProctoring ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setShowPreview(true)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Exam
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => saveExam("draft")}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button className="w-full justify-start" onClick={() => saveExam("published")}>
                    Publish Exam
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Question Editor Modal */}
      {editingQuestion && (
        <QuestionEditor question={editingQuestion} onSave={updateQuestion} onClose={() => setEditingQuestion(null)} />
      )}
    </div>
  )
}

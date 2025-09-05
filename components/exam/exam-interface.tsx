"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Shield, AlertTriangle, CheckCircle, Eye, EyeOff, Send } from "lucide-react"
import { PreExamVerification } from "./pre-exam-verification"
import { ExamTimer } from "./exam-timer"
import { IntegrityMonitor } from "./integrity-monitor"
import { AdvancedProctoring } from "./advanced-proctoring"
import { AIDetectionMonitor } from "./ai-detection-monitor"

// Mock exam data
const mockExam = {
  id: "1",
  title: "Mathematics Final Exam",
  subject: "Advanced Calculus",
  teacher: "Dr. Sarah Johnson",
  duration: 120, // minutes
  questions: [
    {
      id: "q1",
      type: "mcq",
      question: "What is the derivative of x²?",
      options: ["2x", "x²", "2", "x"],
      correctAnswer: "2x",
    },
    {
      id: "q2",
      type: "essay",
      question: "Explain the fundamental theorem of calculus and provide an example of its application.",
      maxWords: 500,
    },
    {
      id: "q3",
      type: "mcq",
      question: "Which of the following is the integral of 1/x?",
      options: ["ln|x| + C", "x + C", "1/x² + C", "x² + C"],
      correctAnswer: "ln|x| + C",
    },
    {
      id: "q4",
      type: "coding",
      question: "Write a function to calculate the factorial of a number using recursion.",
      language: "javascript",
    },
  ],
}

interface ExamInterfaceProps {
  examId: string
}

export function ExamInterface({ examId }: ExamInterfaceProps) {
  const [examStarted, setExamStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [integrityScore, setIntegrityScore] = useState(100)
  const [violations, setViolations] = useState<string[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [webcamActive, setWebcamActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(mockExam.duration * 60) // seconds
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "error">("saved")
  const [examSubmitted, setExamSubmitted] = useState(false)
  const [proctoringActive, setProctoringActive] = useState(false)
  const [proctoringData, setProctoringData] = useState<any>(null)
  const [aiAnalysisResults, setAiAnalysisResults] = useState<Record<string, any>>({})

  const videoRef = useRef<HTMLVideoElement>(null)
  const examContainerRef = useRef<HTMLDivElement>(null)

  // Auto-save functionality
  useEffect(() => {
    if (!examStarted) return

    const autoSaveInterval = setInterval(() => {
      setAutoSaveStatus("saving")
      // Simulate auto-save
      setTimeout(() => {
        setAutoSaveStatus("saved")
        console.log("[v0] Auto-saved answers:", answers)
      }, 1000)
    }, 10000) // Every 10 seconds

    return () => clearInterval(autoSaveInterval)
  }, [examStarted, answers])

  // Fullscreen management
  const enterFullscreen = useCallback(async () => {
    if (examContainerRef.current) {
      try {
        await examContainerRef.current.requestFullscreen()
        setIsFullscreen(true)
      } catch (error) {
        console.error("[v0] Fullscreen error:", error)
      }
    }
  }, [])

  const exitFullscreen = useCallback(async () => {
    try {
      await document.exitFullscreen()
      setIsFullscreen(false)
    } catch (error) {
      console.error("[v0] Exit fullscreen error:", error)
    }
  }, [])

  // Integrity monitoring
  useEffect(() => {
    if (!examStarted) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIntegrityScore((prev) => Math.max(prev - 5, 0))
        setViolations((prev) => [...prev, "Tab switching detected"])
      }
    }

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && examStarted) {
        setIntegrityScore((prev) => Math.max(prev - 10, 0))
        setViolations((prev) => [...prev, "Exited fullscreen mode"])
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common shortcuts
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "a")) ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I")
      ) {
        e.preventDefault()
        setIntegrityScore((prev) => Math.max(prev - 2, 0))
        setViolations((prev) => [...prev, "Attempted restricted action"])
      }
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      setIntegrityScore((prev) => Math.max(prev - 1, 0))
      setViolations((prev) => [...prev, "Right-click attempted"])
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("contextmenu", handleContextMenu)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [examStarted])

  // Timer countdown
  useEffect(() => {
    if (!examStarted || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [examStarted, timeRemaining])

  const handleStartExam = async () => {
    await enterFullscreen()
    setExamStarted(true)
    setProctoringActive(true)
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmitExam = async () => {
    setProctoringActive(false)
    setExamSubmitted(true)
    await exitFullscreen()

    // Simulate submission
    console.log("[v0] Exam submitted:", {
      answers,
      integrityScore,
      violations,
      timeUsed: mockExam.duration * 60 - timeRemaining,
    })
  }

  const handleAdvancedViolation = useCallback((violation: string, severity: "low" | "medium" | "high") => {
    const scoreReduction = severity === "high" ? 10 : severity === "medium" ? 5 : 2
    setIntegrityScore((prev) => Math.max(prev - scoreReduction, 0))
    setViolations((prev) => [...prev, `${violation} (${severity} severity)`])

    console.log("[v0] Advanced violation detected:", { violation, severity, scoreReduction })
  }, [])

  const handleProctoringData = useCallback((data: any) => {
    setProctoringData(data)

    // Auto-submit if attention score is too low for too long
    if (data.attentionScore < 30) {
      console.log("[v0] Critical attention score detected:", data.attentionScore)
    }
  }, [])

  const handleAIAnalysis = useCallback((questionId: string, analysis: any) => {
    setAiAnalysisResults((prev) => ({ ...prev, [questionId]: analysis }))

    // Reduce integrity score based on AI likelihood
    if (analysis.aiLikelihood >= 80) {
      setIntegrityScore((prev) => Math.max(prev - 15, 0))
      setViolations((prev) => [...prev, `High AI likelihood detected (${analysis.aiLikelihood}%)`])
    } else if (analysis.aiLikelihood >= 60) {
      setIntegrityScore((prev) => Math.max(prev - 8, 0))
      setViolations((prev) => [...prev, `Moderate AI likelihood detected (${analysis.aiLikelihood}%)`])
    } else if (analysis.aiLikelihood >= 40) {
      setIntegrityScore((prev) => Math.max(prev - 3, 0))
      setViolations((prev) => [...prev, `Low AI likelihood detected (${analysis.aiLikelihood}%)`])
    }

    console.log("[v0] AI Analysis completed:", { questionId, analysis })
  }, [])

  const currentQ = mockExam.questions[currentQuestion]

  if (!examStarted) {
    return <PreExamVerification exam={mockExam} onStartExam={handleStartExam} onWebcamReady={setWebcamActive} />
  }

  if (examSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Exam Submitted Successfully</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">Your exam has been submitted and is being processed.</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Final Integrity Score:</span>
                <span className="font-medium text-primary">{integrityScore}%</span>
              </div>
              <div className="flex justify-between">
                <span>Questions Answered:</span>
                <span className="font-medium">
                  {Object.keys(answers).length}/{mockExam.questions.length}
                </span>
              </div>
            </div>
            <Button onClick={() => (window.location.href = "/student/dashboard")} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div ref={examContainerRef} className="min-h-screen bg-background">
      {/* Exam Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-semibold">{mockExam.title}</h1>
              <p className="text-sm text-muted-foreground">{mockExam.subject}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ExamTimer timeRemaining={timeRemaining} />
            <IntegrityMonitor score={integrityScore} />

            {/* Webcam indicator */}
            <div className="flex items-center space-x-2">
              {webcamActive ? (
                <Eye className="h-4 w-4 text-primary" />
              ) : (
                <EyeOff className="h-4 w-4 text-destructive" />
              )}
              <span className="text-sm">Camera</span>
            </div>

            {/* Auto-save status */}
            <div className="flex items-center space-x-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  autoSaveStatus === "saved"
                    ? "bg-primary"
                    : autoSaveStatus === "saving"
                      ? "bg-yellow-500"
                      : "bg-destructive"
                }`}
              />
              <span className="text-xs text-muted-foreground">
                {autoSaveStatus === "saved" ? "Saved" : autoSaveStatus === "saving" ? "Saving..." : "Error"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Question Navigation Sidebar */}
        <div className="w-64 border-r border-border bg-muted/30 p-4">
          <h3 className="font-medium mb-4">Questions</h3>
          <div className="space-y-2">
            {mockExam.questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(index)}
                className={`w-full text-left p-2 rounded text-sm transition-colors ${
                  index === currentQuestion
                    ? "bg-primary text-primary-foreground"
                    : answers[q.id]
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Question {index + 1}</span>
                  {answers[q.id] && <CheckCircle className="h-4 w-4" />}
                </div>
                <div className="text-xs opacity-75 capitalize">{q.type}</div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground mb-2">Progress</div>
            <Progress value={(Object.keys(answers).length / mockExam.questions.length) * 100} className="mb-2" />
            <div className="text-xs text-muted-foreground">
              {Object.keys(answers).length} of {mockExam.questions.length} answered
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <AdvancedProctoring
              onViolation={handleAdvancedViolation}
              onProctoringData={handleProctoringData}
              isActive={proctoringActive}
            />
          </div>
        </div>

        {/* Main Question Area */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Question {currentQuestion + 1} of {mockExam.questions.length}
                </h2>
                <Badge variant="outline" className="capitalize">
                  {currentQ.type}
                </Badge>
              </div>

              {/* Violations Alert */}
              {violations.length > 0 && (
                <Alert className="mb-4 border-destructive/50 bg-destructive/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Integrity Violations Detected:</strong>
                    <ul className="mt-1 text-sm">
                      {violations.slice(-3).map((violation, index) => (
                        <li key={index}>• {violation}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Card className="border-border">
              <CardContent className="p-6">
                <div className="mb-6">
                  <p className="text-lg leading-relaxed">{currentQ.question}</p>
                  {currentQ.type === "essay" && currentQ.maxWords && (
                    <p className="text-sm text-muted-foreground mt-2">Maximum words: {currentQ.maxWords}</p>
                  )}
                </div>

                {/* Question Type Rendering */}
                {currentQ.type === "mcq" && (
                  <RadioGroup
                    value={answers[currentQ.id] || ""}
                    onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
                  >
                    {currentQ.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQ.type === "essay" && (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type your answer here..."
                      value={answers[currentQ.id] || ""}
                      onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                      className="min-h-[200px] resize-none"
                    />
                    {/* AI detection monitor for essay questions */}
                    <AIDetectionMonitor
                      text={answers[currentQ.id] || ""}
                      onAnalysisComplete={(analysis) => handleAIAnalysis(currentQ.id, analysis)}
                      isActive={examStarted}
                      questionType="essay"
                    />
                  </div>
                )}

                {currentQ.type === "coding" && (
                  <div className="space-y-2">
                    <Label>Code Editor ({currentQ.language})</Label>
                    <Textarea
                      placeholder="// Write your code here..."
                      value={answers[currentQ.id] || ""}
                      onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                      className="min-h-[300px] font-mono text-sm resize-none"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>

              <div className="flex space-x-2">
                {currentQuestion === mockExam.questions.length - 1 ? (
                  <Button onClick={handleSubmitExam} className="bg-primary">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Exam
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestion((prev) => Math.min(mockExam.questions.length - 1, prev + 1))}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

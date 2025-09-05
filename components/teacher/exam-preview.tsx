"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Edit, Shield, Clock, Calendar, Users } from "lucide-react"
import { format } from "date-fns"

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
  duration: number
  date: Date | undefined
  time: string
  totalPoints: number
  passingScore: number
  enableProctoring: boolean
  requireFaceVerification: boolean
  enableFullscreenLock: boolean
  integrityThreshold: number
  enableAIDetection: boolean
}

interface ExamPreviewProps {
  examSettings: ExamSettings
  questions: Question[]
  onClose: () => void
  onEdit: () => void
}

export function ExamPreview({ examSettings, questions, onClose, onEdit }: ExamPreviewProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Exam Preview</h1>
                <p className="text-sm text-muted-foreground">Preview how students will see this exam</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Exam
              </Button>
              <Button variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Exam Header */}
        <Card className="border-border mb-6">
          <CardHeader>
            <div className="text-center space-y-4">
              <div>
                <CardTitle className="text-3xl mb-2">{examSettings.title || "Untitled Exam"}</CardTitle>
                <p className="text-lg text-muted-foreground">{examSettings.subject || "Subject"}</p>
              </div>

              {examSettings.description && (
                <p className="text-muted-foreground max-w-2xl mx-auto">{examSettings.description}</p>
              )}

              <div className="flex flex-wrap justify-center gap-4 text-sm">
                {examSettings.date && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(examSettings.date, "PPP")} at {examSettings.time}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{examSettings.duration} minutes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{examSettings.totalPoints} points</span>
                </div>
              </div>

              {examSettings.enableProctoring && (
                <div className="flex justify-center">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Shield className="h-3 w-3 mr-1" />
                    Proctored Exam
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Security Notice */}
        {examSettings.enableProctoring && (
          <Card className="border-primary/50 bg-primary/10 mb-6">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary">Security & Proctoring Notice</h4>
                  <ul className="text-sm text-primary/80 mt-1 space-y-1">
                    {examSettings.requireFaceVerification && <li>• Face verification required before starting</li>}
                    {examSettings.enableFullscreenLock && <li>• Exam will open in fullscreen mode</li>}
                    {examSettings.enableAIDetection && <li>• AI content detection enabled for written responses</li>}
                    <li>• Webcam monitoring will be active throughout the exam</li>
                    <li>• Integrity score must remain above {examSettings.integrityThreshold}%</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {questions.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No questions added</h3>
                <p className="text-muted-foreground">Add questions to see the exam preview.</p>
              </CardContent>
            </Card>
          ) : (
            questions.map((question, index) => (
              <Card key={question.id} className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="capitalize">
                        {question.type.replace("-", " ")}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{question.points} pts</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg leading-relaxed">{question.question || "Question text not provided"}</p>

                  {question.type === "mcq" && question.options && (
                    <RadioGroup disabled>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`q${question.id}-option-${optionIndex}`} />
                          <Label htmlFor={`q${question.id}-option-${optionIndex}`} className="cursor-pointer">
                            {option || `Option ${optionIndex + 1}`}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === "essay" && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Students will type their essay response here..."
                        className="min-h-[150px] resize-none"
                        disabled
                      />
                      {question.maxWords && (
                        <p className="text-sm text-muted-foreground">Maximum words: {question.maxWords}</p>
                      )}
                    </div>
                  )}

                  {question.type === "coding" && (
                    <div className="space-y-2">
                      <Label>Code Editor ({question.language})</Label>
                      <Textarea
                        placeholder="// Students will write their code here..."
                        className="min-h-[200px] font-mono text-sm resize-none"
                        disabled
                      />
                    </div>
                  )}

                  {question.type === "short-answer" && (
                    <Textarea
                      placeholder="Students will type their short answer here..."
                      className="min-h-[100px] resize-none"
                      disabled
                    />
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Exam Summary */}
        <Card className="border-border mt-8">
          <CardHeader>
            <CardTitle>Exam Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{questions.length}</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{examSettings.totalPoints}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{examSettings.duration}</p>
                <p className="text-sm text-muted-foreground">Minutes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{examSettings.passingScore}%</p>
                <p className="text-sm text-muted-foreground">Passing Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

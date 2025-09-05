"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Plus, Trash2, Save } from "lucide-react"

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

interface QuestionEditorProps {
  question: Question
  onSave: (question: Question) => void
  onClose: () => void
}

export function QuestionEditor({ question, onSave, onClose }: QuestionEditorProps) {
  const [editedQuestion, setEditedQuestion] = useState<Question>({ ...question })

  const handleSave = () => {
    onSave(editedQuestion)
    onClose()
  }

  const addOption = () => {
    if (editedQuestion.options) {
      setEditedQuestion({
        ...editedQuestion,
        options: [...editedQuestion.options, ""],
      })
    }
  }

  const updateOption = (index: number, value: string) => {
    if (editedQuestion.options) {
      const newOptions = [...editedQuestion.options]
      newOptions[index] = value
      setEditedQuestion({
        ...editedQuestion,
        options: newOptions,
      })
    }
  }

  const removeOption = (index: number) => {
    if (editedQuestion.options && editedQuestion.options.length > 2) {
      const newOptions = editedQuestion.options.filter((_, i) => i !== index)
      setEditedQuestion({
        ...editedQuestion,
        options: newOptions,
        correctAnswer:
          editedQuestion.correctAnswer === editedQuestion.options[index] ? "" : editedQuestion.correctAnswer,
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Badge variant="outline" className="capitalize">
                {editedQuestion.type.replace("-", " ")}
              </Badge>
              <span>Edit Question</span>
            </CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Question Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="questionText">Question Text *</Label>
              <Textarea
                id="questionText"
                placeholder="Enter your question here..."
                value={editedQuestion.question}
                onChange={(e) => setEditedQuestion({ ...editedQuestion, question: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="points">Points *</Label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  value={editedQuestion.points}
                  onChange={(e) =>
                    setEditedQuestion({ ...editedQuestion, points: Number.parseInt(e.target.value) || 1 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Add Image (Optional)</Label>
                <Button variant="outline" className="w-full bg-transparent">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
          </div>

          {/* Question Type Specific Fields */}
          {editedQuestion.type === "mcq" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Answer Options</Label>
                <Button variant="outline" size="sm" onClick={addOption}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-3">
                {editedQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                      />
                    </div>
                    <Button
                      variant={editedQuestion.correctAnswer === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEditedQuestion({ ...editedQuestion, correctAnswer: option })}
                    >
                      Correct
                    </Button>
                    {editedQuestion.options && editedQuestion.options.length > 2 && (
                      <Button variant="outline" size="sm" onClick={() => removeOption(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {editedQuestion.correctAnswer && (
                <div className="text-sm text-muted-foreground">
                  Correct answer: <span className="font-medium">{editedQuestion.correctAnswer}</span>
                </div>
              )}
            </div>
          )}

          {editedQuestion.type === "essay" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxWords">Maximum Words</Label>
                <Input
                  id="maxWords"
                  type="number"
                  min="50"
                  value={editedQuestion.maxWords || 500}
                  onChange={(e) =>
                    setEditedQuestion({ ...editedQuestion, maxWords: Number.parseInt(e.target.value) || 500 })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Students will be limited to this word count. AI detection will be applied to essay responses.
                </p>
              </div>
            </div>
          )}

          {editedQuestion.type === "coding" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Programming Language</Label>
                <Select
                  value={editedQuestion.language || "javascript"}
                  onValueChange={(value) => setEditedQuestion({ ...editedQuestion, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="c">C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sample Solution (Optional)</Label>
                <Textarea
                  placeholder="Provide a sample solution for reference..."
                  className="min-h-[100px] font-mono text-sm"
                />
              </div>
            </div>
          )}

          {editedQuestion.type === "short-answer" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Expected Answer Length</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select expected length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                    <SelectItem value="medium">Medium (1-2 paragraphs)</SelectItem>
                    <SelectItem value="long">Long (Multiple paragraphs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sample Answer (Optional)</Label>
                <Textarea placeholder="Provide a sample answer for grading reference..." className="min-h-[80px]" />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Question
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

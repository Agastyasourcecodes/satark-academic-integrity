"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Brain, AlertTriangle, Download } from "lucide-react"

interface AnalysisResult {
  questionId: string
  questionText: string
  answer: string
  aiLikelihood: number
  plagiarismRisk: number
  confidence: number
  flags: string[]
  explanation: string
}

interface PostSubmissionAnalysisProps {
  examId: string
  answers: Record<string, string>
  questions: any[]
  onAnalysisComplete: (results: AnalysisResult[]) => void
}

export function PostSubmissionAnalysis({
  examId,
  answers,
  questions,
  onAnalysisComplete,
}: PostSubmissionAnalysisProps) {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentAnalyzing, setCurrentAnalyzing] = useState<string>("")

  const analyzeSubmission = async () => {
    setIsAnalyzing(true)
    const results: AnalysisResult[] = []

    // Filter essay and short answer questions
    const textQuestions = questions.filter((q) => (q.type === "essay" || q.type === "short-answer") && answers[q.id])

    for (const question of textQuestions) {
      setCurrentAnalyzing(question.question)

      try {
        // AI Detection Analysis
        const aiResponse = await fetch("/api/ai-detection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: answers[question.id],
            type: "ai-detection",
          }),
        })

        const aiData = await aiResponse.json()

        // Plagiarism Risk Analysis
        const plagiarismResponse = await fetch("/api/ai-detection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: answers[question.id],
            type: "plagiarism",
          }),
        })

        const plagiarismData = await plagiarismResponse.json()

        if (aiData.success && plagiarismData.success) {
          results.push({
            questionId: question.id,
            questionText: question.question,
            answer: answers[question.id],
            aiLikelihood: aiData.analysis.aiLikelihood || 0,
            plagiarismRisk: plagiarismData.analysis.plagiarismRisk || 0,
            confidence: aiData.analysis.confidence || 0,
            flags: [...(aiData.analysis.flags || []), ...(plagiarismData.analysis.suggestions || [])],
            explanation: aiData.analysis.explanation || "Analysis completed",
          })
        }
      } catch (error) {
        console.error("Analysis failed for question:", question.id, error)
        results.push({
          questionId: question.id,
          questionText: question.question,
          answer: answers[question.id],
          aiLikelihood: 0,
          plagiarismRisk: 0,
          confidence: 0,
          flags: ["Analysis failed"],
          explanation: "Unable to complete analysis",
        })
      }
    }

    setAnalysisResults(results)
    setIsAnalyzing(false)
    setCurrentAnalyzing("")
    onAnalysisComplete(results)
  }

  useEffect(() => {
    analyzeSubmission()
  }, [])

  const getOverallScore = () => {
    if (analysisResults.length === 0) return 0
    const avgAI = analysisResults.reduce((sum, r) => sum + r.aiLikelihood, 0) / analysisResults.length
    const avgPlagiarism = analysisResults.reduce((sum, r) => sum + r.plagiarismRisk, 0) / analysisResults.length
    return Math.round(100 - (avgAI + avgPlagiarism) / 2)
  }

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "high", color: "destructive" }
    if (score >= 60) return { level: "medium", color: "warning" }
    if (score >= 40) return { level: "low", color: "secondary" }
    return { level: "minimal", color: "default" }
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Post-Submission AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-pulse rounded-full w-1/2"></div>
                </div>
                <span className="text-sm text-muted-foreground">Analyzing...</span>
              </div>
              <p className="text-sm text-muted-foreground">Currently analyzing: {currentAnalyzing}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{getOverallScore()}%</div>
                  <div className="text-sm text-muted-foreground">Authenticity Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{analysisResults.length}</div>
                  <div className="text-sm text-muted-foreground">Questions Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {analysisResults.filter((r) => r.aiLikelihood < 40).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Low Risk Responses</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {analysisResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Detailed Analysis Results</h3>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>

          {analysisResults.map((result, index) => {
            const aiRisk = getRiskLevel(result.aiLikelihood)
            const plagiarismRisk = getRiskLevel(result.plagiarismRisk)

            return (
              <Card key={result.questionId} className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Question {index + 1}</span>
                    <div className="flex gap-2">
                      <Badge variant={aiRisk.color as any} className="text-xs">
                        AI: {result.aiLikelihood}%
                      </Badge>
                      <Badge variant={plagiarismRisk.color as any} className="text-xs">
                        Plagiarism: {result.plagiarismRisk}%
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{result.questionText}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>AI Likelihood</span>
                      <span>{result.aiLikelihood}%</span>
                    </div>
                    <Progress value={result.aiLikelihood} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Plagiarism Risk</span>
                      <span>{result.plagiarismRisk}%</span>
                    </div>
                    <Progress value={result.plagiarismRisk} className="h-2" />
                  </div>

                  {result.flags.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                        <span className="text-sm font-medium">Analysis Notes</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {result.flags.slice(0, 3).map((flag, flagIndex) => (
                          <Badge key={flagIndex} variant="outline" className="text-xs">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">{result.explanation}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

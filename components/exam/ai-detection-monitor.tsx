"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Brain, Shield, Zap } from "lucide-react"

interface AIAnalysis {
  aiLikelihood: number
  confidence: number
  explanation: string
  flags: string[]
}

interface AIDetectionMonitorProps {
  text: string
  onAnalysisComplete: (analysis: AIAnalysis) => void
  isActive: boolean
  questionType: "essay" | "short-answer" | "other"
}

export function AIDetectionMonitor({ text, onAnalysisComplete, isActive, questionType }: AIDetectionMonitorProps) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastAnalyzedText, setLastAnalyzedText] = useState("")

  const analyzeText = useCallback(
    async (textToAnalyze: string) => {
      if (!textToAnalyze || textToAnalyze.length < 50) return

      setIsAnalyzing(true)
      try {
        const response = await fetch("/api/ai-detection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: textToAnalyze,
            type: "ai-detection",
          }),
        })

        const data = await response.json()
        if (data.success) {
          setAnalysis(data.analysis)
          onAnalysisComplete(data.analysis)
          setLastAnalyzedText(textToAnalyze)
        }
      } catch (error) {
        console.error("AI Detection failed:", error)
      } finally {
        setIsAnalyzing(false)
      }
    },
    [onAnalysisComplete],
  )

  // Debounced analysis - analyze 2 seconds after user stops typing
  useEffect(() => {
    if (!isActive || questionType === "other" || text === lastAnalyzedText) return

    const timer = setTimeout(() => {
      if (text.length >= 50) {
        analyzeText(text)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [text, isActive, questionType, analyzeText, lastAnalyzedText])

  if (!isActive || questionType === "other") return null

  const getRiskLevel = (likelihood: number) => {
    if (likelihood >= 80) return { level: "high", color: "destructive" }
    if (likelihood >= 60) return { level: "medium", color: "warning" }
    if (likelihood >= 40) return { level: "low", color: "secondary" }
    return { level: "minimal", color: "default" }
  }

  const risk = analysis ? getRiskLevel(analysis.aiLikelihood) : null

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Brain className="h-4 w-4 text-amber-600" />
          AI Detection Monitor
          {isAnalyzing && <Zap className="h-3 w-3 animate-pulse text-amber-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {text.length < 50 ? (
          <p className="text-xs text-muted-foreground">Write at least 50 characters for AI analysis...</p>
        ) : isAnalyzing ? (
          <div className="flex items-center gap-2">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 animate-pulse rounded-full w-1/3"></div>
            </div>
            <span className="text-xs text-muted-foreground">Analyzing...</span>
          </div>
        ) : analysis ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">AI Likelihood</span>
              <Badge variant={risk?.color as any} className="text-xs">
                {analysis.aiLikelihood}% {risk?.level}
              </Badge>
            </div>

            <Progress value={analysis.aiLikelihood} className="h-2" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Confidence</span>
              <span className="text-xs text-muted-foreground">{analysis.confidence}%</span>
            </div>

            {analysis.flags.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                  <span className="text-xs font-medium">Flags</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {analysis.flags.map((flag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {flag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">{analysis.explanation}</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            Ready to analyze your response
          </div>
        )}
      </CardContent>
    </Card>
  )
}

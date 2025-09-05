import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { examId, answers, integrityScore, violations, timeUsed, aiAnalysisResults } = await request.json()

    // Simulate saving to database
    const submission = {
      id: `submission_${Date.now()}`,
      examId,
      studentId: "current_student", // Would come from auth
      answers,
      integrityScore,
      violations,
      timeUsed,
      aiAnalysisResults,
      submittedAt: new Date().toISOString(),
      status: "submitted",
    }

    // Calculate final scores
    const aiScores = Object.values(aiAnalysisResults || {}) as any[]
    const avgAILikelihood =
      aiScores.length > 0
        ? aiScores.reduce((sum: number, analysis: any) => sum + (analysis.aiLikelihood || 0), 0) / aiScores.length
        : 0

    const finalScore = Math.max(0, integrityScore - Math.floor(avgAILikelihood / 4))

    console.log("[v0] Exam submission processed:", {
      submissionId: submission.id,
      finalScore,
      avgAILikelihood,
      violationCount: violations.length,
    })

    return NextResponse.json({
      success: true,
      submission: {
        ...submission,
        finalScore,
        avgAILikelihood: Math.round(avgAILikelihood),
      },
    })
  } catch (error) {
    console.error("Exam submission error:", error)
    return NextResponse.json({ error: "Failed to submit exam" }, { status: 500 })
  }
}

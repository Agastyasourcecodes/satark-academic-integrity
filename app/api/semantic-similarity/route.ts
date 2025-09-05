import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { text1, text2, examId } = await request.json()

    if (!text1 || !text2) {
      return NextResponse.json({ error: "Both texts are required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Compare these two texts for semantic similarity and potential plagiarism:

Text 1: "${text1}"

Text 2: "${text2}"

Analyze for:
1. Semantic similarity (meaning and concepts)
2. Structural similarity (organization and flow)
3. Vocabulary overlap
4. Unique ideas vs shared concepts
5. Potential plagiarism indicators

Provide a similarity score from 0-100 and detailed analysis.

Respond in JSON format: {
  "similarityScore": number,
  "semanticSimilarity": number,
  "structuralSimilarity": number,
  "vocabularyOverlap": number,
  "plagiarismRisk": number,
  "analysis": "detailed explanation",
  "sharedConcepts": ["list of shared ideas"],
  "uniqueElements": ["list of unique aspects in each text"]
}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const analysisText = response.text()

    let analysis
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      analysis = {
        similarityScore: 0,
        semanticSimilarity: 0,
        structuralSimilarity: 0,
        vocabularyOverlap: 0,
        plagiarismRisk: 0,
        analysis: "Unable to parse similarity analysis",
        sharedConcepts: [],
        uniqueElements: [],
      }
    }

    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Semantic Similarity Error:", error)
    return NextResponse.json({ error: "Failed to analyze similarity" }, { status: 500 })
  }
}

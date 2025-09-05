"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Eye, EyeOff, User, AlertTriangle, Shield, Wifi, WifiOff } from "lucide-react"

interface ProctoringData {
  faceDetected: boolean
  faceCount: number
  gazeDirection: "center" | "left" | "right" | "up" | "down" | "away"
  attentionScore: number
  suspiciousActivity: string[]
  connectionStatus: "connected" | "disconnected" | "reconnecting"
}

interface AdvancedProctoringProps {
  onViolation: (violation: string, severity: "low" | "medium" | "high") => void
  onProctoringData: (data: ProctoringData) => void
  isActive: boolean
}

export function AdvancedProctoring({ onViolation, onProctoringData, isActive }: AdvancedProctoringProps) {
  const [proctoringData, setProctoringData] = useState<ProctoringData>({
    faceDetected: false,
    faceCount: 0,
    gazeDirection: "center",
    attentionScore: 100,
    suspiciousActivity: [],
    connectionStatus: "disconnected",
  })

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastViolationTime, setLastViolationTime] = useState<number>(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

  // Initialize webcam and computer vision
  const initializeProctoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
        audio: true,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      // Initialize WebRTC for teacher monitoring
      await initializeWebRTC(stream)

      setProctoringData((prev) => ({
        ...prev,
        connectionStatus: "connected",
      }))

      // Start computer vision analysis
      startFaceAnalysis()
    } catch (error) {
      console.error("[v0] Proctoring initialization error:", error)
      onViolation("Camera access denied or unavailable", "high")
      setProctoringData((prev) => ({
        ...prev,
        connectionStatus: "disconnected",
      }))
    }
  }, [onViolation])

  // Initialize WebRTC connection for live teacher monitoring
  const initializeWebRTC = async (stream: MediaStream) => {
    try {
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
      })

      // Add local stream to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream)
      })

      peerConnectionRef.current = peerConnection

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        const state = peerConnection.connectionState
        setProctoringData((prev) => ({
          ...prev,
          connectionStatus:
            state === "connected" ? "connected" : state === "connecting" ? "reconnecting" : "disconnected",
        }))
      }
    } catch (error) {
      console.error("[v0] WebRTC initialization error:", error)
    }
  }

  // Advanced face detection and analysis
  const startFaceAnalysis = () => {
    setIsAnalyzing(true)

    analysisIntervalRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current && isActive) {
        performFaceAnalysis()
      }
    }, 1000) // Analyze every second
  }

  const performFaceAnalysis = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current frame to canvas for analysis
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Simulate advanced computer vision analysis
    // In a real implementation, this would use libraries like OpenCV.js or TensorFlow.js
    const analysisResult = simulateComputerVision(ctx, canvas.width, canvas.height)

    // Update proctoring data
    const newData: ProctoringData = {
      faceDetected: analysisResult.faceCount > 0,
      faceCount: analysisResult.faceCount,
      gazeDirection: analysisResult.gazeDirection,
      attentionScore: calculateAttentionScore(analysisResult),
      suspiciousActivity: analysisResult.suspiciousActivity,
      connectionStatus: proctoringData.connectionStatus,
    }

    setProctoringData(newData)
    onProctoringData(newData)

    // Check for violations
    checkForViolations(analysisResult)
  }

  // Simulate computer vision analysis (placeholder for real CV implementation)
  const simulateComputerVision = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Get image data for analysis
    const imageData = ctx.getImageData(0, 0, width, height)

    // Simulate face detection results
    const faceCount = Math.random() > 0.1 ? (Math.random() > 0.95 ? 2 : 1) : 0

    // Simulate gaze tracking
    const gazeDirections: ProctoringData["gazeDirection"][] = ["center", "left", "right", "up", "down", "away"]
    const gazeDirection = gazeDirections[Math.floor(Math.random() * gazeDirections.length)]

    // Simulate suspicious activity detection
    const suspiciousActivity: string[] = []
    if (Math.random() > 0.98) suspiciousActivity.push("Unusual head movement detected")
    if (Math.random() > 0.99) suspiciousActivity.push("Object detected near face")

    return {
      faceCount,
      gazeDirection,
      suspiciousActivity,
      brightness: calculateBrightness(imageData),
      motion: Math.random() * 100, // Simulate motion detection
    }
  }

  const calculateBrightness = (imageData: ImageData) => {
    let totalBrightness = 0
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      totalBrightness += (r + g + b) / 3
    }

    return totalBrightness / (data.length / 4)
  }

  const calculateAttentionScore = (analysis: any) => {
    let score = 100

    // Reduce score based on gaze direction
    if (analysis.gazeDirection === "away") score -= 20
    else if (analysis.gazeDirection !== "center") score -= 5

    // Reduce score for multiple faces
    if (analysis.faceCount > 1) score -= 15
    else if (analysis.faceCount === 0) score -= 25

    // Reduce score for suspicious activity
    score -= analysis.suspiciousActivity.length * 10

    return Math.max(0, Math.min(100, score))
  }

  const checkForViolations = (analysis: any) => {
    const now = Date.now()

    // Prevent spam violations (minimum 2 seconds between same type)
    if (now - lastViolationTime < 2000) return

    // Check for face-related violations
    if (analysis.faceCount === 0) {
      onViolation("No face detected in camera", "high")
      setLastViolationTime(now)
    } else if (analysis.faceCount > 1) {
      onViolation("Multiple faces detected", "high")
      setLastViolationTime(now)
    }

    // Check for gaze violations
    if (analysis.gazeDirection === "away") {
      onViolation("Student looking away from screen", "medium")
      setLastViolationTime(now)
    }

    // Check for suspicious activity
    analysis.suspiciousActivity.forEach((activity: string) => {
      onViolation(activity, "medium")
    })
  }

  // Cleanup function
  const cleanup = useCallback(() => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current)
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }

    setIsAnalyzing(false)
  }, [])

  // Initialize proctoring when component mounts and is active
  useEffect(() => {
    if (isActive) {
      initializeProctoring()
    } else {
      cleanup()
    }

    return cleanup
  }, [isActive, initializeProctoring, cleanup])

  return (
    <div className="space-y-4">
      {/* Hidden video and canvas for analysis */}
      <div className="hidden">
        <video ref={videoRef} autoPlay muted playsInline />
        <canvas ref={canvasRef} />
      </div>

      {/* Proctoring Status Card */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Advanced Proctoring Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Connection</span>
            <div className="flex items-center space-x-2">
              {proctoringData.connectionStatus === "connected" ? (
                <Wifi className="h-4 w-4 text-primary" />
              ) : (
                <WifiOff className="h-4 w-4 text-destructive" />
              )}
              <Badge
                variant={proctoringData.connectionStatus === "connected" ? "default" : "destructive"}
                className="text-xs"
              >
                {proctoringData.connectionStatus}
              </Badge>
            </div>
          </div>

          {/* Face Detection */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Face Detection</span>
            <div className="flex items-center space-x-2">
              {proctoringData.faceDetected ? (
                <User className="h-4 w-4 text-primary" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              )}
              <Badge variant={proctoringData.faceDetected ? "default" : "destructive"} className="text-xs">
                {proctoringData.faceCount} face(s)
              </Badge>
            </div>
          </div>

          {/* Gaze Tracking */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Gaze Direction</span>
            <Badge variant={proctoringData.gazeDirection === "center" ? "default" : "secondary"} className="text-xs">
              {proctoringData.gazeDirection}
            </Badge>
          </div>

          {/* Attention Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Attention Score</span>
              <span className="text-sm font-medium">{proctoringData.attentionScore}%</span>
            </div>
            <Progress value={proctoringData.attentionScore} className="h-2" />
          </div>

          {/* Camera Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Camera</span>
            <div className="flex items-center space-x-2">
              {isAnalyzing ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-destructive" />}
              <Badge variant={isAnalyzing ? "default" : "destructive"} className="text-xs">
                {isAnalyzing ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suspicious Activity Alerts */}
      {proctoringData.suspiciousActivity.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Suspicious Activity Detected:</strong>
            <ul className="mt-1 text-sm">
              {proctoringData.suspiciousActivity.map((activity, index) => (
                <li key={index}>• {activity}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

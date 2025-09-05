"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Camera, Shield, CheckCircle, AlertTriangle, Clock } from "lucide-react"

interface PreExamVerificationProps {
  exam: {
    title: string
    subject: string
    teacher: string
    duration: number
  }
  onStartExam: () => void
  onWebcamReady: (ready: boolean) => void
}

export function PreExamVerification({ exam, onStartExam, onWebcamReady }: PreExamVerificationProps) {
  const [webcamPermission, setWebcamPermission] = useState<"pending" | "granted" | "denied">("pending")
  const [faceDetected, setFaceDetected] = useState(false)
  const [verificationComplete, setVerificationComplete] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    initializeWebcam()
  }, [])

  const initializeWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setWebcamPermission("granted")
        onWebcamReady(true)

        // Simulate face detection after 2 seconds
        setTimeout(() => {
          setFaceDetected(true)
          setVerificationComplete(true)
        }, 2000)
      }
    } catch (error) {
      console.error("[v0] Webcam access denied:", error)
      setWebcamPermission("denied")
      onWebcamReady(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Pre-Exam Verification</h1>
          <p className="text-muted-foreground">Please complete the verification process before starting your exam</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Exam Information */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Exam Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{exam.title}</h3>
                <p className="text-muted-foreground">{exam.subject}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Instructor:</span>
                  <span className="font-medium">{exam.teacher}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration:</span>
                  <span className="font-medium">{exam.duration} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Proctoring:</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Shield className="h-3 w-3 mr-1" />
                    Enabled
                  </Badge>
                </div>
              </div>

              <Alert className="border-primary/50 bg-primary/10">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Notice:</strong> This exam uses advanced proctoring technology. Your webcam will
                  remain active throughout the exam for integrity monitoring.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Webcam Verification */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-primary" />
                <span>Identity Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <video ref={videoRef} autoPlay muted className="w-full h-48 bg-muted rounded-lg object-cover" />

                {webcamPermission === "pending" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                    <div className="text-center">
                      <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Requesting camera access...</p>
                    </div>
                  </div>
                )}

                {webcamPermission === "denied" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 rounded-lg">
                    <div className="text-center">
                      <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
                      <p className="text-sm text-destructive">Camera access required</p>
                    </div>
                  </div>
                )}

                {faceDetected && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Face Detected
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Camera Permission:</span>
                  <div className="flex items-center space-x-1">
                    {webcamPermission === "granted" ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                    <span className="text-sm capitalize">{webcamPermission}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Face Detection:</span>
                  <div className="flex items-center space-x-1">
                    {faceDetected ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">{faceDetected ? "Verified" : "Scanning..."}</span>
                  </div>
                </div>
              </div>

              {webcamPermission === "denied" && (
                <Alert className="border-destructive/50 bg-destructive/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Camera access is required to start the exam. Please enable camera permissions and refresh the page.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Exam Rules */}
        <Card className="border-border mt-6">
          <CardHeader>
            <CardTitle>Exam Rules & Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Security Measures:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Fullscreen mode will be enforced</li>
                  <li>• Tab switching is prohibited</li>
                  <li>• Copy/paste functions are disabled</li>
                  <li>• Right-click is disabled</li>
                  <li>• Webcam must remain active</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Integrity Monitoring:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Face must be visible at all times</li>
                  <li>• Multiple faces will trigger alerts</li>
                  <li>• Suspicious behavior is tracked</li>
                  <li>• AI detection for written answers</li>
                  <li>• Auto-submission if score drops below 60%</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start Exam Button */}
        <div className="text-center mt-6">
          <Button onClick={onStartExam} disabled={!verificationComplete} size="lg" className="px-8">
            {verificationComplete ? (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Start Secure Exam
              </>
            ) : (
              "Complete Verification First"
            )}
          </Button>

          {verificationComplete && (
            <p className="text-sm text-muted-foreground mt-2">
              By starting the exam, you agree to the security measures and monitoring protocols.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

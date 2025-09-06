import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Eye, Brain, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Satark</h1>
                <p className="text-sm text-muted-foreground">Where Exams Meet Trust</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-foreground mb-6 text-balance">
              Secure Online Examinations with <span className="text-primary">AI-Powered Integrity</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Ensure academic integrity with real-time proctoring, AI detection, and comprehensive monitoring. Built for
              educators who value trust and students who deserve fair assessments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/teacher/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Start as Teacher
                </Button>
              </Link>
              <Link href="/auth/register?role=student">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  Join as Student
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Comprehensive Exam Security</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced technology meets educational excellence to create the most secure online examination environment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border">
              <CardHeader>
                <Eye className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Real-time Proctoring</CardTitle>
                <CardDescription>Live webcam monitoring with face detection and behavior analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Face verification & tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Multiple face detection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Suspicious behavior alerts
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <Brain className="h-10 w-10 text-primary mb-2" />
                <CardTitle>AI Content Detection</CardTitle>
                <CardDescription>
                  Powered by Gemini API for real-time plagiarism and AI-generated content detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Live AI text detection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Semantic similarity checks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Plagiarism analysis
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <Lock className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Secure Environment</CardTitle>
                <CardDescription>Fullscreen lockdown mode with comprehensive security measures</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Fullscreen lockdown
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Tab switching prevention
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Copy/paste restrictions
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Built for Everyone</h3>
            <p className="text-lg text-muted-foreground">Tailored experiences for both educators and students</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-border">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">For Teachers</CardTitle>
                <CardDescription>Comprehensive exam management and monitoring tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Create and manage exams with multiple question types</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Real-time proctoring dashboard with live student feeds</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Detailed integrity reports and analytics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Export reports as CSV/PDF</span>
                  </li>
                </ul>
                <Link href="/auth/register?role=teacher" className="block">
                  <Button className="w-full mt-4">Start Teaching</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">For Students</CardTitle>
                <CardDescription>Secure and fair examination environment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Clean, distraction-free exam interface</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Auto-save functionality for peace of mind</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Clear exam schedule and countdown timers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Fair and transparent integrity monitoring</span>
                  </li>
                </ul>
                <Link href="/auth/register?role=student" className="block">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    Join as Student
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Satark</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Satark Platform. Ensuring academic integrity through advanced technology.
          </p>
        </div>
      </footer>
    </div>
  )
}

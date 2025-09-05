"use client"

import { Clock } from "lucide-react"

interface ExamTimerProps {
  timeRemaining: number // in seconds
}

export function ExamTimer({ timeRemaining }: ExamTimerProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const getTimerColor = () => {
    if (timeRemaining < 300) return "text-destructive" // Less than 5 minutes
    if (timeRemaining < 900) return "text-yellow-600" // Less than 15 minutes
    return "text-foreground"
  }

  return (
    <div className={`flex items-center space-x-2 ${getTimerColor()}`}>
      <Clock className="h-4 w-4" />
      <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
    </div>
  )
}

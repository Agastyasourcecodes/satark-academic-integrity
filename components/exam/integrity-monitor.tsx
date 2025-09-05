"use client"

import { Shield, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface IntegrityMonitorProps {
  score: number
}

export function IntegrityMonitor({ score }: IntegrityMonitorProps) {
  const getScoreColor = () => {
    if (score >= 80) return "bg-primary/10 text-primary border-primary/20"
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-destructive/10 text-destructive border-destructive/20"
  }

  const getIcon = () => {
    if (score >= 60) return <Shield className="h-3 w-3" />
    return <AlertTriangle className="h-3 w-3" />
  }

  return (
    <Badge variant="outline" className={getScoreColor()}>
      {getIcon()}
      <span className="ml-1">Integrity: {score}%</span>
    </Badge>
  )
}

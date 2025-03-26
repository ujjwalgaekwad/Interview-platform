import type { LucideIcon } from "lucide-react"

export interface Interview {
  id: string
  title: string
  icon: LucideIcon
  description: string
  status: "available" | "in_progress" | "completed"
  duration: number // in minutes
}

export interface Session {
  id: string
  title: string
  date: string
  type: "mock_interview" | "coding_challenge" | "system_design"
  status: "scheduled" | "completed" | "cancelled"
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "student" | "interviewer" | "admin"
}

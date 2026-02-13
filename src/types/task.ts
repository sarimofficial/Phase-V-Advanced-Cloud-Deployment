/**
 * Task types for the Todo application.
 */

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: number
  user_id: string
  title: string
  description: string | null
  completed: boolean
  due_at: string | null
  priority: Priority | null
  tags: string[] | null
  rrule: string | null
  reminder_sent: boolean
  created_at: string
  updated_at: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  due_at?: string
  priority?: Priority
  tags?: string[]
  rrule?: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  due_at?: string
  priority?: Priority
  tags?: string[]
  rrule?: string
}

export interface TaskListResponse {
  tasks: Task[]
  count: number
}

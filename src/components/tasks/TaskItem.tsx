'use client'

import { useState } from 'react'
import type { Task, Priority } from '@/types/task'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

interface TaskItemProps {
  task: Task
  onToggleComplete: (taskId: number) => Promise<void>
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => Promise<void>
}

const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
  high: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
  urgent: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
}

const PRIORITY_ICONS: Record<Priority, string> = {
  low: '🔵',
  medium: '🟡',
  high: '🟠',
  urgent: '🔴',
}

export default function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      await onToggleComplete(task.id)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await onDelete(task.id)
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  // Calculate if task is overdue
  const isOverdue = task.due_at && !task.completed && new Date(task.due_at) < new Date()
  const isDueSoon = task.due_at && !task.completed && new Date(task.due_at) < new Date(Date.now() + 24 * 60 * 60 * 1000)

  // Format due date
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffMs < 0) {
      return `Overdue by ${Math.abs(diffDays)}d`
    } else if (diffHours < 24) {
      return `Due in ${diffHours}h`
    } else if (diffDays < 7) {
      return `Due in ${diffDays}d`
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  return (
    <Card
      variant="bordered"
      className={`mb-4 transition-all duration-300 border-2 ${
        task.completed
          ? 'bg-gray-50/50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800'
          : isOverdue
          ? 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30 hover:shadow-lg hover:shadow-red-500/10'
          : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/30 hover:shadow-lg hover:shadow-indigo-500/5'
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`
            mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center
            transition-all duration-300 cursor-pointer flex-shrink-0
            ${task.completed
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500'
            }
            ${loading ? 'opacity-50 cursor-wait' : ''}
          `}
        >
          {task.completed && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          {/* Header with badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-black font-mono px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-100/50 dark:border-indigo-800/50 uppercase tracking-tighter">
              ID-{task.id}
            </span>

            {/* Priority Badge */}
            {task.priority && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${PRIORITY_COLORS[task.priority]}`}>
                {PRIORITY_ICONS[task.priority]} {task.priority.toUpperCase()}
              </span>
            )}

            {/* Recurring Badge */}
            {task.rrule && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-md border bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">
                🔄 RECURRING
              </span>
            )}

            {/* Due Date Badge */}
            {task.due_at && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                isOverdue
                  ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 animate-pulse'
                  : isDueSoon
                  ? 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
                  : 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
              }`}>
                {isOverdue ? '⚠️' : '📅'} {formatDueDate(task.due_at)}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`font-bold text-lg leading-tight transition-all duration-300 ${
              task.completed
                ? 'text-gray-400 line-through decoration-gray-300'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p
              className={`text-sm mt-2 transition-all duration-300 ${
                task.completed
                  ? 'text-gray-300 dark:text-gray-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs font-semibold px-2 py-1 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Created Date */}
          <div className="flex items-center gap-2 mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Created {new Date(task.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            disabled={loading}
            className="rounded-xl px-3 py-1.5"
          >
            Edit
          </Button>

          {showDeleteConfirm ? (
            <div className="flex gap-1">
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                loading={loading}
                className="rounded-xl px-3 py-1.5"
              >
                Confirm
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                className="rounded-xl px-3 py-1.5"
              >
                No
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
              className="text-red-500 hover:text-white hover:bg-red-500 rounded-xl px-3 py-1.5 transition-all"
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

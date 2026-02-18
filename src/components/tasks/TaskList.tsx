'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Task, Priority, UpdateTaskInput } from '@/types/task'
import { api } from '@/lib/backend-client'
import { useSession } from '@/lib/auth-client'
import TaskItem from './TaskItem'
import TaskEditModal from './TaskEditModal'
import Button from '../ui/Button'

interface TaskListProps {
  refreshTrigger?: number
  onTasksLoaded?: (tasks: Task[]) => void
}

type SortOption = 'created' | 'due_date' | 'priority' | 'title'
type FilterStatus = 'all' | 'pending' | 'completed'
type FilterDueDate = 'all' | 'overdue' | 'due_soon' | 'no_due_date'

export default function TaskList({
  refreshTrigger = 0,
  onTasksLoaded,
}: TaskListProps) {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all')
  const [filterDueDate, setFilterDueDate] = useState<FilterDueDate>('all')
  const [filterTag, setFilterTag] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('created')
  const [showFilters, setShowFilters] = useState(false)

  const fetchTasks = useCallback(async () => {
    if (!session?.user?.id) return

    setLoading(true)
    setError('')

    try {
      const fetchedTasks = await api.tasks.list(session.user.id)
      setTasks(fetchedTasks)
      onTasksLoaded?.(fetchedTasks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id, onTasksLoaded])

  useEffect(() => {
    if (session?.user?.id) {
      fetchTasks()
    }
  }, [fetchTasks, refreshTrigger, session?.user?.id])

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    tasks.forEach(task => {
      task.tags?.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [tasks])

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task =>
        filterStatus === 'completed' ? task.completed : !task.completed
      )
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority)
    }

    // Due date filter
    if (filterDueDate !== 'all') {
      const now = new Date()
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

      filtered = filtered.filter(task => {
        if (filterDueDate === 'no_due_date') return !task.due_at
        if (!task.due_at) return false

        const dueDate = new Date(task.due_at)
        if (filterDueDate === 'overdue') return dueDate < now && !task.completed
        if (filterDueDate === 'due_soon') return dueDate < tomorrow && dueDate >= now && !task.completed
        return true
      })
    }

    // Tag filter
    if (filterTag !== 'all') {
      filtered = filtered.filter(task => task.tags?.includes(filterTag))
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'due_date':
          if (!a.due_at && !b.due_at) return 0
          if (!a.due_at) return 1
          if (!b.due_at) return -1
          return new Date(a.due_at).getTime() - new Date(b.due_at).getTime()

        case 'priority':
          const priorityOrder: Record<Priority, number> = { urgent: 0, high: 1, medium: 2, low: 3 }
          const aPriority = a.priority ? priorityOrder[a.priority] : 4
          const bPriority = b.priority ? priorityOrder[b.priority] : 4
          return aPriority - bPriority

        case 'title':
          return a.title.localeCompare(b.title)

        case 'created':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return filtered
  }, [tasks, searchQuery, filterStatus, filterPriority, filterDueDate, filterTag, sortBy])

  const handleToggleComplete = async (taskId: number) => {
    if (!session?.user?.id) return

    try {
      const updatedTask = await api.tasks.toggleComplete(session.user.id, taskId)
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
  }

  const handleEditSave = async (taskId: number, data: UpdateTaskInput) => {
    if (!session?.user?.id) return

    try {
      const updatedTask = await api.tasks.update(session.user.id, taskId, data)
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      )
      setEditingTask(null)
    } catch (err) {
      throw err
    }
  }

  const handleDelete = async (taskId: number) => {
    if (!session?.user?.id) return

    try {
      await api.tasks.delete(session.user.id, taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
    }
  }

  // Statistics
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const pending = total - completed
    const overdue = tasks.filter(t => t.due_at && new Date(t.due_at) < new Date() && !t.completed).length
    const dueSoon = tasks.filter(t => {
      if (!t.due_at || t.completed) return false
      const dueDate = new Date(t.due_at)
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
      return dueDate < tomorrow && dueDate >= new Date()
    }).length

    return { total, completed, pending, overdue, dueSoon }
  }, [tasks])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Syncing with AI</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto animate-pulse">Your productivity engine is warming up...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-900/30 rounded-[2rem] text-center animate-shake">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 font-black">!</div>
        <p className="text-red-700 dark:text-red-400 font-bold mb-4">{error}</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={fetchTasks}
          className="rounded-xl px-6"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 px-6 bg-white dark:bg-slate-900/50 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem] transition-all duration-500 hover:border-indigo-200 dark:hover:border-indigo-900/30">
        <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6 group">
          <svg
            className="w-12 h-12 text-indigo-400 group-hover:scale-110 transition-transform duration-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 italic">Zero distractions.</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto font-medium">Your task list is crystal clear. Time to start something amazing!</p>
      </div>
    )
  }

  const pendingTasks = filteredAndSortedTasks.filter((t) => !t.completed)
  const completedTasks = filteredAndSortedTasks.filter((t) => t.completed)

  return (
    <>
      {/* Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800">
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{stats.total}</div>
          <div className="text-xs font-bold text-indigo-600/70 dark:text-indigo-400/70 uppercase tracking-wider">Total</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10 p-4 rounded-2xl border border-yellow-200 dark:border-yellow-800">
          <div className="text-2xl font-black text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
          <div className="text-xs font-bold text-yellow-600/70 dark:text-yellow-400/70 uppercase tracking-wider">Pending</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 p-4 rounded-2xl border border-green-200 dark:border-green-800">
          <div className="text-2xl font-black text-green-600 dark:text-green-400">{stats.completed}</div>
          <div className="text-xs font-bold text-green-600/70 dark:text-green-400/70 uppercase tracking-wider">Done</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 p-4 rounded-2xl border border-red-200 dark:border-red-800">
          <div className="text-2xl font-black text-red-600 dark:text-red-400">{stats.overdue}</div>
          <div className="text-xs font-bold text-red-600/70 dark:text-red-400/70 uppercase tracking-wider">Overdue</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 p-4 rounded-2xl border border-orange-200 dark:border-orange-800">
          <div className="text-2xl font-black text-orange-600 dark:text-orange-400">{stats.dueSoon}</div>
          <div className="text-xs font-bold text-orange-600/70 dark:text-orange-400/70 uppercase tracking-wider">Due Soon</div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-gray-800 rounded-3xl p-6 mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search tasks..."
            className="w-full px-5 py-3 pl-12 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl transition-all duration-300 outline-none focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 dark:text-white font-medium"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full sm:w-auto px-6 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all"
        >
          {showFilters ? '− Hide Filters' : '+ Show Filters'}
        </button>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t-2 border-gray-100 dark:border-gray-800">
            {/* Status Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-sm dark:text-white"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Priority</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as Priority | 'all')}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-sm dark:text-white"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🔵 Low</option>
              </select>
            </div>

            {/* Due Date Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Due Date</label>
              <select
                value={filterDueDate}
                onChange={(e) => setFilterDueDate(e.target.value as FilterDueDate)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-sm dark:text-white"
              >
                <option value="all">All Dates</option>
                <option value="overdue">⚠️ Overdue</option>
                <option value="due_soon">📅 Due Soon</option>
                <option value="no_due_date">No Due Date</option>
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Tag</label>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-sm dark:text-white"
              >
                <option value="all">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>#{tag}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Sort */}
        <div className="flex items-center gap-3 pt-4 border-t-2 border-gray-100 dark:border-gray-800">
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Sort by:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'created', label: 'Created' },
              { value: 'due_date', label: 'Due Date' },
              { value: 'priority', label: 'Priority' },
              { value: 'title', label: 'Title' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as SortOption)}
                className={`px-4 py-1.5 rounded-lg font-semibold text-xs transition-all ${sortBy === option.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task Lists */}
      <div className="space-y-12">
        {pendingTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
                In Progress
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-indigo-100 dark:from-indigo-900/30 to-transparent"></div>
              <span className="text-[10px] font-bold text-gray-400">{pendingTasks.length} {pendingTasks.length === 1 ? 'Task' : 'Tasks'}</span>
            </div>
            <div className="grid gap-4">
              {pendingTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {completedTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-[0.2em] bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full border border-green-100 dark:border-green-800">
                Completed
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-green-100 dark:from-green-900/30 to-transparent"></div>
              <span className="text-[10px] font-bold text-gray-400">{completedTasks.length} {completedTasks.length === 1 ? 'Task' : 'Tasks'}</span>
            </div>
            <div className="grid gap-4 opacity-75 grayscale-[0.2]">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {filteredAndSortedTasks.length === 0 && (
          <div className="text-center py-12 px-6 bg-gray-50 dark:bg-slate-900/50 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
            <p className="text-gray-500 dark:text-gray-400 font-semibold">No tasks match your filters</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setFilterStatus('all')
                setFilterPriority('all')
                setFilterDueDate('all')
                setFilterTag('all')
              }}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onSave={handleEditSave}
          onClose={() => setEditingTask(null)}
        />
      )}
    </>
  )
}

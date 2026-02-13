import { useState } from 'react'
import type { Task, Priority, UpdateTaskInput } from '@/types/task'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface TaskEditModalProps {
  task: Task
  onSave: (taskId: number, data: UpdateTaskInput) => Promise<void>
  onClose: () => void
}

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-200' },
]

const RECURRING_PRESETS = [
  { label: 'Daily', value: 'FREQ=DAILY' },
  { label: 'Weekly', value: 'FREQ=WEEKLY' },
  { label: 'Monthly', value: 'FREQ=MONTHLY' },
  { label: 'Weekdays', value: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR' },
]

export default function TaskEditModal({
  task,
  onSave,
  onClose,
}: TaskEditModalProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [priority, setPriority] = useState<Priority>(task.priority || 'medium')
  const [dueDate, setDueDate] = useState(task.due_at ? new Date(task.due_at).toISOString().slice(0, 16) : '')
  const [tags, setTags] = useState(task.tags ? task.tags.join(', ') : '')
  const [isRecurring, setIsRecurring] = useState(!!task.rrule)
  const [rrule, setRrule] = useState(task.rrule || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setLoading(true)
    try {
      const tagArray = tags.trim() ? tags.split(',').map(t => t.trim()).filter(Boolean) : []

      await onSave(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        due_at: dueDate || undefined,
        tags: tagArray,
        rrule: isRecurring && rrule ? rrule : undefined,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="glass bg-white/90 dark:bg-slate-900/90 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] max-w-2xl w-full p-8 border border-white/40 dark:border-white/10 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <span className="w-1.5 h-8 bg-indigo-600 rounded-full"></span>
            Edit Task
          </h2>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            {showAdvanced ? '− Simple' : '+ Advanced'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-2xl text-sm font-medium animate-shake">
              {error}
            </div>
          )}

          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            maxLength={200}
            required
          />

          <div className="group">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              maxLength={1000}
              rows={3}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl transition-all duration-300 outline-none focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 dark:text-white"
            />
          </div>

          {showAdvanced && (
            <div className="space-y-6 pt-4 border-t-2 border-gray-100 dark:border-gray-800">
              {/* Priority */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 ml-1">
                  Priority
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRIORITY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPriority(option.value)}
                      className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all border-2 ${priority === option.value
                          ? option.color + ' scale-105 shadow-md'
                          : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:scale-105'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <Input
                label="Due Date"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />

              {/* Tags */}
              <Input
                label="Tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="work, personal, urgent (comma-separated)"
              />

              {/* Recurring Task */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    🔄 Make this a recurring task
                  </span>
                </label>

                {isRecurring && (
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {RECURRING_PRESETS.map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => setRrule(preset.value)}
                          className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all border ${rrule === preset.value
                              ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                              : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                            }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={rrule}
                      onChange={(e) => setRrule(e.target.value)}
                      placeholder="Or enter custom rrule"
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl text-sm transition-all duration-300 outline-none focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 dark:text-white font-mono"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button
              type="button"
              variant="bordered"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="rounded-xl px-8">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

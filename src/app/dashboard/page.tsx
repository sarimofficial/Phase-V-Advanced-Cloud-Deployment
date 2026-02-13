'use client'

import { useState, useEffect } from 'react'
import TaskList from '@/components/tasks/TaskList'
import TaskForm from '@/components/tasks/TaskForm'

export default function DashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleTaskAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  // Listen for task updates from AI Chatbot
  useEffect(() => {
    const handleTasksRefreshed = () => {
      setRefreshTrigger(prev => prev + 1);
    };
    window.addEventListener('tasks-updated', handleTasksRefreshed);
    return () => window.removeEventListener('tasks-updated', handleTasksRefreshed);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
          My <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Tasks</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your daily workflow with AI assistance</p>
      </div>

      <TaskForm onTaskAdded={handleTaskAdded} />

      <TaskList refreshTrigger={refreshTrigger} />
    </div>
  )
}

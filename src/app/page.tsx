'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function HomePage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && session?.user) {
      router.push('/dashboard')
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/20 dark:border-gray-800/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
              T
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              TodoAI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
            <Link href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</Link>
            <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How it works</Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="text-sm">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 text-sm shadow-md shadow-indigo-500/20">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto relative">
          {/* Background Blobs */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

          <div className="text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-8 border border-indigo-100 dark:border-indigo-800/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Meet your AI Second Brain
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
              Organize your life with <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                AI Powered
              </span> Todos
            </h1>

            <p className="text-md text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The only task manager that understands you. Ask the AI Assistant to manage your list, set reminders, and boost your productivity with natural language github.com/sarimofficial.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-10 py-6 text-lg font-bold shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-1">
                  Start for Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="bordered" className="w-full sm:w-auto rounded-2xl px-10 py-6 text-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Dashboard Preview / Image Placeholder */}
          <div className="mt-20 relative px-4">
            <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20 border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-4">
              <div className="aspect-[16/9] w-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center overflow-hidden">
                <div className="flex flex-col items-center">
                  <p className="text-indigo-500 font-bold text-2xl mb-2">Modern AI Dashboard</p>
                  <p className="text-gray-500 text-lg">Your tasks and AI Assistant in one place</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50/50 dark:bg-slate-900/40 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Powerful Features for <span className="text-indigo-600">Power Users</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              From basic task tracking to AI-driven workflow automation, we have everything you need to stay on top of your game.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Intermediate Features */}
            <div className="group p-8 rounded-[2.5rem] bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-8 group-hover:rotate-12 transition-transform">
                🏷️
              </div>
              <h3 className="text-2xl font-bold mb-4 dark:text-white">Smart Organization</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Master your list with <strong>Priorities</strong> and <strong>Custom Tags</strong>. Categorize work, personal, and urgent tasks with ease.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">PRIORITY</span>
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full">TAGS</span>
              </div>
            </div>

            <div className="group p-8 rounded-[2.5rem] bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-8 group-hover:rotate-12 transition-transform">
                🔍
              </div>
              <h3 className="text-2xl font-bold mb-4 dark:text-white">Powerful Management</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Find exactly what you need. Advanced <strong>Search, Filter, and Sort</strong> options let you slice and dice your tasks any way you like.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-full">FILTER</span>
                <span className="px-3 py-1 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs font-bold rounded-full">SORT</span>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="group p-8 rounded-[2.5rem] bg-indigo-600 shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-500 hover:-translate-y-2 lg:scale-105">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-3xl mb-8 group-hover:rotate-12 transition-transform">
                🔄
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Recurring Tasks</h3>
              <p className="text-indigo-100 leading-relaxed mb-6">
                Build habits that stick. Set up <strong>Daily, Weekly, or Monthly</strong> tasks and let the system handle the rest automatically.
              </p>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                <p className="text-white text-sm font-bold italic">"AI, make this meeting recur every Tuesday at 3 PM"</p>
              </div>
            </div>

            <div className="group p-8 rounded-[2.5rem] bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-white text-3xl mb-8 group-hover:rotate-12 transition-transform">
                ⏰
              </div>
              <h3 className="text-2xl font-bold mb-4 dark:text-white">Dates & Reminders</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Never miss a beat. Automated <strong>Reminders</strong> and <strong>Due Date</strong> notifications keep you proactive and on schedule.
              </p>
              <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                <span className="animate-pulse">●</span> LIVE NOTIFICATIONS
              </div>
            </div>

            <div className="group p-8 rounded-[2.5rem] bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-8 group-hover:rotate-12 transition-transform">
                🤖
              </div>
              <h3 className="text-2xl font-bold mb-4 dark:text-white">AI Assistant</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                The core of TodoAI. Ask the <strong>AI Assistant</strong> to create, update, or summarize your tasks using natural language.
              </p>
              <span className="text-emerald-500 font-bold text-sm uppercase tracking-widest">Powered by GPT-4</span>
            </div>

            <div className="group p-8 rounded-[2.5rem] bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-black rounded-2xl flex items-center justify-center text-white text-3xl mb-8 group-hover:rotate-12 transition-transform">
                📱
              </div>
              <h3 className="text-2xl font-bold mb-4 dark:text-white">Cross Platform</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Your tasks, everywhere. Synchronized in real-time across your dashboard, mobile, and browser with zero lag.
              </p>
              <div className="flex gap-4 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                <span>🍎</span> <span>🤖</span> <span>🌐</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
        <p>© 2026 TodoAI. Built for productivity by <a href="https://github.com/sarimofficial">Sarimdev</a>.</p>
      </footer>
    </div>
  )
}


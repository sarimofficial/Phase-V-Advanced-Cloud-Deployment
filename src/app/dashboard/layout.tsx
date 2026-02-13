'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from '@/lib/auth-client'
import Button from '@/components/ui/Button'
import Chat from '@/components/chat/Chat'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login')
    }
  }, [session, isPending, router])

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const userName = session.user.name || session.user.email || 'User'
  const userId = session.user.id || ''

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Background Subtle Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 dark:bg-indigo-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>

      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-gray-200/20 dark:border-gray-800/20 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20 text-balance">
              T
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              TodoAI
            </span>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-tight">{userName}</span>
            </div>
            <Button variant="ghost" className="text-sm font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-28 pb-12 relative z-10">
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-[2.5rem] border border-gray-100 dark:border-slate-800/50 p-8 shadow-sm">
          {children}
        </div>
      </main>

      {/* AI Chatbot - Only render if userId exists */}
      {userId && <Chat userId={userId} />}
    </div>
  )
}

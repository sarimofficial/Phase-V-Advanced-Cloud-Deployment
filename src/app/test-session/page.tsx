// Quick test to see how Better Auth session works
'use client'

import { useSession } from '@/lib/auth-client'

export default function TestSessionPage() {
  const { data: session, isPending } = useSession()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Test</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <p><strong>Status:</strong> {isPending ? 'Loading...' : session?.user ? 'Logged in' : 'Not logged in'}</p>
        </div>
        <div>
          <p><strong>User ID:</strong> {session?.user?.id || 'N/A'}</p>
        </div>
        <div>
          <p><strong>Email:</strong> {session?.user?.email || 'N/A'}</p>
        </div>
        <div>
          <p><strong>Name:</strong> {session?.user?.name || 'N/A'}</p>
        </div>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
      <div className="mt-6">
        <a href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </a>
      </div>
    </div>
  )
}

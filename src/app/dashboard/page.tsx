'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login') // 🚫 Not logged in — redirect
      } else {
        setUser(user)
      }
      setLoading(false)
    }

    checkUser()

    // 👂 Listen for auth changes (e.g. logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/login')
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard</h1>
      {user && <p className="mb-6">Signed in as: {user.email}</p>}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Log Out
      </button>
    </div>
  )
}

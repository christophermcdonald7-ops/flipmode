'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push('/login') // redirect to login if not signed in
      } else {
        setUser(data.user)
      }
    }

    getUser()
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to your Dashboard</h1>
      {user && (
        <p className="text-gray-700 mb-6">Signed in as: {user.email}</p>
      )}
      <button
        onClick={async () => {
          await supabase.auth.signOut()
          router.push('/login')
        }}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Log Out
      </button>
    </div>
  )
}

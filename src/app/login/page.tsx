'use client'
// Updated redirect fix

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/dashboard`
        : process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
        : 'https://flipmodepro.vercel.app/dashboard'

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    })

    if (error) setMessage(error.message)
    else setMessage('✅ Magic link sent! Check your inbox.')
  }

  supabase.auth.onAuthStateChange(async (event) => {
    if (event === 'SIGNED_IN') {
      router.push('/dashboard')
    }
  })

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Sign in to FlipMode</h1>

      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 p-2 w-full rounded mb-3"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 w-full rounded hover:bg-blue-700"
        >
          Send Magic Link
        </button>
      </form>

      {message && <p className="mt-4 text-gray-700">{message}</p>}

      <a href="/" className="mt-8 text-blue-600 hover:underline text-sm">
        ← Back to Home
      </a>
    </div>
  )
}

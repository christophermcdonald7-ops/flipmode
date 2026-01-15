'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setMessage(error.message)
    else setMessage('✅ Magic link sent! Check your inbox.')
  }

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

      <a
        href="/"
        className="mt-8 text-blue-600 hover:underline text-sm"
      >
        ← Back to Home
      </a>
    </div>
  )
}

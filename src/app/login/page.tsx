'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      let error
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password })
        error = signUpError
        if (!error) setMessage('✅ Account created! Please check your email to confirm.')
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        error = signInError
        if (!error) {
          setMessage('✅ Signed in successfully!')
          router.push('/dashboard')
        }
      }
      if (error) setMessage(`❌ ${error.message}`)
    } catch (err) {
      console.error(err)
      setMessage('Unexpected error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_SITE_URL
            ? `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
            : 'http://localhost:3000/dashboard',
      },
    })
    setIsLoading(false)
    if (error) setMessage(`❌ ${error.message}`)
    else setMessage('✅ Magic link sent! Check your inbox.')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Sign in to FlipMode</h1>

      <form
        onSubmit={handleAuth}
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

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 p-2 w-full rounded mb-3"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white py-2 px-4 w-full rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSignUp ? 'Create Account' : 'Log In'}
        </button>

        <button
          type="button"
          onClick={handleMagicLink}
          disabled={isLoading}
          className="mt-3 bg-gray-200 text-gray-800 py-2 px-4 w-full rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Send Magic Link
        </button>

        <p className="mt-4 text-sm text-center">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:underline"
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </form>

      {message && <p className="mt-4 text-gray-700">{message}</p>}

      <a href="/" className="mt-8 text-blue-600 hover:underline text-sm">
        ← Back to Home
      </a>
    </div>
  )
}

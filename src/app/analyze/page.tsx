'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AnalyzePage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [vehicleData, setVehicleData] = useState<any>(null)
  const router = useRouter()

  // Check for auth
  const checkSession = async () => {
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      router.push('/login')
    }
  }

  // Load session on mount
  useEffect(() => {
    checkSession()
  }, [])

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setVehicleData(null)
    setLoading(true)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) throw new Error('Failed to analyze link')

      const data = await response.json()
      setVehicleData(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">
          🔍 Analyze Vehicle Listing
        </h1>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste the car listing URL (e.g. Craigslist, Cars.com, Facebook)"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze Listing'}
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-center mt-4 text-sm">{error}</p>
        )}

        {vehicleData && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-3">
              Extracted Vehicle Data
            </h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Make:</strong> {vehicleData.make || 'N/A'}</p>
              <p><strong>Model:</strong> {vehicleData.model || 'N/A'}</p>
              <p><strong>Year:</strong> {vehicleData.year || 'N/A'}</p>
              <p><strong>Price:</strong> {vehicleData.price || 'N/A'}</p>
              <p><strong>City, State:</strong> {vehicleData.city || 'N/A'}</p>
              <p><strong>Mileage:</strong> {vehicleData.mileage || 'N/A'}</p>
              <p><strong>VIN:</strong> {vehicleData.vin || 'N/A'}</p>
              <p><strong>Description:</strong> {vehicleData.description || 'N/A'}</p>
            </div>
          </div>
        )}

        {/* Back to Dashboard Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Unlock() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleUnlock() {
    setError('')
    if (pin.length !== 4) { setError('Please enter your 4-digit PIN.'); return }

    setLoading(true)
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('pin', pin)
      .single()

    if (error || !data) {
      setError('Incorrect PIN. Please try again.')
      setPin('')
      setLoading(false)
      return
    }

    localStorage.setItem('ga_key', data.api_key)
    router.push('/assistant')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md text-center">
        <h1 className="font-['Pinyon_Script'] text-5xl text-purple-700 mb-1">ZD's PGA</h1>
        <p className="text-gray-400 text-sm mb-8">Welcome back! Enter your PIN to continue.</p>

        <input
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value.slice(0, 4))}
          placeholder="••••"
          maxLength={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-3xl tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 mb-4"
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleUnlock}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Unlock →'}
        </button>

        <button
          onClick={() => router.push('/setup')}
          className="mt-4 text-sm text-purple-400 underline"
        >
          Reset & set up again
        </button>
      </div>
    </main>
  )
}
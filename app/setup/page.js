'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Setup() {
  const router = useRouter()
  const [apiKey, setApiKey] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSetup() {
    setError('')
    if (!apiKey.startsWith('sk-ant-')) { setError('Please enter a valid Anthropic API key.'); return }
    if (pin.length !== 4 || isNaN(pin)) { setError('PIN must be exactly 4 digits.'); return }

    setLoading(true)
    const { error } = await supabase.from('user_settings').insert({ pin, api_key: apiKey })
    if (error) { setError('Something went wrong: ' + error.message); setLoading(false); return }

    localStorage.setItem('ga_setup', 'true')
    router.push('/unlock')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="font-['Pinyon_Script'] text-5xl text-purple-700 text-center mb-1">ZD's PGA</h1>
        <p className="text-center text-gray-400 text-sm mb-8">Let's get you set up — only once!</p>

        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block">Anthropic API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
          />
          <p className="text-xs text-gray-400 mt-1">🔒 Stored securely in your database.</p>
        </div>

        <div className="mb-6">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block">Create a 4-digit PIN</label>
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value.slice(0, 4))}
            placeholder="••••"
            maxLength={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 text-center text-2xl tracking-widest"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSetup}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save & Continue →'}
        </button>
      </div>
    </main>
  )
}
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Assistant() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [tone, setTone] = useState('professional')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('ga_key')) router.push('/unlock')
  }, [])

  async function fixGrammar() {
    setError('')
    setResult('')
    if (!input.trim()) { setError('Please paste some text first.'); return }

    setLoading(true)
    const apiKey = localStorage.getItem('ga_key')

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Fix the grammar, spelling, and clarity of the following text. Make it ${tone} in tone. Return ONLY the corrected text — no explanations, no preamble, no quotes.\n\nText:\n${input}`
          }]
        })
      })

      const data = await response.json()
      if (data.error) { setError('API error: ' + data.error.message); }
      else { setResult(data.content[0].text.trim()) }
    } catch (err) {
      setError('Something went wrong: ' + err.message)
    }

    setLoading(false)
  }

  function copyText() {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function clearAll() {
    setInput('')
    setResult('')
    setError('')
  }

  function lockApp() {
    localStorage.removeItem('ga_key')
    router.push('/unlock')
  }

  const tones = [
    { key: 'professional', label: '💼 Professional' },
    { key: 'formal', label: '🎩 Formal' },
    { key: 'friendly', label: '😊 Friendly' },
    { key: 'concise', label: '⚡ Concise' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-['Pinyon_Script'] text-5xl text-purple-700">ZD's PGA</h1>
            <p className="text-gray-400 text-sm">Fix your message before you send it</p>
          </div>
          <button onClick={lockApp} className="text-sm text-gray-400 border border-gray-200 rounded-xl px-4 py-2 hover:border-purple-400 hover:text-purple-500 transition">
            🔒 Lock
          </button>
        </div>

        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block">Your Message</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste your text here... e.g. i wanted to informed you that the meeting have been reschedule to tomorrow"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 resize-none h-40"
          />
          <p className="text-xs text-gray-300 text-right mt-1">{input.length} characters</p>
        </div>

        <div className="mb-6">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block">Tone</label>
          <div className="flex gap-2 flex-wrap">
            {tones.map(t => (
              <button
                key={t.key}
                onClick={() => setTone(t.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${tone === t.key ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-purple-400 hover:text-purple-500'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={fixGrammar}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 mb-6"
        >
          {loading ? 'Fixing your grammar...' : '✨ Fix my grammar'}
        </button>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-3">✅ Corrected version</p>
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap mb-4">{result}</p>
            <div className="flex gap-3">
              <button onClick={copyText} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:border-purple-400 hover:text-purple-500 transition">
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
              <button onClick={clearAll} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:border-purple-400 hover:text-purple-500 transition">
                🔄 Start over
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
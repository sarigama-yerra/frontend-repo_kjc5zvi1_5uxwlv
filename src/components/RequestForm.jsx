import React, { useState } from 'react'
import { motion } from 'framer-motion'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function RequestForm({ onSubmitted }) {
  const [prompt, setPrompt] = useState('A neon-lit city street at night, rain reflections, cinematic camera dolly, a cat with glowing eyes walks across the frame')
  const [model, setModel] = useState('veo3')
  const [duration, setDuration] = useState(5)
  const [aspect, setAspect] = useState('16:9')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model, duration_seconds: Number(duration), aspect_ratio: aspect })
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      onSubmitted?.(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form onSubmit={submit} className="w-full bg-white/5 border border-white/10 backdrop-blur rounded-xl p-6 space-y-4" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div>
        <label className="block text-sm text-gray-200 mb-2">Prompt</label>
        <textarea className="w-full rounded-lg bg-black/40 border border-white/10 p-3 text-white" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-200 mb-2">Model</label>
          <select className="w-full rounded-lg bg-black/40 border border-white/10 p-3 text-white" value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="veo3">Veo3</option>
            <option value="sora2">Sora2</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-200 mb-2">Duration (s)</label>
          <input type="number" min={1} max={60} className="w-full rounded-lg bg-black/40 border border-white/10 p-3 text-white" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-200 mb-2">Aspect</label>
          <select className="w-full rounded-lg bg-black/40 border border-white/10 p-3 text-white" value={aspect} onChange={(e) => setAspect(e.target.value)}>
            <option>16:9</option>
            <option>9:16</option>
            <option>1:1</option>
          </select>
        </div>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex items-center gap-3">
        <button disabled={loading} className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white font-semibold px-5 py-2.5 transition disabled:opacity-60">
          {loading ? 'Queuing…' : 'Generate' }
        </button>
        <p className="text-gray-300 text-sm">We queue your request and update the status once processed.</p>
      </div>
    </motion.form>
  )
}

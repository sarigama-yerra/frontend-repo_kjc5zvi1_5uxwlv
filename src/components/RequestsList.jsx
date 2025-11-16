import React, { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function RequestsList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/requests`)
      if (!res.ok) throw new Error('Failed to load requests')
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Recent Requests</h3>
        <button onClick={load} className="text-sm text-violet-300 hover:text-violet-200">Refresh</button>
      </div>
      {loading && <p className="text-gray-300">Loading…</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && items.length === 0 && <p className="text-gray-400">No requests yet.</p>}
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it._id} className="p-3 rounded-lg bg-black/40 border border-white/10 text-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-gray-400">{it.model}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-white/10">{it.status}</span>
            </div>
            <p className="mt-2 text-sm line-clamp-3">{it.prompt}</p>
            {it.generated_url && (
              <a className="text-sm text-cyan-300 hover:underline" href={it.generated_url} target="_blank" rel="noreferrer">View video</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

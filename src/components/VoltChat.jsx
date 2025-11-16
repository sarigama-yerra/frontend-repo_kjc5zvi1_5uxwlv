import React, { useEffect, useMemo, useRef, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function VoltChat() {
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Create a new conversation on mount
        const res = await fetch(`${API_BASE}/api/chat/conversations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Volt Chat' })
        })
        const data = await res.json()
        setConversation(data)
        // Load initial messages (should include greeting)
        const res2 = await fetch(`${API_BASE}/api/chat/conversations/${data.conversation_id}/messages`)
        const data2 = await res2.json()
        setMessages(data2.items || [])
      } catch (e) {
        console.error('Failed to init chat', e)
      }
    }
    bootstrap()
  }, [])

  const send = async (e) => {
    e.preventDefault()
    if (!conversation || !input.trim()) return
    const userMsg = { _id: `tmp-${Date.now()}`, role: 'user', content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      await fetch(`${API_BASE}/api/chat/conversations/${conversation.conversation_id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userMsg.content })
      })
      // Poll once after a short delay to retrieve the assistant reply
      setTimeout(async () => {
        const res = await fetch(`${API_BASE}/api/chat/conversations/${conversation.conversation_id}/messages`)
        const data = await res.json()
        setMessages(data.items || [])
        setLoading(false)
        // Auto-scroll to bottom
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
      }, 900)
    } catch (e) {
      console.error('send failed', e)
      setLoading(false)
    }
  }

  return (
    <section className="mt-10 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-white font-semibold">⚡ Volt — Open Source AI Chat</h3>
        <span className="text-xs text-gray-400">online</span>
      </div>
      <div ref={listRef} className="h-72 overflow-y-auto p-6 space-y-3">
        {messages.map((m) => (
          <div key={m._id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block max-w-[80%] px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-violet-600 text-white' : 'bg-black/40 text-gray-100 border border-white/10'}`}>
              <p className="whitespace-pre-wrap text-sm">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left">
            <div className="inline-block px-3 py-2 rounded-lg bg-black/40 text-gray-300 border border-white/10 text-sm">Volt is typing…</div>
          </div>
        )}
      </div>
      <form onSubmit={send} className="p-4 border-t border-white/10 flex items-center gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Volt anything…"
          className="flex-1 rounded-lg bg-black/40 border border-white/10 p-3 text-white"
        />
        <button className="rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-4 py-2 font-medium disabled:opacity-60" disabled={!input.trim()}>
          Send
        </button>
      </form>
    </section>
  )
}

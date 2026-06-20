import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const WORKER_URL = import.meta.env.VITE_WORKER_URL || 'http://localhost:8787'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy el asistente de Telekoquitoman. Pregúntame sobre Sergio, su canal de YouTube, sus redes sociales o su contenido.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)
    try {
      const res = await fetch(`${WORKER_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json() as { reply: string }
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error de conexión. Inténtalo más tarde.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, hsl(205 90% 55%), hsl(190 80% 48%))',
          boxShadow: '0 4px 20px hsl(205 90% 55% / 0.4)',
        }}
        aria-label="Abrir chatbot"
      >
        <span className="text-xl">{open ? '✕' : '🤖'}</span>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-sm overflow-hidden"
            style={{
              height: '460px',
              background: 'rgba(255,255,255,0.98)',
              border: '1px solid hsl(var(--border))',
              boxShadow: '0 8px 40px hsl(205 60% 60% / 0.18)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center gap-3 shrink-0"
              style={{ borderBottom: '1px solid hsl(var(--border))', background: 'hsl(var(--secondary) / 0.5)' }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ background: 'hsl(var(--primary) / 0.12)', border: '1px solid hsl(var(--primary) / 0.3)' }}>
                🤖
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Asistente TKM</p>
                <p className="text-xs text-slate-500">Pregúntame sobre Sergio</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-slate-400">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[85%] px-3 py-2 rounded-sm text-sm leading-relaxed"
                    style={
                      msg.role === 'user'
                        ? { background: 'linear-gradient(135deg, hsl(205 90% 55% / 0.14), hsl(190 80% 48% / 0.14))', border: '1px solid hsl(var(--primary) / 0.25)', color: 'hsl(215 35% 22%)' }
                        : { background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))', color: 'hsl(215 20% 35%)' }
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div
                    className="px-4 py-3 rounded-sm"
                    style={{ background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}
                  >
                    <span className="flex gap-1">
                      {[0, 0.15, 0.3].map(d => (
                        <span
                          key={d}
                          className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] animate-bounce"
                          style={{ animationDelay: `${d}s` }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="p-3 flex gap-2 shrink-0"
              style={{ borderTop: '1px solid hsl(var(--border))' }}
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Escribe tu pregunta..."
                className="flex-1 bg-white text-sm text-slate-800 placeholder-slate-400 outline-none px-3 py-2 rounded-sm"
                style={{ border: '1px solid hsl(var(--border))' }}
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="px-3 py-2 rounded-sm text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, hsl(205 90% 55%), hsl(190 80% 48%))',
                  color: '#ffffff',
                  minWidth: '40px',
                }}
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

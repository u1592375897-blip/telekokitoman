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
          background: 'linear-gradient(135deg, #00f5ff, #bf00ff)',
          boxShadow: '0 0 20px rgba(0,245,255,0.4)',
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
              background: 'rgba(10,10,20,0.95)',
              border: '1px solid rgba(0,245,255,0.2)',
              boxShadow: '0 0 40px rgba(0,245,255,0.1)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center gap-3 shrink-0"
              style={{ borderBottom: '1px solid rgba(0,245,255,0.1)', background: 'rgba(0,245,255,0.03)' }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ background: 'linear-gradient(135deg, #00f5ff22, #bf00ff22)', border: '1px solid rgba(0,245,255,0.3)' }}>
                🤖
              </div>
              <div>
                <p className="text-sm font-bold text-white">Asistente TKM</p>
                <p className="text-xs text-gray-500">Pregúntame sobre Sergio</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs text-gray-600">Online</span>
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
                        ? { background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(191,0,255,0.15))', border: '1px solid rgba(0,245,255,0.2)', color: '#e0e0e0' }
                        : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#b0b0b0' }
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
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="flex gap-1">
                      {[0, 0.15, 0.3].map(d => (
                        <span
                          key={d}
                          className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"
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
              style={{ borderTop: '1px solid rgba(0,245,255,0.1)' }}
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Escribe tu pregunta..."
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none px-3 py-2 rounded-sm"
                style={{ border: '1px solid rgba(0,245,255,0.15)', background: 'rgba(0,245,255,0.03)' }}
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="px-3 py-2 rounded-sm text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #00f5ff, #bf00ff)',
                  color: '#0a0a0f',
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

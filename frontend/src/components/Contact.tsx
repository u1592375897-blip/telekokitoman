import { useState } from 'react'
import { motion } from 'framer-motion'

const WORKER_URL = import.meta.env.VITE_WORKER_URL || 'http://localhost:8787'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(`${WORKER_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('ok')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-24 px-4 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, hsl(var(--primary) / 0.04) 0%, transparent 60%)' }}
      />
      <div className="max-w-xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest uppercase mb-3 neon-text-cyan"
          >
            Contacto
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-black text-3xl sm:text-4xl text-slate-800"
          >
            Escríbeme
          </motion.h2>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={submit}
          className="glass-panel rounded-sm p-6 space-y-4"
        >
          {[
            { key: 'name', label: 'Nombre', type: 'text', placeholder: 'Tu nombre' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'tu@email.com' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">{f.label}</label>
              <input
                type={f.type}
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                required
                className="w-full bg-white text-sm text-slate-800 placeholder-slate-400 outline-none px-4 py-3 rounded-sm transition-colors"
                style={{ border: '1px solid hsl(var(--border))' }}
                onFocus={e => (e.target.style.borderColor = 'hsl(var(--primary) / 0.5)')}
                onBlur={e => (e.target.style.borderColor = 'hsl(var(--border))')}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Mensaje</label>
            <textarea
              value={form.message}
              onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Tu mensaje..."
              required
              rows={4}
              className="w-full bg-white text-sm text-slate-800 placeholder-slate-400 outline-none px-4 py-3 rounded-sm resize-none transition-colors"
              style={{ border: '1px solid hsl(var(--border))' }}
              onFocus={e => (e.target.style.borderColor = 'hsl(var(--primary) / 0.5)')}
              onBlur={e => (e.target.style.borderColor = 'hsl(var(--border))')}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full btn-cyber-solid rounded-sm font-display uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
          </button>

          {status === 'ok' && (
            <p className="text-center text-sm text-green-600">✓ Mensaje enviado correctamente</p>
          )}
          {status === 'error' && (
            <p className="text-center text-sm text-red-500">Error al enviar. Inténtalo más tarde.</p>
          )}
        </motion.form>
      </div>
    </section>
  )
}

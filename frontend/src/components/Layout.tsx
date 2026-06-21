import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { playClickSound, setSoundMuted } from '../lib/sounds'
import Footer from './Footer'

const navLinks = [
  { label: 'Inicio',    path: '/' },
  { label: 'Videos',    path: '/videos' },
  { label: 'Coleccion', path: '/coleccion' },
  { label: 'Sobre mi',  path: '/sobre-mi' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [muted, setMuted] = useState(false)

  const click = () => playClickSound()
  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    setSoundMuted(next)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

          <Link to="/" onClick={click} className="font-display font-black text-lg tracking-wider">
            <span className="neon-text-cyan">TELEKO</span>
            <span className="text-slate-800">QUITOMAN</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(l => (
              <Link key={l.path} to={l.path} onClick={click}
                className={`text-xs font-semibold uppercase tracking-widest transition-colors duration-200 ${
                  location.pathname === l.path ? 'text-[hsl(var(--primary))]' : 'text-slate-500 hover:text-slate-800'
                }`}>
                {l.label}
              </Link>
            ))}
            <button onClick={toggleMute}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors text-sm border border-border bg-secondary/50"
              title={muted ? 'Activar sonido' : 'Silenciar'}>
              {muted ? '🔇' : '🔊'}
            </button>
          </div>

          {/* Mobile burger */}
          <button className="md:hidden text-slate-600" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <div className="w-6 h-0.5 bg-current mb-1.5 transition-all" style={{ transform: menuOpen ? 'rotate(45deg) translate(2px,8px)' : '' }} />
            <div className="w-6 h-0.5 bg-current mb-1.5 transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
            <div className="w-6 h-0.5 bg-current transition-all"         style={{ transform: menuOpen ? 'rotate(-45deg) translate(2px,-8px)' : '' }} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-border px-4 py-4 space-y-3">
            {navLinks.map(l => (
              <Link key={l.path} to={l.path} onClick={() => setMenuOpen(false)}
                className={`block text-xs font-semibold uppercase tracking-widest py-1 ${
                  location.pathname === l.path ? 'text-[hsl(var(--primary))]' : 'text-slate-500'
                }`}>
                {l.label}
              </Link>
            ))}
            <button onClick={toggleMute} className="flex items-center gap-2 text-xs text-slate-500 py-1">
              {muted ? '🔇 Sonido desactivado' : '🔊 Sonido activado'}
            </button>
          </div>
        )}
      </nav>

      {/* Content */}
      <main
        key={location.pathname}
        className="flex-1 pt-16"
        style={{ animation: 'content-slide-in 0.35s cubic-bezier(0.16,1,0.3,1) forwards' }}
      >
        {children}
      </main>

      <Footer />
    </div>
  )
}

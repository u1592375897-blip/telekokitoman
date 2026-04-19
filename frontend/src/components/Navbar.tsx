import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../lib/theme'

const links = [
  { label: 'Inicio',    to: '/' },
  { label: 'Videos',   to: '/videos' },
  { label: 'Colección', to: '/coleccion' },
  { label: 'Sobre mí', to: '/sobre-mi' },
  { label: 'Contacto', to: '/contacto' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { mode, toggleMode } = useTheme()
  const location = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-cyan-500/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="font-display font-black text-lg tracking-wider">
          <span className="neon-text-cyan">TELEKO</span>
          <span className="text-white">QUITOMAN</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === l.to ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={toggleMode}
            className="w-9 h-9 rounded-sm flex items-center justify-center transition-all duration-200 text-gray-400 hover:text-white"
            style={{ border: '1px solid rgba(0,245,255,0.2)', background: 'rgba(0,245,255,0.04)' }}
            aria-label="Cambiar modo"
            title={mode === 'dark' ? 'Modo día' : 'Modo noche'}
          >
            {mode === 'dark' ? '☀️' : '🌙'}
          </button>
          <a
            href="https://www.youtube.com/@Teleko360"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyber text-sm rounded-sm"
          >
            ▶ Canal YT
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <div className="w-6 h-0.5 bg-current mb-1.5 transition-all" style={{ transform: open ? 'rotate(45deg) translate(2px, 8px)' : '' }} />
          <div className="w-6 h-0.5 bg-current mb-1.5 transition-all" style={{ opacity: open ? 0 : 1 }} />
          <div className="w-6 h-0.5 bg-current transition-all" style={{ transform: open ? 'rotate(-45deg) translate(2px, -8px)' : '' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass-panel border-t border-cyan-500/10 px-4 py-4 space-y-3">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block text-sm font-medium transition-colors py-1 ${
                location.pathname === l.to ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://www.youtube.com/@Teleko360"
            target="_blank"
            rel="noopener noreferrer"
            className="block btn-cyber text-sm text-center rounded-sm mt-2"
          >
            ▶ Canal YouTube
          </a>
        </div>
      )}
    </nav>
  )
}

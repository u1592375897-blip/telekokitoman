import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme, themeNames, themeEmojis, type Theme } from '../lib/theme'

const links = [
  { label: 'Inicio',    to: '/' },
  { label: 'Videos',   to: '/videos' },
  { label: 'Coleccion', to: '/coleccion' },
  { label: 'Sobre mi', to: '/sobre-mi' },
  { label: 'Contacto', to: '/contacto' },
]

const themes = Object.keys(themeNames) as Theme[]

export default function Navbar() {
  const [menuOpen, setMenuOpen]   = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const { theme, setTheme, darkMode, setDarkMode, mode } = useTheme()
  const location = useLocation()

  const darkOnly = new Set<Theme>(['cyborg', 'ps2', 'aurora', 'xvlk'])
  const canToggleDark = !darkOnly.has(theme)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b"
         style={{ borderColor: 'var(--border-cyber)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="font-display font-black text-lg tracking-wider">
          <span className="neon-text-cyan">TELEKO</span>
          <span className="text-white">QUITOMAN</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === l.to
                  ? 'neon-text-cyan'
                  : 'text-gray-400 hover:text-white'
              }`}>
              {l.label}
            </Link>
          ))}

          {/* Dark/light toggle — only when theme allows it */}
          {canToggleDark && (
            <button onClick={() => setDarkMode(!darkMode)}
              className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              style={{ border: '1px solid var(--border-cyber)', background: 'hsl(var(--primary)/.04)' }}
              title={mode === 'dark' ? 'Modo dia' : 'Modo noche'}>
              {mode === 'dark' ? '☀️' : '🌙'}
            </button>
          )}

          {/* Theme picker */}
          <div className="relative">
            <button onClick={() => setThemeOpen(o => !o)}
              className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white transition-colors text-base"
              style={{ border: '1px solid var(--border-cyber)', background: 'hsl(var(--primary)/.04)' }}
              title="Cambiar tema">
              {themeEmojis[theme]}
            </button>
            {themeOpen && (
              <div className="absolute right-0 top-10 glass-panel rounded-lg p-2 min-w-[160px] shadow-xl"
                   style={{ border: '1px solid var(--border-cyber)' }}>
                {themes.map(t => (
                  <button key={t} onClick={() => { setTheme(t); setThemeOpen(false) }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors text-left ${
                      theme === t ? 'neon-text-cyan font-bold' : 'text-gray-400 hover:text-white'
                    }`}>
                    <span>{themeEmojis[t]}</span>
                    <span>{themeNames[t]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <a href="https://www.youtube.com/@Teleko360" target="_blank" rel="noopener noreferrer"
            className="btn-cyber text-sm rounded">
            ▶ Canal YT
          </a>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <div className="w-6 h-0.5 bg-current mb-1.5 transition-all" style={{ transform: menuOpen ? 'rotate(45deg) translate(2px,8px)' : '' }} />
          <div className="w-6 h-0.5 bg-current mb-1.5 transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
          <div className="w-6 h-0.5 bg-current transition-all"         style={{ transform: menuOpen ? 'rotate(-45deg) translate(2px,-8px)' : '' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-panel border-t px-4 py-4 space-y-2"
             style={{ borderColor: 'var(--border-cyber)' }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className={`block text-sm font-medium transition-colors py-1.5 ${
                location.pathname === l.to ? 'neon-text-cyan' : 'text-gray-400 hover:text-white'
              }`}>
              {l.label}
            </Link>
          ))}

          {/* Theme selector mobile */}
          <div className="pt-2 border-t" style={{ borderColor: 'var(--border-cyber)' }}>
            <p className="text-xs text-gray-600 mb-2 uppercase tracking-wider">Tema</p>
            <div className="flex flex-wrap gap-2">
              {themes.map(t => (
                <button key={t} onClick={() => { setTheme(t); setMenuOpen(false) }}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                    theme === t ? 'neon-text-cyan font-bold' : 'text-gray-400'
                  }`}
                  style={{ border: '1px solid var(--border-cyber)' }}>
                  {themeEmojis[t]} {themeNames[t]}
                </button>
              ))}
            </div>
          </div>

          {canToggleDark && (
            <button onClick={() => { setDarkMode(!darkMode); setMenuOpen(false) }}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white py-1">
              {mode === 'dark' ? '☀️ Modo dia' : '🌙 Modo noche'}
            </button>
          )}

          <a href="https://www.youtube.com/@Teleko360" target="_blank" rel="noopener noreferrer"
            className="block btn-cyber text-sm text-center rounded mt-2">
            ▶ Canal YouTube
          </a>
        </div>
      )}
    </nav>
  )
}

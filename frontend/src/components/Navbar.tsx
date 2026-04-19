import { useState } from 'react'

const links = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Videos', href: '#videos' },
  { label: 'Sobre mí', href: '#about' },
  { label: 'Redes', href: '#redes' },
  { label: 'Contacto', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-cyan-500/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <a href="#hero" className="font-display font-black text-lg tracking-wider">
          <span className="neon-text-cyan">TELEKO</span>
          <span className="text-white">QUITOMAN</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-400 hover:text-cyber-cyan transition-colors duration-200"
              style={{ '--tw-text-opacity': '1' } as React.CSSProperties}
            >
              {l.label}
            </a>
          ))}
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
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-gray-400 hover:text-white transition-colors py-1"
            >
              {l.label}
            </a>
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

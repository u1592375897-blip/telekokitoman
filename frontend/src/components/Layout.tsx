import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme, themeNames, themeEmojis, type Theme } from '../lib/theme'
import { playClickSound, setGlobalVolume } from '../lib/sounds'
import { Palette, Moon, Sun, Volume2, Maximize2, Minimize2 } from 'lucide-react'

const navLinks = [
  { label: 'Inicio',    path: '/' },
  { label: 'Videos',   path: '/videos' },
  { label: 'Coleccion', path: '/coleccion' },
  { label: 'Sobre mi', path: '/sobre-mi' },
  { label: 'Contacto', path: '/contacto' },
]

const themes = Object.keys(themeNames) as Theme[]

const bgByTheme: Record<Theme, { light: string; dark: string }> = {
  aero:     { light: 'linear-gradient(180deg,hsl(199 90% 75%)0%,hsl(199 80% 85%)50%,hsl(160 50% 88%)100%)', dark: 'linear-gradient(180deg,hsl(210 40% 12%)0%,hsl(210 30% 8%)100%)' },
  minimal:  { light: 'linear-gradient(180deg,hsl(0 0% 92%)0%,hsl(0 0% 96%)100%)',                          dark: 'linear-gradient(180deg,hsl(0 0% 6%)0%,hsl(0 0% 10%)100%)' },
  apple2001:{ light: 'linear-gradient(180deg,hsl(0 0% 82%)0%,hsl(0 0% 88%)100%)',                          dark: 'linear-gradient(180deg,hsl(0 0% 82%)0%,hsl(0 0% 88%)100%)' },
  ps2:      { light: 'linear-gradient(180deg,hsl(230 40% 6%)0%,hsl(230 30% 10%)100%)',                     dark: 'linear-gradient(180deg,hsl(230 40% 6%)0%,hsl(230 30% 10%)100%)' },
  aurora:   { light: 'linear-gradient(180deg,hsl(150 30% 6%)0%,hsl(150 20% 10%)100%)',                     dark: 'linear-gradient(180deg,hsl(150 30% 6%)0%,hsl(150 20% 10%)100%)' },
  cyborg:   { light: 'linear-gradient(180deg,hsl(180 20% 6%)0%,hsl(180 15% 4%)100%)',                      dark: 'linear-gradient(180deg,hsl(180 20% 6%)0%,hsl(180 15% 4%)100%)' },
  xvlk:     { light: 'linear-gradient(180deg,hsl(220 25% 10%)0%,hsl(220 20% 6%)100%)',                     dark: 'linear-gradient(180deg,hsl(220 25% 10%)0%,hsl(220 20% 6%)100%)' },
}

const chromeByTheme: Record<Theme, { light: string; dark: string }> = {
  aero:     { light: 'linear-gradient(180deg,hsl(200 20% 82%),hsl(200 20% 78%))', dark: 'linear-gradient(180deg,hsl(210 20% 16%),hsl(210 20% 12%))' },
  minimal:  { light: 'linear-gradient(180deg,hsl(0 0% 90%),hsl(0 0% 87%))',       dark: 'linear-gradient(180deg,hsl(0 0% 10%),hsl(0 0% 7%))' },
  apple2001:{ light: 'linear-gradient(180deg,hsl(0 0% 88%),hsl(0 0% 78%))',       dark: 'linear-gradient(180deg,hsl(0 0% 88%),hsl(0 0% 78%))' },
  ps2:      { light: 'linear-gradient(180deg,hsl(230 30% 12%),hsl(230 30% 8%))',  dark: 'linear-gradient(180deg,hsl(230 30% 12%),hsl(230 30% 8%))' },
  aurora:   { light: 'linear-gradient(180deg,hsl(150 25% 10%),hsl(150 25% 7%))', dark: 'linear-gradient(180deg,hsl(150 25% 10%),hsl(150 25% 7%))' },
  cyborg:   { light: 'linear-gradient(180deg,hsl(180 20% 10%),hsl(180 15% 7%))', dark: 'linear-gradient(180deg,hsl(180 20% 10%),hsl(180 15% 7%))' },
  xvlk:     { light: 'linear-gradient(180deg,hsl(220 25% 14%),hsl(220 20% 10%))', dark: 'linear-gradient(180deg,hsl(220 25% 14%),hsl(220 20% 10%))' },
}

const footerByTheme: Record<Theme, { light: string; dark: string }> = {
  aero:     { light: 'linear-gradient(180deg,hsl(200 20% 85%),hsl(200 20% 80%))', dark: 'linear-gradient(180deg,hsl(210 20% 14%),hsl(210 20% 10%))' },
  minimal:  { light: 'linear-gradient(180deg,hsl(0 0% 94%),hsl(0 0% 91%))',       dark: 'linear-gradient(180deg,hsl(0 0% 8%),hsl(0 0% 5%))' },
  apple2001:{ light: 'linear-gradient(180deg,hsl(0 0% 85%),hsl(0 0% 80%))',       dark: 'linear-gradient(180deg,hsl(0 0% 85%),hsl(0 0% 80%))' },
  ps2:      { light: 'linear-gradient(180deg,hsl(230 30% 10%),hsl(230 30% 6%))',  dark: 'linear-gradient(180deg,hsl(230 30% 10%),hsl(230 30% 6%))' },
  aurora:   { light: 'linear-gradient(180deg,hsl(150 25% 8%),hsl(150 25% 5%))',   dark: 'linear-gradient(180deg,hsl(150 25% 8%),hsl(150 25% 5%))' },
  cyborg:   { light: 'linear-gradient(180deg,hsl(180 20% 8%),hsl(180 15% 5%))',   dark: 'linear-gradient(180deg,hsl(180 20% 8%),hsl(180 15% 5%))' },
  xvlk:     { light: 'linear-gradient(180deg,hsl(220 25% 10%),hsl(220 20% 7%))',  dark: 'linear-gradient(180deg,hsl(220 25% 10%),hsl(220 20% 7%))' },
}

const darkOnly = new Set<Theme>(['cyborg', 'ps2', 'aurora', 'xvlk'])

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { theme, setTheme, darkMode, setDarkMode, auroraVariant, setAuroraVariant } = useTheme()
  const [themeOpen, setThemeOpen] = useState(false)
  const [volOpen,   setVolOpen]   = useState(false)
  const [volume,    setVolume]    = useState(100)
  const [muted,     setMuted]     = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [pos,       setPos]       = useState({ x: 0, y: 0 })
  const [dragging,  setDragging]  = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const isPS2    = theme === 'ps2'
  const isAurora = theme === 'aurora'
  const isPurple = isAurora && auroraVariant === 'purple'
  const mode     = darkMode ? 'dark' : 'light'

  const activeBg     = isPurple ? { light: 'linear-gradient(180deg,hsl(280 30% 6%)0%,hsl(280 20% 10%)100%)', dark: 'linear-gradient(180deg,hsl(280 30% 6%)0%,hsl(280 20% 10%)100%)' } : bgByTheme[theme]
  const activeChrome = isPurple ? { light: 'linear-gradient(180deg,hsl(280 25% 10%),hsl(280 25% 7%))', dark: 'linear-gradient(180deg,hsl(280 25% 10%),hsl(280 25% 7%))' } : chromeByTheme[theme]
  const activeFooter = isPurple ? { light: 'linear-gradient(180deg,hsl(280 25% 8%),hsl(280 25% 5%))', dark: 'linear-gradient(180deg,hsl(280 25% 8%),hsl(280 25% 5%))' } : footerByTheme[theme]

  const closeAll = () => { setThemeOpen(false); setVolOpen(false) }

  useEffect(() => { setGlobalVolume(muted ? 0 : volume) }, [volume, muted])

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (maximized) return
    setDragging(true)
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
  }, [maximized, pos])

  useEffect(() => {
    if (!dragging) return
    const move = (e: MouseEvent) => setPos({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y })
    const up   = () => setDragging(false)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
  }, [dragging])

  const click = () => playClickSound()

  const btnCls = `glass-card flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg ${isPS2 ? '!border-blue-800/40 text-blue-300' : 'text-foreground'}`

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 gap-4"
      style={{ background: activeBg[mode] }}
      onClick={closeAll}
    >
      {/* ── Controls ── */}
      <div className="flex gap-2 flex-wrap justify-center" onClick={e => e.stopPropagation()}>

        {/* Theme picker */}
        <div className="relative">
          <button onClick={() => { closeAll(); setThemeOpen(o => !o); click() }} className={btnCls}>
            <Palette className="w-4 h-4" />
            <span>{themeEmojis[theme]}</span>
            <span>{themeNames[theme]}</span>
          </button>
          {themeOpen && (
            <div className={`absolute top-full mt-2 left-0 z-50 rounded-2xl p-2 shadow-xl min-w-[180px] border animate-fade-up ${isPS2 ? 'bg-[hsl(230_30%_12%)] border-blue-800/40' : 'glass-card border-border'}`}>
              {themes.map(t => (
                <button key={t} onClick={() => { setTheme(t); if (t !== 'aurora') setThemeOpen(false); click() }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                    t === theme ? (isPS2 ? 'text-blue-400 bg-blue-500/10' : 'text-primary bg-primary/10')
                                : (isPS2 ? 'text-blue-200 hover:bg-blue-500/5' : 'text-foreground hover:bg-secondary')
                  }`}>
                  <span>{themeEmojis[t]}</span><span>{themeNames[t]}</span>
                </button>
              ))}
              {isAurora && (
                <div className="border-t border-border mt-1 pt-1 flex gap-1">
                  {(['green','purple'] as const).map(v => (
                    <button key={v} onClick={() => { setAuroraVariant(v); setThemeOpen(false); click() }}
                      className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        auroraVariant === v
                          ? v === 'green' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'
                          : 'text-muted-foreground hover:bg-secondary'
                      }`}>
                      {v === 'green' ? '🟢 Verde' : '🟣 Morado'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dark/light */}
        <button
          onClick={() => { if (!darkOnly.has(theme)) { setDarkMode(!darkMode); click() } }}
          className={`${btnCls} ${darkOnly.has(theme) ? 'opacity-40 cursor-not-allowed hover:scale-100' : ''}`}
          title={darkOnly.has(theme) ? 'Solo modo oscuro en este tema' : undefined}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>{darkMode ? '☀️' : '🌙'}</span>
          {darkOnly.has(theme) && <span className="text-xs opacity-60">N/D</span>}
        </button>

        {/* Volume */}
        <div className="relative">
          <button onClick={() => { closeAll(); setVolOpen(o => !o); click() }} className={btnCls}>
            <Volume2 className="w-4 h-4" />
            <span>{muted ? '🔇' : `${volume}%`}</span>
          </button>
          {volOpen && (
            <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 rounded-2xl p-4 shadow-xl min-w-[200px] animate-fade-up border ${isPS2 ? 'bg-[hsl(230_30%_12%)] border-blue-800/40' : 'glass-card border-border'}`}>
              <div className="flex items-center gap-2 mb-3">
                <button onClick={() => setMuted(m => !m)} className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                  {muted ? '🔇 Silenciado' : '🔊 Con sonido'}
                </button>
              </div>
              <input type="range" min={0} max={200} value={volume}
                onChange={e => { setVolume(Number(e.target.value)); setMuted(false) }}
                className="w-full accent-primary" />
              <p className="text-xs text-center font-bold mt-1 text-muted-foreground">{volume}%</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Window ── */}
      <div
        className={`${maximized ? 'fixed inset-0 z-40 rounded-none' : 'w-full max-w-5xl rounded-2xl'} overflow-hidden border transition-all duration-300 ${isPS2 ? 'border-blue-800/30' : 'border-border'}`}
        style={{
          boxShadow: isPS2 ? '0 25px 60px -12px hsl(230 80% 20% / 0.5)' : '0 25px 60px -12px hsl(var(--border) / 0.5)',
          ...(!maximized && { transform: `translate(${pos.x}px, ${pos.y}px)` }),
        }}
      >
        {/* Chrome top bar */}
        <div
          className={`px-4 py-2.5 flex items-center gap-2 ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ background: activeChrome[mode] }}
          onMouseDown={handleDragStart}
        >
          <span className="w-3.5 h-3.5 rounded-full inline-block shadow-sm" style={{ background: 'hsl(var(--chrome-dot-red, 0 72% 55%))' }} />
          <span className="w-3.5 h-3.5 rounded-full inline-block shadow-sm cursor-pointer hover:brightness-110"
            onClick={e => { e.stopPropagation(); setMaximized(false); setPos({ x:0, y:0 }); click() }}
            style={{ background: 'hsl(var(--chrome-dot-yellow, 45 90% 55%))' }} />
          <span className="w-3.5 h-3.5 rounded-full inline-block shadow-sm cursor-pointer hover:brightness-110"
            onClick={e => { e.stopPropagation(); setMaximized(m => !m); click() }}
            style={{ background: 'hsl(var(--chrome-dot-green, 140 60% 45%))' }} />
          <div className="flex-1" />
          <button onClick={e => { e.stopPropagation(); setMaximized(m => !m); click() }}
            className="p-1 rounded hover:bg-white/10 transition-colors text-muted-foreground">
            {maximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Logo row */}
        <div className={`px-6 py-4 flex items-center gap-4 border-b ${isPS2 ? 'bg-[hsl(230_30%_10%)] border-blue-800/20' : 'bg-card border-border'}`}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md"
            style={{ background: 'radial-gradient(circle at 35% 30%, hsl(var(--primary)/.9), hsl(var(--primary)) 60%, hsl(var(--primary)/.7))', boxShadow: '0 4px 15px hsl(var(--primary)/.3)' }}>
            <span className="text-xs font-black text-black/80 tracking-widest">TKM</span>
          </div>
          <div>
            <h1 className={`text-lg font-extrabold tracking-tight font-display ${isPS2 ? 'text-white' : 'text-foreground'}`}>
              Telekoquitoman
            </h1>
            <p className={`text-xs font-medium ${isPS2 ? 'text-blue-400/60' : 'text-muted-foreground'}`}>
              Contenido en buenas condiciones
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className={`px-4 py-2 flex gap-1 border-b overflow-x-auto ${isPS2 ? 'bg-[hsl(230_30%_10%)] border-blue-800/20' : 'bg-card border-border'}`}>
          {navLinks.map(link => {
            const active = location.pathname === link.path
            return (
              <Link key={link.path} to={link.path} onClick={click}
                className={`px-4 py-1.5 text-sm font-bold transition-all relative whitespace-nowrap rounded-lg ${
                  active
                    ? (isPS2 ? 'bg-blue-500/10 text-blue-300' : 'theme-tab-active text-primary')
                    : (isPS2 ? 'text-blue-300/50 hover:bg-blue-500/5' : 'text-muted-foreground hover:bg-secondary/50')
                }`}>
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Content */}
        <div
          className={`min-h-[60vh] overflow-y-auto ${isPS2 ? 'bg-[hsl(230_30%_8%)]' : theme === 'cyborg' ? 'bg-[hsl(180_15%_6%)]' : theme === 'xvlk' ? 'bg-[hsl(220_25%_8%)]' : 'bg-card'}`}
          key={location.pathname}
          style={{ animation: 'content-slide-in 0.35s cubic-bezier(0.16,1,0.3,1) forwards' }}
        >
          {children}
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 text-center border-t ${isPS2 ? 'border-blue-800/20' : 'border-border'}`}
          style={{ background: activeFooter[mode] }}>
          <p className={`text-xs font-semibold ${isPS2 ? 'text-blue-400/50' : 'text-muted-foreground'}`}>
            © {new Date().getFullYear()} Telekoquitoman
          </p>
          <p className={`text-xs mt-0.5 ${isPS2 ? 'text-blue-400/40' : 'text-muted-foreground'}`}>
            Web creada el 22/02/2026 ·{' '}
            <Link to="/sobre-mi" onClick={click} className={`hover:underline font-bold ${isPS2 ? 'text-blue-400' : 'text-primary'}`}>Sobre mi</Link>
            {' · '}
            <Link to="/contacto" onClick={click} className={`hover:underline font-bold ${isPS2 ? 'text-blue-400' : 'text-primary'}`}>Contacto</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = ['Blog', 'Videos', 'Coleccion', 'About', 'Redes', 'Contacto']

const bubbles = [
  { size: 120, top: '8%',  left: '6%',  delay: 0 },
  { size: 200, top: '5%',  left: '18%', delay: 0.8 },
  { size: 80,  top: '20%', left: '38%', delay: 1.4 },
  { size: 60,  top: '45%', left: '30%', delay: 0.3 },
  { size: 140, top: '10%', left: '55%', delay: 1.1 },
  { size: 90,  top: '35%', left: '68%', delay: 0.6 },
  { size: 170, top: '3%',  left: '80%', delay: 1.7 },
  { size: 50,  top: '55%', left: '48%', delay: 2.0 },
  { size: 110, top: '15%', left: '92%', delay: 0.4 },
]

function Bubble({ size, top, left, delay }: { size: number; top: string; left: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: [0, -18, 0] }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: { duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay },
      }}
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.25) 40%, rgba(200,230,255,0.15) 70%, rgba(180,220,255,0.05) 100%)',
        border: '1.5px solid rgba(255,255,255,0.6)',
        boxShadow: 'inset -8px -8px 20px rgba(180,220,255,0.3), inset 4px 4px 10px rgba(255,255,255,0.5)',
        pointerEvents: 'none',
      }}
    />
  )
}

export default function UnderConstruction() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", minHeight: '100vh', background: '#fff' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 2rem', height: 56,
      }}>
        <div style={{ display: 'flex', gap: '2.5rem' }}>
          {navLinks.map(l => (
            <span key={l} style={{
              fontSize: 13, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: '#444', cursor: 'default',
              opacity: 0.7,
            }}>{l}</span>
          ))}
        </div>
      </nav>

      {/* Hero — cielo */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        height: '82vh', marginTop: 56,
        background: 'linear-gradient(180deg, #5bb8f5 0%, #87ceeb 40%, #b8e0f7 70%, #d4eefb 100%)',
      }}>
        {/* Nubes */}
        <div style={{
          position: 'absolute', bottom: '20%', left: 0, right: 0,
          height: '45%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.6) 100%)',
        }} />

        {/* Burbujas */}
        {bubbles.map((b, i) => <Bubble key={i} {...b} />)}

        {/* Personaje TV */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute', bottom: 0, right: '12%',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}
        >
          {/* TV cabeza */}
          <div style={{
            width: 130, height: 100,
            background: 'linear-gradient(145deg, #2a2a3a, #1a1a28)',
            borderRadius: '12px 12px 8px 8px',
            border: '3px solid #111',
            position: 'relative',
            boxShadow: '4px 6px 20px rgba(0,0,0,0.4)',
          }}>
            {/* Pantalla */}
            <div style={{
              position: 'absolute', top: 12, left: 14, right: 28, bottom: 14,
              background: 'linear-gradient(135deg, #3a5a6a 0%, #2a4a5a 50%, #1a3a4a 100%)',
              borderRadius: 4,
              border: '2px solid #0d2230',
              boxShadow: 'inset 0 0 15px rgba(0,50,80,0.6)',
            }}>
              <div style={{
                position: 'absolute', top: 4, left: 4, width: 20, height: 12,
                background: 'rgba(255,255,255,0.12)', borderRadius: 2,
              }} />
            </div>
            {/* Botones lado derecho */}
            <div style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: '#111', border: '1px solid #333' }} />
              ))}
            </div>
            {/* Antena */}
            <div style={{ position: 'absolute', top: -30, left: '40%', width: 3, height: 30, background: '#222', borderRadius: 2 }} />
            <div style={{ position: 'absolute', top: -30, left: '40%', width: 30, height: 2, background: '#222', borderRadius: 2, transform: 'rotate(-20deg)', transformOrigin: 'left' }} />
          </div>
          {/* Cuerpo */}
          <div style={{
            width: 110, height: 160,
            background: 'linear-gradient(180deg, #1e2535 0%, #161c28 100%)',
            borderRadius: '4px 4px 0 0',
            position: 'relative',
            boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
          }}>
            {/* Corbata */}
            <div style={{
              position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
              width: 20, height: 80,
              background: 'linear-gradient(180deg, #c0392b, #96281b)',
              clipPath: 'polygon(30% 0%, 70% 0%, 85% 60%, 50% 100%, 15% 60%)',
            }} />
            {/* Cuello camisa */}
            <div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: 40, height: 16,
              background: '#e8e8e8',
            }} />
            {/* Solapas */}
            <div style={{
              position: 'absolute', top: 0, left: 10, width: 30, height: 40,
              background: '#1e2535',
              clipPath: 'polygon(0 0, 100% 0, 60% 100%, 0 60%)',
              borderRight: '1px solid #2a3445',
            }} />
            <div style={{
              position: 'absolute', top: 0, right: 10, width: 30, height: 40,
              background: '#1e2535',
              clipPath: 'polygon(0 0, 100% 0, 100% 60%, 40% 100%)',
              borderLeft: '1px solid #2a3445',
            }} />
          </div>
        </motion.div>
      </div>

      {/* Seccion inferior azul claro */}
      <div style={{
        background: 'linear-gradient(180deg, #d4eefb 0%, #c2e5f8 100%)',
        padding: '3rem 2rem',
        textAlign: 'center',
      }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.4rem)',
            fontWeight: 700,
            color: '#fff',
            textShadow: '0 1px 4px rgba(0,80,150,0.25)',
            marginBottom: '1.5rem',
          }}
        >
          Estoy remodelando la web — vuelve pronto ;)
        </motion.h1>

        {/* Boton motivo */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setOpen(o => !o)}
          style={{
            background: 'rgba(255,255,255,0.5)',
            border: '1.5px solid rgba(255,255,255,0.8)',
            borderRadius: 999,
            padding: '0.55rem 1.4rem',
            fontSize: 13, fontWeight: 600,
            color: '#2a6fa8', cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.75)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.5)')}
        >
          {open ? '▲' : '▼'} Motivo
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.7)',
                borderRadius: 12,
                padding: '1rem 1.8rem',
                maxWidth: 420,
                textAlign: 'left',
              }}>
                <p style={{ color: '#1a4a6e', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                  Estoy remodelando mi pagina web.
                  En un tiempo estara lista.<br />
                  <span style={{ color: '#2a6fa8', fontWeight: 600 }}>Gracias por leer&nbsp;:)</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Link YouTube */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ marginTop: 32 }}
        >
          <a href="https://www.youtube.com/@Teleko360" target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: '#2a6fa8', fontSize: 13, fontWeight: 600, textDecoration: 'none',
              opacity: 0.8,
            }}>
            <svg style={{ width: 16, height: 16, color: '#c0392b' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Mientras tanto visita @Teleko360 en YouTube
          </a>
        </motion.div>
      </div>
    </div>
  )
}

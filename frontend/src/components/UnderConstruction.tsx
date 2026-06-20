import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function UnderConstruction() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(180deg,hsl(180 20% 6%)0%,hsl(180 15% 4%)100%)' }}>

      <div className="text-center max-w-lg mx-auto">

        {/* Icono */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="text-7xl mb-8 select-none"
        >
          🚧
        </motion.div>

        {/* Titulo */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: '#00f5ff' }}
        >
          Telekoquitoman
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display font-black text-4xl sm:text-6xl text-white mb-6 leading-tight"
        >
          Under<br />Construction
        </motion.h1>

        {/* Boton motivo */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setOpen(o => !o)}
          className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-sm transition-all duration-200 hover:scale-105"
          style={{
            background: 'rgba(0,245,255,0.07)',
            border: '1px solid rgba(0,245,255,0.25)',
            color: '#00f5ff',
          }}
        >
          <span>{open ? '▲' : '▼'}</span>
          Motivo
        </motion.button>

        {/* Mensaje desplegable */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="rounded-sm px-6 py-5 text-left"
                style={{ background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.15)' }}>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Estoy remodelando mi pagina web,{' '}
                  <span style={{ color: '#00f5ff' }}>en un tiempo estara lista.</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Gracias por leer&nbsp;
                  <span className="text-white">:)</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Link YT */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10"
        >
          <a href="https://www.youtube.com/@Teleko360" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-gray-400 transition-colors">
            <svg className="w-3.5 h-3.5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Mientras tanto, visita el canal @Teleko360
          </a>
        </motion.div>
      </div>
    </div>
  )
}

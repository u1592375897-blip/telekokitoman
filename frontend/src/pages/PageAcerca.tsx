import { motion } from 'framer-motion'

const badges = [
  { label: 'Version', value: '1.0' },
  { label: 'Nombre',  value: 'RMB' },
  { label: 'Fecha',   value: '19/04/2026' },
  { label: 'Autor',   value: 'Sergio M.J' },
]

export default function PageAcerca() {
  return (
    <div className="px-4 py-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-semibold tracking-widest uppercase mb-3 neon-text-cyan"
          >
            Acerca de
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black text-4xl sm:text-6xl text-slate-800 mb-4"
          >
            Telekoquitoman
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-md mx-auto"
          >
            Web personal de contenido retro y tecnologia.
          </motion.p>
        </div>

        {/* Version badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-3 justify-center mb-10"
        >
          {badges.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="glass-panel rounded-sm px-4 py-2 text-center"
            >
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-0.5">{b.label}</p>
              <p className="font-display font-black text-sm neon-text-cyan">{b.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* RMB section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-panel rounded-sm p-6 mb-6"
        >
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">Sistema RMB</h2>
          <p className="text-slate-800 font-bold mb-2">RMB &mdash; Sistema de personalizacion del tema de la web</p>
          <p className="text-slate-500 text-sm leading-relaxed">
            El sistema de temas y sonidos de la version 1.0 provenia de mi proyecto anterior en Lovable,{' '}
            <a
              href="https://telekoquitomanweb.lovable.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[hsl(var(--primary))] hover:underline"
            >
              telekoquitomanweb.lovable.app
            </a>
            , creado el 22/02/2026. Desde entonces la web evoluciono a un diseño unico mas claro.
          </p>
        </motion.div>

        {/* Creator section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-panel rounded-sm p-6 mb-6"
        >
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">Desarrollador</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'radial-gradient(circle at 35% 30%, hsl(var(--primary)/.9), hsl(var(--primary)) 60%)', boxShadow: '0 4px 15px hsl(var(--primary)/.3)' }}>
              <span className="text-xs font-black text-white tracking-widest">TKM</span>
            </div>
            <div>
              <p className="text-slate-800 font-bold">Sergio Montes Jimenez</p>
              <p className="text-slate-500 text-sm font-mono">@Telekoquitoman</p>
            </div>
          </div>
        </motion.div>

        {/* Changelog */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass-panel rounded-sm p-6"
        >
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">Historial</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-xs font-mono px-2 py-0.5 rounded-sm shrink-0"
                style={{ background: 'rgba(37,157,244,0.08)', color: '#259df4', border: '1px solid rgba(37,157,244,0.3)' }}>
                v2.0
              </span>
              <div>
                <p className="text-slate-800 text-sm font-bold">Rediseño cielo</p>
                <p className="text-slate-400 text-xs font-mono">20/06/2026</p>
                <p className="text-slate-500 text-sm mt-1">
                  Nueva estetica unica: cielo, burbujas y navbar claro, sustituyendo el sistema multi-tema RMB.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xs font-mono px-2 py-0.5 rounded-sm shrink-0"
                style={{ background: 'rgba(37,157,244,0.08)', color: '#259df4', border: '1px solid rgba(37,157,244,0.3)' }}>
                v1.0 RMB
              </span>
              <div>
                <p className="text-slate-800 text-sm font-bold">Lanzamiento inicial</p>
                <p className="text-slate-400 text-xs font-mono">19/04/2026</p>
                <p className="text-slate-500 text-sm mt-1">
                  Multi-tema RMB, coleccion de dispositivos, chatbot IA, paginas de videos y contacto.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-slate-400 text-sm mt-10"
        >
          Sigueme en{' '}
          <a href="https://www.youtube.com/@Teleko360" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--primary))] hover:underline">
            @Teleko360
          </a>{' '}
          para mas contenido.
        </motion.p>
      </div>
    </div>
  )
}

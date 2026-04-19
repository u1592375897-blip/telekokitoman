import { motion } from 'framer-motion'

const items = [
  { name: 'iPod Touch 4G', year: '2010', desc: 'El último iPod Touch con cámara trasera de 0.7MP. iOS 6.1.6 en 2026.', emoji: '🎵', tag: 'Apple' },
  { name: 'iPod Shuffle 2G', year: '2006', desc: 'El reproductor más pequeño del mundo. Sin pantalla, puro shuffle.', emoji: '🎵', tag: 'Apple' },
  { name: 'PlayStation 2', year: '2000', desc: 'La consola más vendida de la historia. Todavía con juegos físicos.', emoji: '🎮', tag: 'Sony' },
  { name: 'PlayStation 3', year: '2006', desc: 'Temas, homebrew y juegos clásicos en 2026.', emoji: '🎮', tag: 'Sony' },
  { name: 'iPod', year: '2001', desc: 'El original que cambió la música para siempre.', emoji: '🎵', tag: 'Apple' },
]


export default function PageColeccion() {
  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-semibold tracking-widest uppercase mb-3 neon-text-cyan"
          >
            Museo personal
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black text-4xl sm:text-6xl text-white mb-4"
          >
            Mi Colección
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-md mx-auto"
          >
            Dispositivos retro que sigo usando y explorando en pleno 2026.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel rounded-sm p-6 group hover:border-cyan-500/25 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{item.emoji}</span>
                <div className="text-right">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-sm"
                    style={{ background: 'rgba(0,245,255,0.08)', color: '#00f5ff', border: '1px solid rgba(0,245,255,0.2)' }}
                  >
                    {item.tag}
                  </span>
                  <p className="text-xs text-gray-600 font-mono mt-1">{item.year}</p>
                </div>
              </div>
              <h3 className="font-display font-black text-white text-lg mb-2 group-hover:text-cyan-300 transition-colors">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              <div
                className="mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                style={{ background: 'linear-gradient(90deg, #00f5ff, #bf00ff)' }}
              />
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-700 text-sm mt-12"
        >
          Colección en constante crecimiento — sígueme en{' '}
          <a href="https://www.youtube.com/@Teleko360" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">
            @Teleko360
          </a>{' '}
          para ver más.
        </motion.p>
      </div>
    </div>
  )
}

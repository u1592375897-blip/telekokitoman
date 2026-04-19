import { motion } from 'framer-motion'

const retro = [
  { name: 'iPod Touch 4G', year: '2010', desc: 'El ultimo iPod Touch con camara trasera de 0.7MP. iOS 6.1.6 en 2026.', emoji: '🎵', tag: 'Apple' },
  { name: 'iPod Shuffle 2G', year: '2006', desc: 'El reproductor mas pequeño del mundo. Sin pantalla, puro shuffle.', emoji: '🎵', tag: 'Apple' },
  { name: 'PlayStation 2', year: '2000', desc: 'La consola mas vendida de la historia. Todavia con juegos fisicos.', emoji: '🎮', tag: 'Sony' },
  { name: 'PlayStation 3', year: '2006', desc: 'Temas, homebrew y juegos clasicos en 2026.', emoji: '🎮', tag: 'Sony' },
  { name: 'iPod Classic', year: '2001', desc: 'El original que cambio la musica para siempre.', emoji: '🎵', tag: 'Apple' },
]

type IPhoneStatus = 'obtenido' | 'roto' | 'reparando' | 'buscando'

const iphones: { model: string; year: string; status: IPhoneStatus; note?: string }[] = [
  { model: 'iPhone 2G',  year: '2007', status: 'buscando' },
  { model: 'iPhone 3G',  year: '2008', status: 'buscando' },
  { model: 'iPhone 3GS', year: '2009', status: 'buscando' },
  { model: 'iPhone 4',   year: '2010', status: 'roto',      note: 'Obtenido — pantalla rota' },
  { model: 'iPhone 4S',  year: '2011', status: 'buscando' },
  { model: 'iPhone 5',   year: '2012', status: 'buscando' },
  { model: 'iPhone 5C',  year: '2013', status: 'buscando' },
  { model: 'iPhone 5S',  year: '2013', status: 'buscando' },
  { model: 'iPhone 6',   year: '2014', status: 'buscando' },
  { model: 'iPhone 6S',  year: '2015', status: 'reparando', note: 'Obtenido — reparacion pendiente' },
  { model: 'iPhone 7',   year: '2016', status: 'buscando' },
  { model: 'iPhone 8',   year: '2017', status: 'buscando' },
]

const statusStyle: Record<IPhoneStatus, { label: string; color: string; bg: string; border: string }> = {
  obtenido:  { label: 'Obtenido',   color: '#00f5ff', bg: 'rgba(0,245,255,0.08)',   border: 'rgba(0,245,255,0.3)' },
  roto:      { label: 'Roto',       color: '#ff6b35', bg: 'rgba(255,107,53,0.08)',  border: 'rgba(255,107,53,0.3)' },
  reparando: { label: 'Reparando',  color: '#f5c518', bg: 'rgba(245,197,24,0.08)',  border: 'rgba(245,197,24,0.3)' },
  buscando:  { label: 'Buscando',   color: '#6b7280', bg: 'rgba(107,114,128,0.05)', border: 'rgba(107,114,128,0.2)' },
}

export default function PageColeccion() {
  const obtenidos = iphones.filter(i => i.status !== 'buscando').length

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
            Mi Coleccion
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-md mx-auto"
          >
            Dispositivos retro que colecciono, reparo y exploro en pleno 2026.
          </motion.p>
        </div>

        {/* Otros retro */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xs font-semibold tracking-widest uppercase mb-5 text-gray-500"
        >
          Coleccion retro
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {retro.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
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

        {/* iPhone collection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-5"
        >
          <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-500">
            Coleccion iPhone (2G — 8)
          </h2>
          <span className="text-xs font-mono" style={{ color: '#00f5ff' }}>
            {obtenidos}/{iphones.length} obtenidos
          </span>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {iphones.map((phone, i) => {
            const s = statusStyle[phone.status]
            const obtained = phone.status !== 'buscando'
            return (
              <motion.div
                key={phone.model}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="glass-panel rounded-sm p-4 transition-all duration-300"
                style={{
                  opacity: obtained ? 1 : 0.45,
                  borderColor: obtained ? s.border : undefined,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{obtained ? '📱' : '🔍'}</span>
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-sm"
                    style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                  >
                    {s.label}
                  </span>
                </div>
                <p className="font-display font-black text-sm text-white mb-0.5">{phone.model}</p>
                <p className="text-xs text-gray-600 font-mono">{phone.year}</p>
                {phone.note && (
                  <p className="text-xs mt-1.5" style={{ color: s.color }}>{phone.note}</p>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Leyenda */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap gap-4 mt-8 justify-center text-xs text-gray-600"
        >
          {Object.entries(statusStyle).map(([key, s]) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-700 text-sm mt-10"
        >
          Coleccion en constante crecimiento &mdash; sigueme en{' '}
          <a href="https://www.youtube.com/@Teleko360" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">
            @Teleko360
          </a>{' '}
          para ver mas.
        </motion.p>
      </div>
    </div>
  )
}

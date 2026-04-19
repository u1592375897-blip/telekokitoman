import { motion } from 'framer-motion'

type ItemStatus = 'obtenido' | 'roto' | 'reparando' | 'buscando'

type CollectionItem = { model: string; year: string; status: ItemStatus; note?: string }

const ipods: CollectionItem[] = [
  { model: 'iPod Touch 4G',  year: '2010', status: 'obtenido', note: 'En coleccion' },
  { model: 'iPod Shuffle 2G',year: '2006', status: 'obtenido', note: 'En coleccion' },
  { model: 'iPod Classic',   year: '2001', status: 'obtenido', note: 'En coleccion' },
  { model: 'iPod Mini',      year: '2004', status: 'buscando' },
  { model: 'iPod Nano 1G',   year: '2005', status: 'buscando' },
  { model: 'iPod Shuffle 1G',year: '2005', status: 'buscando' },
  { model: 'iPod Nano 2G',   year: '2006', status: 'buscando' },
  { model: 'iPod Touch 1G',  year: '2007', status: 'buscando' },
  { model: 'iPod Touch 2G',  year: '2008', status: 'buscando' },
  { model: 'iPod Touch 3G',  year: '2009', status: 'buscando' },
  { model: 'iPod Nano 6G',   year: '2010', status: 'buscando' },
  { model: 'iPod Touch 5G',  year: '2012', status: 'buscando' },
]

const playstations: CollectionItem[] = [
  { model: 'PS2',          year: '2000', status: 'buscando' },
  { model: 'PS3 Fat',      year: '2006', status: 'obtenido', note: 'En coleccion' },
  { model: 'PS3 Slim',     year: '2009', status: 'buscando' },
  { model: 'PS3 Super Slim',year:'2012', status: 'buscando' },
  { model: 'PS4',          year: '2013', status: 'buscando' },
  { model: 'PS4 Pro',      year: '2016', status: 'obtenido', note: 'En coleccion' },
  { model: 'PSP',          year: '2005', status: 'buscando' },
  { model: 'PS Vita',      year: '2011', status: 'buscando' },
]

const nintendo: CollectionItem[] = [
  { model: 'Wii',         year: '2006', status: 'obtenido', note: 'En coleccion' },
  { model: 'Switch OLED', year: '2021', status: 'obtenido', note: 'En coleccion' },
]

type IPhoneStatus = ItemStatus

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

function CollectionGrid({ title, items, emoji, delayBase }: {
  title: string
  items: CollectionItem[]
  emoji: string
  delayBase: number
}) {
  const sorted = [...items].sort((a, b) => {
    const order = { obtenido: 0, roto: 1, reparando: 2, buscando: 3 }
    return order[a.status] - order[b.status]
  })
  const obtenidos = items.filter(i => i.status !== 'buscando').length
  return (
    <div className="mb-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delayBase }}
        className="flex items-center justify-between mb-4"
      >
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-500">{title}</h2>
        <span className="text-xs font-mono" style={{ color: 'hsl(var(--primary))' }}>{obtenidos}/{items.length} obtenidos</span>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {sorted.map((item, i) => {
          const s = statusStyle[item.status]
          const obtained = item.status !== 'buscando'
          return (
            <motion.div
              key={item.model}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delayBase + 0.05 + i * 0.04 }}
              className="glass-panel rounded-sm p-4 transition-all duration-300"
              style={{ opacity: obtained ? 1 : 0.45, borderColor: obtained ? s.border : undefined }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{obtained ? emoji : '🔍'}</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-sm"
                  style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                  {s.label}
                </span>
              </div>
              <p className="font-display font-black text-sm text-white mb-0.5">{item.model}</p>
              <p className="text-xs text-gray-600 font-mono">{item.year}</p>
              {item.note && <p className="text-xs mt-1.5" style={{ color: s.color }}>{item.note}</p>}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default function PageColeccion() {
  return (
    <div className="px-4 py-8">
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

        <CollectionGrid title="Coleccion iPod"            items={ipods}       emoji="🎵" delayBase={0.1} />
        <CollectionGrid title="Coleccion iPhone (2G - 8)" items={iphones}     emoji="📱" delayBase={0.2} />
        <CollectionGrid title="Coleccion PlayStation"     items={playstations} emoji="🎮" delayBase={0.3} />
        <CollectionGrid title="Coleccion Nintendo"        items={nintendo}    emoji="🕹️" delayBase={0.4} />

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

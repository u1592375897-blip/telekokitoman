import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import heroSky from '../assets/hero-sky.jpg'

const quickLinks = [
  { label: 'Videos',    path: '/videos',    emoji: '▶️' },
  { label: 'Coleccion', path: '/coleccion', emoji: '🕹️' },
  { label: 'Sobre mi',  path: '/sobre-mi',  emoji: '👋' },
  { label: 'Contacto',  path: '/contacto',  emoji: '✉️' },
]

const stats = [
  { label: 'YouTube',   value: '@Teleko360' },
  { label: 'TikTok',    value: '@telekoquitoman8' },
  { label: 'Instagram', value: '@telekoquitoman232' },
]

export default function Hero() {
  return (
    <section>
      {/* Cielo + personaje */}
      <div className="relative w-full overflow-hidden" style={{ height: '64vh', minHeight: 360 }}>
        <img
          src={heroSky}
          alt="Cielo con burbujas"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '68% 35%' }}
        />
      </div>

      {/* Panel inferior */}
      <div
        className="py-14 px-4 text-center"
        style={{ background: 'linear-gradient(180deg, hsl(205 75% 86%) 0%, hsl(205 55% 95%) 100%)' }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-bold tracking-widest uppercase mb-3"
          style={{ color: 'hsl(205 70% 35%)' }}
        >
          Canal de YouTube
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display font-black text-3xl sm:text-5xl mb-4"
          style={{ color: 'hsl(215 45% 22%)' }}
        >
          ¿Que hay de nuevo en Telekoquitoman?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg mb-8 max-w-xl mx-auto"
          style={{ color: 'hsl(215 25% 38%)' }}
        >
          Tecnologia retro, videojuegos y tutoriales tech &mdash; contenido nuevo cada semana.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="https://www.youtube.com/@Teleko360"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyber-solid rounded-full text-sm font-display uppercase tracking-wide"
          >
            ▶ Ver canal de YouTube
          </a>
          <Link to="/videos" className="btn-cyber rounded-full text-sm font-display uppercase tracking-wide bg-white">
            Ultimos videos
          </Link>
        </motion.div>
      </div>

      {/* Quick links */}
      <div className="px-4 py-14 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {quickLinks.map((l, i) => (
              <motion.div
                key={l.path}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link to={l.path} className="glass-card rounded-2xl p-5 flex flex-col items-center gap-2 text-center hover:scale-105 transition-all duration-200 shadow-sm">
                  <span className="text-2xl">{l.emoji}</span>
                  <span className="text-sm font-bold text-foreground">{l.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-8"
          >
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xs font-mono neon-text-cyan">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

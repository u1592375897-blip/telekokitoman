import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, rgba(0,245,255,0.06) 0%, rgba(191,0,255,0.04) 40%, transparent 70%), #0a0a0f',
      }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-20 left-8 w-16 h-16 border-t-2 border-l-2 border-cyan-500/30" />
      <div className="absolute top-20 right-8 w-16 h-16 border-t-2 border-r-2 border-purple-500/30" />
      <div className="absolute bottom-20 left-8 w-16 h-16 border-b-2 border-l-2 border-purple-500/30" />
      <div className="absolute bottom-20 right-8 w-16 h-16 border-b-2 border-r-2 border-cyan-500/30" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
          style={{ border: '1px solid rgba(0,245,255,0.3)', color: '#00f5ff', background: 'rgba(0,245,255,0.05)' }}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Canal de YouTube activo
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-black leading-none mb-6"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
        >
          <span className="text-white">TELEKO</span>
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #00f5ff, #bf00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            QUITOMAN
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-lg sm:text-xl mb-10 max-w-xl mx-auto font-medium"
        >
          Contenido tech, retro y videojuegos.
          <br />
          <span className="text-gray-500 text-base">Tutoriales · Colecciones · YouTube</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="https://www.youtube.com/@Teleko360"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyber-solid rounded-sm font-display tracking-wide text-sm uppercase"
          >
            ▶ Ver canal de YouTube
          </a>
          <a href="#videos" className="btn-cyber rounded-sm font-display tracking-wide text-sm uppercase">
            Últimos videos ↓
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-8 mt-16"
        >
          {[
            { label: 'YouTube', value: '@Teleko360' },
            { label: 'TikTok', value: '@telekoquitoman8' },
            { label: 'Instagram', value: '@telekoquitoman232' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-xs font-mono text-cyan-400/70">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0a0a0f)' }}
      />
    </section>
  )
}

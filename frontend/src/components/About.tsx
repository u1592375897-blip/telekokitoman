import { motion } from 'framer-motion'

const socialLinks = [
  { name: 'YouTube', handle: '@Teleko360', url: 'https://www.youtube.com/@Teleko360', color: '#FF0000' },
  { name: 'TikTok', handle: '@telekoquitoman8', url: 'https://www.tiktok.com/@telekoquitoman8', color: '#00f2ea' },
  { name: 'Instagram', handle: '@telekoquitoman232', url: 'https://www.instagram.com/telekoquitoman232/', color: '#E4405F' },
  { name: 'Facebook', handle: 'Telekoquitoman', url: 'https://www.facebook.com/profile.php?id=61583158996334', color: '#1877F2' },
]

export default function About() {
  return (
    <section id="about" className="py-24 px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(191,0,255,0.04) 0%, transparent 60%)' }}
      />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-3 neon-text-purple">
              Sobre mí
            </p>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-6 leading-tight">
              Hola, soy{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #00f5ff, #bf00ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Sergio
              </span>
            </h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                Creador de contenido apasionado por la tecnología retro, los videojuegos y los tutoriales tech.
              </p>
              <p>
                En mi canal <span className="text-cyan-400 font-semibold">@Teleko360</span> subo videos sobre dispositivos clásicos, colecciones y todo lo relacionado con el mundo tech.
              </p>
              <p>
                También estoy en TikTok, Instagram y más redes donde comparto el mismo contenido en diferentes formatos.
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              <a
                href="https://www.youtube.com/@Teleko360"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cyber-solid rounded-sm text-sm font-display uppercase tracking-wide"
              >
                ▶ YouTube
              </a>
              <a href="#contact" className="btn-cyber rounded-sm text-sm font-display uppercase tracking-wide">
                Contacto
              </a>
            </div>
          </motion.div>

          {/* Right — social cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            {socialLinks.map((s, i) => (
              <motion.a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 glass-panel rounded-sm p-4 group hover:border-white/10 transition-all duration-200"
              >
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 text-sm font-bold"
                  style={{ background: `${s.color}22`, border: `1px solid ${s.color}44`, color: s.color }}
                >
                  {s.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{s.name}</p>
                  <p className="text-xs text-gray-500 font-mono">{s.handle}</p>
                </div>
                <span className="text-gray-700 group-hover:text-gray-400 transition-colors text-sm">→</span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'

const featured = [
  { name: 'YouTube', handle: '@Teleko360', url: 'https://www.youtube.com/@Teleko360', color: '#FF0000', emoji: '▶️' },
  { name: 'Instagram', handle: '@telekoquitoman232', url: 'https://www.instagram.com/telekoquitoman232/', color: '#E4405F', emoji: '📸' },
  { name: 'TikTok', handle: '@telekoquitoman8', url: 'https://www.tiktok.com/@telekoquitoman8', color: '#00f2ea', emoji: '🎵' },
]

const sections = [
  {
    title: 'Redes sociales', emoji: '🌐',
    items: [
      { name: 'YouTube', handle: 'Telekoquitoman', url: 'https://www.youtube.com/@Teleko360', emoji: '▶️' },
      { name: 'TikTok', handle: '@telekoquitoman8', url: 'https://www.tiktok.com/@telekoquitoman8', emoji: '🎵' },
      { name: 'Instagram', handle: 'telekoquitoman232', url: 'https://www.instagram.com/telekoquitoman232', emoji: '📸' },
      { name: 'Facebook', handle: 'Telekoquitoman', url: 'https://www.facebook.com/profile.php?id=61583158996334', emoji: '📘' },
      { name: 'Lvy', handle: 'telekoquitoman', url: 'https://ivy.a1429.lol/users/1774', emoji: '🌿' },
      { name: 'Reddit', handle: 'u/telekoquitoman', url: 'https://www.reddit.com/user/telekoquitoman', emoji: '🤖' },
      { name: 'Reddit (Guest)', handle: 'u/Guest3056', url: 'https://www.reddit.com/user/Guest3056', emoji: '🤖' },
    ],
  },
  {
    title: 'Contenido', emoji: '📦',
    items: [
      { name: 'Pixabay', handle: 'telekoquitoman', url: 'https://pixabay.com/es/users/telekoquitoman-53116210/', emoji: '📷' },
      { name: 'Internet Archive', handle: 'telekoquitoman', url: 'https://archive.org/details/@telekoquitoman', emoji: '📚' },
      { name: 'Neocities', handle: 'telekoquitoman', url: 'https://neocities.org/', emoji: '🏠' },
    ],
  },
  {
    title: 'Desarrollo', emoji: '💻',
    items: [
      { name: 'GitHub', handle: 'u1592375897-blip', url: 'https://github.com/u1592375897-blip', emoji: '🐙' },
    ],
  },
  {
    title: 'Videojuegos', emoji: '🎮',
    items: [
      { name: 'Roblox', handle: 'Vlk201244344', url: 'https://www.roblox.com/search/users?keyword=Vlk201244344', emoji: '🟩' },
      { name: 'Polytoria', handle: 'Vlk201244344', url: 'https://polytoria.com/user/Vlk201244344', emoji: '🎲' },
    ],
  },
  {
    title: 'Mensajería', emoji: '💬',
    items: [
      { name: 'Discord', handle: 'Telekoquitoman', url: undefined, emoji: '🎮' },
    ],
  },
]

export default function Redes() {
  return (
    <section id="redes" className="py-24 px-4 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(191,0,255,0.03) 0%, transparent 60%)' }}
      />
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest uppercase mb-3 neon-text-purple"
          >
            Encuéntrame en
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-black text-3xl sm:text-5xl text-white"
          >
            Mis Redes
          </motion.h2>
        </div>

        {/* Featured 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
        >
          {featured.map((s, i) => (
            <motion.a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel rounded-sm p-6 text-center group hover:scale-[1.03] transition-all duration-200"
              style={{ borderColor: `${s.color}22` }}
            >
              <span className="text-4xl block mb-3">{s.emoji}</span>
              <p className="font-display font-black text-white text-base mb-1">{s.name}</p>
              <p className="text-xs font-mono mb-3" style={{ color: s.color }}>{s.handle}</p>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}33` }}
              >
                Ver perfil →
              </span>
            </motion.a>
          ))}
        </motion.div>

        {/* All sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: si * 0.06 }}
            >
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(0,245,255,0.7)' }}>
                <span>{section.emoji}</span> {section.title}
              </h3>
              <div className="space-y-2">
                {section.items.map(item => (
                  item.url ? (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 glass-panel rounded-sm px-4 py-3 transition-all duration-200 group hover:border-cyan-500/20 cursor-pointer"
                    >
                      <span className="text-lg">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        <p className="text-xs text-gray-500 font-mono truncate">{item.handle}</p>
                      </div>
                      <span className="text-gray-700 group-hover:text-cyan-400 transition-colors text-sm shrink-0">→</span>
                    </a>
                  ) : (
                    <div
                      key={item.name}
                      className="flex items-center gap-3 glass-panel rounded-sm px-4 py-3 opacity-60"
                    >
                      <span className="text-lg">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        <p className="text-xs text-gray-500 font-mono truncate">{item.handle}</p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

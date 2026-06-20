import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'

interface Video {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  url: string
}

const WORKER_URL = import.meta.env.VITE_WORKER_URL || 'http://localhost:8787'

const YT_ICON = (
  <svg className="w-4 h-4 text-red-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

export default function YouTubeSection() {
  const [videos,  setVideos]  = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)
  const [query,   setQuery]   = useState('')
  const [sort,    setSort]    = useState<'newest' | 'oldest'>('newest')

  useEffect(() => {
    fetch(`${WORKER_URL}/api/youtube`)
      .then(r => r.json())
      .then((data: Video[]) => { setVideos(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = q ? videos.filter(v => v.title.toLowerCase().includes(q)) : [...videos]
    list.sort((a, b) => {
      const da = new Date(a.publishedAt).getTime()
      const db = new Date(b.publishedAt).getTime()
      return sort === 'newest' ? db - da : da - db
    })
    return list
  }, [videos, query, sort])

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-xs font-semibold tracking-widest uppercase mb-3 neon-text-cyan">
            Canal de YouTube
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-display font-black text-3xl sm:text-5xl text-white mb-3">
            Todos los Videos
          </motion.h2>
          <motion.a initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            href="https://www.youtube.com/@Teleko360" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-400 transition-colors">
            {YT_ICON}
            @Teleko360 — Suscribete
          </motion.a>
        </div>

        {/* Controls */}
        {!loading && !error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 mb-6 items-center justify-between">
            <div className="flex items-center gap-2 w-full sm:max-w-sm">
              <input
                type="text"
                placeholder="Buscar video..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 glass-panel rounded-sm px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-cyan-500/40 transition-colors"
                style={{ border: '1px solid rgba(0,245,255,0.1)' }}
              />
              {query && (
                <button onClick={() => setQuery('')}
                  className="text-gray-600 hover:text-white transition-colors text-lg leading-none">×</button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-600 font-mono">{filtered.length} / {videos.length} videos</span>
              <select value={sort} onChange={e => setSort(e.target.value as 'newest' | 'oldest')}
                className="glass-panel rounded-sm px-2 py-1.5 text-xs text-gray-400 outline-none cursor-pointer"
                style={{ border: '1px solid rgba(0,245,255,0.1)' }}>
                <option value="newest">Mas nuevos</option>
                <option value="oldest">Mas antiguos</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-panel rounded-sm overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-800/50" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-700/50 rounded w-3/4" />
                  <div className="h-2 bg-gray-700/30 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16 text-gray-600">
            <p className="text-4xl mb-4">📡</p>
            <p>No se pudieron cargar los videos.</p>
            <a href="https://www.youtube.com/@Teleko360" target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-block btn-cyber text-sm rounded-sm">
              Ver canal directamente
            </a>
          </div>
        )}

        {/* No results */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <p className="text-3xl mb-3">🔍</p>
            <p>No hay videos que coincidan con &ldquo;{query}&rdquo;</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((vid, i) => (
              <motion.a
                key={vid.id}
                href={vid.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.6) }}
                className="glass-panel rounded-sm overflow-hidden group hover:border-cyan-500/30 transition-all duration-300"
                style={{ border: '1px solid rgba(0,245,255,0.08)' }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={vid.thumbnail} alt={vid.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: 'linear-gradient(90deg, #00f5ff, #bf00ff)' }} />
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-semibold text-white line-clamp-2 group-hover:text-cyan-300 transition-colors leading-snug">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 font-mono">
                    {new Date(vid.publishedAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-8">
          <a href="https://www.youtube.com/@Teleko360" target="_blank" rel="noopener noreferrer"
            className="btn-cyber-solid rounded-sm text-sm font-display uppercase tracking-wide">
            ▶ Abrir canal en YouTube
          </a>
        </div>
      </div>
    </section>
  )
}

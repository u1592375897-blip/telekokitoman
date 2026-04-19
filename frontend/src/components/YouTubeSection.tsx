import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Video {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  url: string
}

const WORKER_URL = import.meta.env.VITE_WORKER_URL || 'http://localhost:8787'

export default function YouTubeSection() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`${WORKER_URL}/api/youtube`)
      .then(r => r.json())
      .then((data: Video[]) => { setVideos(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  return (
    <section id="videos" className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: '#00f5ff' }}
          >
            Canal de YouTube
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-black text-3xl sm:text-5xl text-white mb-4"
          >
            Videos Destacados
          </motion.h2>
          <motion.a
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            href="https://www.youtube.com/@Teleko360"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-400 transition-colors"
          >
            <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            @Teleko360 — Suscríbete
          </motion.a>
        </div>

        {/* Grid */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-panel rounded-sm overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-800/50" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-700/50 rounded w-3/4" />
                  <div className="h-3 bg-gray-700/30 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-gray-600">
            <p className="text-4xl mb-4">📡</p>
            <p>No se pudieron cargar los videos.</p>
            <a
              href="https://www.youtube.com/@Teleko360"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block btn-cyber text-sm rounded-sm"
            >
              Ver canal directamente
            </a>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((vid, i) => (
              <motion.a
                key={vid.id}
                href={vid.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass-panel rounded-sm overflow-hidden group hover:border-cyan-500/30 transition-all duration-300"
                style={{ border: '1px solid rgba(0,245,255,0.08)' }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ background: 'linear-gradient(90deg, #00f5ff, #bf00ff)' }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
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
        <div className="text-center mt-10">
          <a
            href="https://www.youtube.com/@Teleko360"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyber-solid rounded-sm text-sm font-display uppercase tracking-wide"
          >
            ▶ Ver todos los videos
          </a>
        </div>
      </div>
    </section>
  )
}

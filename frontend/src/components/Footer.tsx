export default function Footer() {
  return (
    <footer className="py-10 px-4 text-center border-t border-border bg-white">
      <p className="font-display font-black text-sm tracking-widest mb-3">
        <span className="neon-text-cyan">TELEKO</span>
        <span className="text-slate-800">QUITOMAN</span>
      </p>
      <div className="flex items-center justify-center gap-6 mb-4">
        {[
          { label: 'YouTube', url: 'https://www.youtube.com/@Teleko360' },
          { label: 'TikTok', url: 'https://www.tiktok.com/@telekoquitoman8' },
          { label: 'Instagram', url: 'https://www.instagram.com/telekoquitoman232/' },
        ].map(l => (
          <a
            key={l.label}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-[hsl(var(--primary))] transition-colors"
          >
            {l.label}
          </a>
        ))}
      </div>
      <p className="text-xs text-slate-400">© {new Date().getFullYear()} Telekoquitoman</p>
    </footer>
  )
}

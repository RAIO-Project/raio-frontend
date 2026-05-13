import { useNavigate } from 'react-router-dom'
import { formatCompactNumber } from '../../../shared/lib/format'

export function StreamCard({ stream }) {
  const navigate = useNavigate()
  return (
    <article onClick={() => navigate(`/stream/${stream.id}`)} className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-bg-2 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-2xl">
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-bg-4 to-bg-5">
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-40 transition group-hover:scale-110 group-hover:opacity-60">{stream.emoji}</div>
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-[10px] font-black text-white"><span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-white" />LIVE</div>
        <div className="absolute bottom-2 right-2 rounded-md bg-black/75 px-2 py-1 text-[10px] font-bold text-white">👁 {formatCompactNumber(stream.viewerCount)}</div>
      </div>
      <div className="space-y-2 p-3">
        <h3 className="line-clamp-2 text-sm font-black leading-snug">{stream.title}</h3>
        <div className="flex items-center justify-between text-xs text-white/45"><span>{stream.streamerName}</span><span>{stream.category}</span></div>
        <div className="flex flex-wrap gap-1.5">
          {stream.tags.map((tag) => <span key={tag} className="rounded-full bg-bg-4 px-2 py-0.5 text-[10px] font-bold text-white/35">#{tag}</span>)}
        </div>
      </div>
    </article>
  )
}

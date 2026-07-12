import { useNavigate } from 'react-router-dom'

import type { Stream } from '@/entities/stream'
import { formatCompactNumber } from '@/shared'

interface StreamCardProps {
  stream: Stream
}

export function StreamCard({ stream }: StreamCardProps) {
  const navigate = useNavigate()

  return (
    <article
      onClick={() => navigate(`/stream/${stream.id}`)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-bg-2 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-2xl"
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-bg-4 to-bg-5">
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-[10px] font-black text-white">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-white" />LIVE
        </div>
        <div className="absolute bottom-2 right-2 rounded-md bg-black/75 px-2 py-1 text-[10px] font-bold text-white">
          👁 {formatCompactNumber(stream.viewerCount)}
        </div>
      </div>
      <div className="space-y-2 p-3">
        <h3 className="line-clamp-2 text-sm font-black leading-snug">{stream.title}</h3>
        <div className="flex items-center justify-between text-xs text-white/45">
          {/* TODO(streamer): 백엔드가 스트리머 닉네임을 내려주면 여기에 표시 */}
          <span className="flex items-center gap-1">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-accent to-cyan-600 text-[8px] font-black text-black">
              R
            </span>
            스트리머
          </span>
          <span>{stream.category ?? '기타'}</span>
        </div>
      </div>
    </article>
  )
}

import { useMemo } from 'react'

import { filterStreams, StreamCard, useStreamStore } from '@/entities/stream'

export function StreamFeed() {
  const allStreams = useStreamStore((state) => state.streams)
  const category = useStreamStore((state) => state.category)
  const query = useStreamStore((state) => state.query)

  const streams = useMemo(() => filterStreams(allStreams, category, query), [allStreams, category, query])

  return (
    <main className="flex-1 overflow-y-auto p-4">
      <section className="mb-5 rounded-[2rem] border border-accent/10 bg-gradient-to-r from-accent/10 via-bg-2 to-accent-2/10 p-5">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-accent">Live Streaming Platform</p>
        <h1 className="mt-2 text-2xl font-black">방송 개설 · 실시간 채팅 · 포인트 후원까지</h1>
        <p className="mt-2 text-sm text-white/45">아프리카TV식 라이브 경험을 기준으로, 홈 → 방송 상세 → 채팅/후원 전환 흐름을 명확히 잡았습니다.</p>
      </section>

      <div className="mb-4 flex items-baseline gap-2">
        <span className="h-2 w-2 animate-pulse-dot rounded-full bg-red-500" />
        <h2 className="text-sm font-black">라이브 중</h2>
        <span className="text-xs text-white/30">{streams.length}개 방송</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {streams.map((stream) => <StreamCard key={stream.id} stream={stream} />)}
      </div>
    </main>
  )
}

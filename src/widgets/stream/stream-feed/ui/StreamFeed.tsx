import { useEffect } from 'react'

import { StreamCard, useStreamStore, type StreamSort } from '@/entities/stream'
import { cx } from '@/shared'

const SORT_TABS: Array<{ key: StreamSort; label: string }> = [
  { key: 'viewer', label: '시청자순' },
  { key: 'latest', label: '최신순' },
]

export function StreamFeed() {
  const streams = useStreamStore((state) => state.streams)
  const sort = useStreamStore((state) => state.sort)
  const loading = useStreamStore((state) => state.loading)
  const error = useStreamStore((state) => state.error)
  const setSort = useStreamStore((state) => state.setSort)
  const loadStreams = useStreamStore((state) => state.loadStreams)

  useEffect(() => {
    void loadStreams()
  }, [loadStreams])

  return (
    <main className="flex-1 overflow-y-auto p-4">
      <section className="mb-5 rounded-[2rem] border border-accent/10 bg-gradient-to-r from-accent/10 via-bg-2 to-accent-2/10 p-5">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-accent">Live Streaming Platform</p>
        <h1 className="mt-2 text-2xl font-black">방송 개설 · 실시간 채팅 · 포인트 후원까지</h1>
      </section>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="h-2 w-2 animate-pulse-dot rounded-full bg-red-500" />
          <h2 className="text-sm font-black">라이브 중</h2>
          <span className="text-xs text-white/30">{streams.length}개 방송</span>
        </div>
        <div className="flex gap-1.5">
          {SORT_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSort(tab.key)}
              className={cx(
                'rounded-full border px-3 py-1 text-xs font-black transition',
                sort === tab.key ? 'border-accent bg-accent text-black' : 'border-border text-white/45 hover:text-white',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="py-10 text-center text-sm text-white/40">불러오는 중…</p>}
      {error && <p className="py-10 text-center text-sm text-red-400">{error}</p>}
      {!loading && !error && streams.length === 0 && (
        <p className="py-10 text-center text-sm text-white/40">진행 중인 방송이 없습니다.</p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {streams.map((stream) => <StreamCard key={stream.id} stream={stream} />)}
      </div>
    </main>
  )
}

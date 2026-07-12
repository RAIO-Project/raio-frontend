import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { fetchStreamDetail, type StreamDetail } from '@/entities/stream'
import { ToastHost } from '@/shared'
import { AppHeader } from '@/widgets/layout'
import { LiveRoom } from '@/widgets/stream/live-room'

export function StreamDetailPage() {
  const { streamId } = useParams()
  const navigate = useNavigate()

  const [stream, setStream] = useState<StreamDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!streamId) return
    let alive = true
    setLoading(true)
    setError(null)
    fetchStreamDetail(streamId)
      .then((data) => {
        if (alive) setStream(data)
      })
      .catch(() => {
        if (alive) setError('방송 정보를 불러오지 못했습니다.')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [streamId])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg">
      <AppHeader />
      <div className="border-b border-border bg-bg-2 px-4 py-2 text-xs text-white/40">
        <button onClick={() => navigate('/')} className="hover:text-white">
          ← 홈
        </button>
        <span className="mx-2">/</span>
        <span className="text-white/70">{stream?.title ?? `방송 ${streamId}`}</span>
      </div>

      {loading && (
        <div className="flex flex-1 items-center justify-center text-sm text-white/40">불러오는 중…</div>
      )}
      {error && !loading && (
        <div className="flex flex-1 items-center justify-center text-sm text-red-400">{error}</div>
      )}
      {stream && !loading && !error && <LiveRoom stream={stream} />}

      <ToastHost />
    </div>
  )
}

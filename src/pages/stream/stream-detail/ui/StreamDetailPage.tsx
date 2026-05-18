import { useNavigate, useParams } from 'react-router-dom'

import { findStreamById, useStreamStore } from '@/entities/stream'
import { ToastHost } from '@/shared'
import { AppHeader } from '@/widgets/layout'
import { LiveRoom } from '@/widgets/live-room'
import { PointChargeModal } from '@/widgets/point-charge'

export function StreamDetailPage() {
  const { streamId } = useParams()
  const navigate = useNavigate()
  const streams = useStreamStore((state) => state.streams)
  const stream = findStreamById(streams, streamId) ?? streams[0]

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg">
      <AppHeader />
      <div className="border-b border-border bg-bg-2 px-4 py-2 text-xs text-white/40">
        <button onClick={() => navigate('/')} className="hover:text-white">← 홈</button>
        <span className="mx-2">/</span>
        <span className="text-white/70">{stream.streamerName}</span>
      </div>
      <LiveRoom stream={stream} />
      <PointChargeModal />
      <ToastHost />
    </div>
  )
}

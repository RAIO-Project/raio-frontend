import { useParams, useNavigate } from 'react-router-dom'
import { AppHeader } from '../../../widgets/layout/ui/AppHeader'
import { LiveRoom } from '../../../widgets/live-room/ui/LiveRoom'
import { PointChargeModal } from '../../../widgets/point-charge/ui/PointChargeModal'
import { ToastHost } from '../../../shared/ui/ToastHost'
import { useStreamStore } from '../../../entities/stream/model/streamStore'

export function StreamDetailPage() {
  const { streamId } = useParams()
  const navigate = useNavigate()
  const stream = useStreamStore((state) => state.getStreamById(streamId))
  return <div className="flex h-screen flex-col overflow-hidden bg-bg"><AppHeader /><div className="border-b border-border bg-bg-2 px-4 py-2 text-xs text-white/40"><button onClick={() => navigate('/')} className="hover:text-white">← 홈</button><span className="mx-2">/</span><span className="text-white/70">{stream.streamerName}</span></div><LiveRoom stream={stream} /><PointChargeModal /><ToastHost /></div>
}

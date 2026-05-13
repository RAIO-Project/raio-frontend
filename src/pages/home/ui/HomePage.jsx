import { AppHeader } from '../../../widgets/layout/ui/AppHeader'
import { CategoryBar } from '../../../features/stream-filter/ui/CategoryBar'
import { StreamFeed } from '../../../widgets/stream-feed/ui/StreamFeed'
import { PointChargeModal } from '../../../widgets/point-charge/ui/PointChargeModal'
import { ToastHost } from '../../../shared/ui/ToastHost'

export function HomePage() {
  return <div className="flex h-screen flex-col overflow-hidden bg-bg"><AppHeader /><CategoryBar /><StreamFeed /><PointChargeModal /><ToastHost /></div>
}

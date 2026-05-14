import { CategoryBar } from '@/features/stream-filter'
import { ToastHost } from '@/shared'
import { AppHeader } from '@/widgets/layout'
import { PointChargeModal } from '@/widgets/point-charge'
import { StreamFeed } from '@/widgets/stream-feed'

export function HomePage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg">
      <AppHeader />
      <CategoryBar />
      <StreamFeed />
      <PointChargeModal />
      <ToastHost />
    </div>
  )
}

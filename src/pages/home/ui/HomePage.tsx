import { CategoryBar } from "@/features/stream/stream-filter";
import { ToastHost } from "@/shared";
import { AppHeader } from "@/widgets/layout";
import { StreamFeed } from "@/widgets/stream/stream-feed";

export function HomePage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg">
      <AppHeader />
      <CategoryBar />
      <StreamFeed />
      <ToastHost />
    </div>
  );
}

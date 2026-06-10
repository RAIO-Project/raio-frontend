import { ToastHost } from "@/shared";
import { AppHeader } from "@/widgets/layout";
import { MyPage } from "@/widgets/user/my-page";

export function UserMyPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg">
      <AppHeader />
      <div className="flex-1 overflow-y-auto">
        <MyPage />
      </div>
      <ToastHost />
    </div>
  );
}

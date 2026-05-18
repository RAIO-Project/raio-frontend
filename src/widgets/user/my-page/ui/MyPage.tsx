import { EditProfileForm } from '@/features/user/edit-profile'
import { WalletPanel } from '@/widgets/payment/wallet-panel'

export function MyPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <header>
        <p className="text-sm font-black uppercase tracking-[0.3em] text-accent">
          My Page
        </p>

        <h1 className="mt-2 text-4xl font-black text-white">
          내 정보 및 지갑 관리
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <EditProfileForm />
        <WalletPanel />
      </div>
    </main>
  )
}

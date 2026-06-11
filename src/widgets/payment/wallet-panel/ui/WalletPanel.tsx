import { usePaymentStore } from '@/entities/payment'
import { usePointStore } from '@/features/payment/charge-point'
import { formatPoint } from '@/shared'

export function WalletPanel() {
  const balance = usePaymentStore((state) => state.balance)
  const walletLoading = usePaymentStore((state) => state.walletLoading)
  const openCharge = usePointStore((state) => state.openCharge)

  return (
    <section className="rounded-[2rem] border border-white/10 bg-bg-2 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">보유 포인트</p>
          <h2 className="mt-2 text-3xl font-black text-accent">
            {walletLoading ? '...' : formatPoint(balance)}
          </h2>
        </div>
        <span className="text-3xl text-accent/30">◎</span>
      </div>

      <div className="mt-6">
        <button
          onClick={openCharge}
          className="w-full rounded-2xl bg-accent py-3 text-sm font-black text-black transition hover:opacity-90"
        >
          포인트 충전하기
        </button>
      </div>
    </section>
  )
}

import { usePaymentStore } from '@/entities/payment'
import { ChargePointButton } from '@/features/payment/charge-point'

export function WalletPanel() {
  const wallet = usePaymentStore((state) => state.wallet)

  return (
    <section className="rounded-[2rem] border border-white/10 bg-bg-2 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">보유 포인트</p>

          <h2 className="mt-2 text-3xl font-black text-accent">
            {wallet.point.toLocaleString()}P
          </h2>
        </div>
      </div>

      <div className="mt-6">
        <ChargePointButton />
      </div>
    </section>
  )
}

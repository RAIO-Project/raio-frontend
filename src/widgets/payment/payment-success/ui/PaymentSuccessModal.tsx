import { usePaymentStore } from '@/entities/payment'
import { usePointStore } from '@/features/payment/charge-point'
import { formatPoint } from '@/shared'

export function PaymentSuccessModal() {
  const isSuccessOpen = usePointStore((state) => state.isSuccessOpen)
  const successAmount = usePointStore((state) => state.successAmount)
  const closeSuccess = usePointStore((state) => state.closeSuccess)
  const balance = usePaymentStore((state) => state.balance)

  if (!isSuccessOpen) return null

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && closeSuccess()}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-sm animate-slide-up rounded-[1.6rem] border border-border bg-bg-2 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-4xl text-accent">
          ✓
        </div>
        <h2 className="text-xl font-black text-accent">충전 완료!</h2>
        <p className="mt-2 text-sm text-white/60">
          <span className="font-bold text-white">{formatPoint(successAmount)}</span>이 충전되었습니다.
        </p>
        <p className="mt-1 text-sm text-white/40">
          현재 잔액{' '}
          <span className="font-semibold text-white/70">{formatPoint(balance)}</span>
        </p>
        <button
          onClick={closeSuccess}
          className="mt-6 w-full rounded-2xl bg-accent py-3 text-sm font-black text-black transition hover:opacity-90"
        >
          확인
        </button>
      </div>
    </div>
  )
}

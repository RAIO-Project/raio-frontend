import { usePaymentStore } from '@/entities/payment'

const amounts = [1000, 5000, 10000, 50000]

export function ChargePointButton() {
  const chargePoint = usePaymentStore((state) => state.chargePoint)

  return (
    <div className="grid grid-cols-2 gap-3">
      {amounts.map((amount) => (
        <button
          key={amount}
          onClick={() => chargePoint(amount)}
          className="rounded-2xl border border-white/10 bg-bg-2 px-4 py-3 text-sm font-semibold transition hover:border-accent hover:text-accent"
        >
          {amount.toLocaleString()}P 충전
        </button>
      ))}
    </div>
  )
}

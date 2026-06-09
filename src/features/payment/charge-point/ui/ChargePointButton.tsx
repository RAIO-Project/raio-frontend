import { usePointStore } from '../model/pointStore'

export function ChargePointButton() {
  const openCharge = usePointStore((state) => state.openCharge)

  return (
    <button
      onClick={openCharge}
      className="w-full rounded-2xl border border-white/10 bg-bg-2 px-4 py-3 text-sm font-semibold transition hover:border-accent hover:text-accent"
    >
      포인트 충전하기
    </button>
  )
}

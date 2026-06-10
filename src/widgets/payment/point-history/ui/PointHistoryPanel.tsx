import { useEffect, useState } from 'react'

import { getPointHistories, usePaymentStore } from '@/entities/payment'
import type { PointHistorySummary } from '@/entities/payment'
import { formatPoint } from '@/shared'

const TYPE_LABEL: Record<PointHistorySummary['type'], string> = {
  CHARGE: '충전',
  PAYMENT: '결제',
  REFUND: '환불',
}

const TYPE_COLOR: Record<PointHistorySummary['type'], string> = {
  CHARGE: 'text-accent',
  PAYMENT: 'text-red-400',
  REFUND: 'text-blue-400',
}

const PAGE_SIZE = 10

export function PointHistoryPanel() {
  const walletId = usePaymentStore((state) => state.walletId)
  const [histories, setHistories] = useState<PointHistorySummary[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!walletId) return
    setLoading(true)
    getPointHistories(walletId, page, PAGE_SIZE)
      .then((data) => {
        setHistories(data.content)
        setTotalElements(data.totalElements)
      })
      .finally(() => setLoading(false))
  }, [walletId, page])

  const totalPages = Math.ceil(totalElements / PAGE_SIZE)

  return (
    <section className="rounded-[2rem] border border-white/10 bg-bg-2 p-6">
      <h2 className="mb-4 text-base font-black">포인트 내역</h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      ) : histories.length === 0 ? (
        <p className="py-10 text-center text-sm text-white/30">포인트 내역이 없습니다.</p>
      ) : (
        <>
          <ul className="divide-y divide-white/5">
            {histories.map((h) => (
              <li key={h.id} className="flex items-center justify-between py-3.5">
                <div>
                  <span className={`text-xs font-bold ${TYPE_COLOR[h.type]}`}>
                    {TYPE_LABEL[h.type]}
                  </span>
                  <p className="mt-0.5 text-xs text-white/35">
                    {new Date(h.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${h.type === 'PAYMENT' ? 'text-red-400' : 'text-accent'}`}>
                    {h.type === 'PAYMENT' ? '−' : '+'}{formatPoint(h.amount)}
                  </p>
                  <p className="mt-0.5 text-xs text-white/35">잔액 {formatPoint(h.balanceSnapshot)}</p>
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-xl px-3 py-1.5 text-xs font-bold text-white/40 transition hover:text-white disabled:opacity-25"
              >
                이전
              </button>
              <span className="text-xs text-white/40">
                {page + 1} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl px-3 py-1.5 text-xs font-bold text-white/40 transition hover:text-white disabled:opacity-25"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

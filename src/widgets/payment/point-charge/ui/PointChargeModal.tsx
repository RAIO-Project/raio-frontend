import { useEffect, useMemo, useRef, useState } from 'react'

import { preparePayment, usePaymentStore } from '@/entities/payment'
import { usePointStore } from '@/features/payment/charge-point'
import { useUserStore } from '@/features/user'
import { formatPoint, showToast } from '@/shared'

interface ChargeOption {
  amount: number
  bonus?: number
  label?: string
}

const CHARGE_OPTIONS: ChargeOption[] = [
  { amount: 3_000 },
  { amount: 6_000 },
  { amount: 9_000, bonus: 1_000, label: '이달 EVENT!' },
  { amount: 15_000, bonus: 2_000, label: '적립' },
  { amount: 30_000, bonus: 4_500, label: '적립' },
]

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY as string

export function PointChargeModal() {
  const isOpen = usePointStore((state) => state.isOpen)
  const closeModal = usePointStore((state) => state.closeModal)
  const balance = usePaymentStore((state) => state.balance)
  const user = useUserStore((state) => state.user)

  const [selected, setSelected] = useState<ChargeOption>(CHARGE_OPTIONS[2])
  const [eventCash, setEventCash] = useState(true)
  const [loading, setLoading] = useState(false)
  const [widgetReady, setWidgetReady] = useState(false)

  const widgetsRef = useRef<TossWidgets | null>(null)

  const totalPoint = useMemo(
    () => selected.amount + (eventCash ? (selected.bonus ?? 0) : 0),
    [eventCash, selected],
  )

  // 유저 준비 시 위젯을 한 번만 초기화 — 모달 열림과 무관하게 백그라운드에서 선로드
  useEffect(() => {
    if (!user || !CLIENT_KEY || widgetsRef.current) return

    const tossPayments = window.TossPayments(CLIENT_KEY)
    const widgets = tossPayments.widgets({ customerKey: `user-${user.id}` })
    widgetsRef.current = widgets

    ;(async () => {
      try {
        await widgets.setAmount({ value: CHARGE_OPTIONS[2].amount, currency: 'KRW' })
        // 두 위젯 병렬 렌더
        await Promise.all([
          widgets.renderPaymentMethods({ selector: '#toss-payment-methods', variantKey: 'DEFAULT' }),
          widgets.renderAgreement({ selector: '#toss-agreement', variantKey: 'AGREEMENT' }),
        ])
        setWidgetReady(true)
      } catch {
        showToast('결제 위젯을 불러오지 못했습니다.', 'error')
      }
    })()
  }, [user])

  // 금액 변경 시 위젯 금액 동기화
  useEffect(() => {
    if (!widgetReady || !widgetsRef.current) return
    void widgetsRef.current.setAmount({ value: selected.amount, currency: 'KRW' })
  }, [selected.amount, widgetReady])

  const handlePayment = async () => {
    if (!user || !CLIENT_KEY || !widgetsRef.current) return

    setLoading(true)
    try {
      const prepared = await preparePayment({
        userId: user.id,
        amount: selected.amount,
        method: 'EASY_PAY',
        pgProvider: 'TOSS',
      })

      localStorage.setItem(`toss:${prepared.orderId}`, prepared.paymentId)

      await widgetsRef.current.requestPayment({
        orderId: prepared.orderId,
        orderName: '포인트 충전',
        customerName: user.nickname || user.email,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      })
      // requestPayment 는 리다이렉트이므로 이하 실행 안 됨
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code
      if (code !== 'PAY_PROCESS_CANCELED') {
        showToast('결제 요청에 실패했습니다. 다시 시도해주세요.', 'error')
      }
      setLoading(false)
    }
  }

  // DOM을 유지해 위젯 iframe을 살려두고, CSS transition으로 show/hide
  return (
    <div
      onClick={(event) => event.target === event.currentTarget && closeModal()}
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-[opacity,backdrop-filter] duration-200 ${
        isOpen
          ? 'bg-black/70 opacity-100 backdrop-blur-sm [pointer-events:auto]'
          : 'opacity-0 [pointer-events:none]'
      }`}
      aria-hidden={!isOpen}
    >
      <section
        className={`relative max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-[1.6rem] border border-border bg-white text-[#202124] shadow-2xl transition-[transform,opacity] duration-200 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-center border-b border-black/10 bg-white/95 px-5 py-3 backdrop-blur">
          <h2 className="text-xl font-black">캐시 충전</h2>
          <button
            onClick={closeModal}
            className="absolute right-4 top-2.5 text-2xl leading-none text-black/75 hover:text-black"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className="space-y-5 p-5">
          {/* 보유 캐시 */}
          <div className="flex items-center justify-between rounded-xl bg-black/[0.02] px-4 py-4 text-sm">
            <span className="text-black/60">보유 캐시</span>
            <strong>{formatPoint(balance)}</strong>
          </div>

          {/* 충전 금액 선택 */}
          <div>
            <div className="mb-3 flex items-center justify-between border-b border-black/10 pb-3">
              <div className="flex items-center gap-2 text-lg font-bold">
                <span className="text-2xl">◎</span>
                결제 금액
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-black/70">
                <input
                  checked={eventCash}
                  onChange={(event) => setEventCash(event.target.checked)}
                  type="checkbox"
                  className="h-4 w-4 accent-[#ef6461]"
                />
                이벤트 캐시 받기
              </label>
            </div>
            <div className="grid grid-cols-2 gap-x-7 gap-y-4">
              {CHARGE_OPTIONS.map((option) => {
                const active = selected.amount === option.amount
                return (
                  <button
                    key={option.amount}
                    onClick={() => setSelected(option)}
                    className="flex min-h-9 items-center gap-3 text-left text-sm"
                  >
                    <span
                      className={`h-6 w-6 shrink-0 rounded-full border-2 ${active ? 'border-[#ef6461]' : 'border-black/20'}`}
                    >
                      {active && <span className="m-1 block h-3.5 w-3.5 rounded-full bg-[#ef6461]" />}
                    </span>
                    <span className="font-medium">
                      {formatPoint(option.amount)}
                      {option.bonus ? (
                        <span className="ml-1 font-black text-[#ef6461]">
                          + {formatPoint(option.bonus)} {option.label}
                        </span>
                      ) : null}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Toss 결제 위젯 영역 */}
          <div>
            {!widgetReady && (
              <div className="flex min-h-[180px] items-center justify-center rounded-2xl bg-black/[0.02]">
                <div className="flex items-center gap-2 text-sm text-black/30">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black/60" />
                  결제 수단 불러오는 중
                </div>
              </div>
            )}
            <div id="toss-payment-methods" />
            <div id="toss-agreement" />
          </div>

          {/* 충전 요약 */}
          <div className="space-y-1 text-sm text-black/60">
            <div className="flex justify-between">
              <span>결제 금액</span>
              <strong className="text-black">{formatPoint(selected.amount)}</strong>
            </div>
            {eventCash && (selected.bonus ?? 0) > 0 && (
              <div className="flex justify-between text-[#ef6461]">
                <span>이벤트 캐시</span>
                <strong>+ {formatPoint(selected.bonus ?? 0)}</strong>
              </div>
            )}
            <div className="flex justify-between border-t border-black/10 pt-2 font-bold text-black">
              <span>충전 캐시</span>
              <span>{formatPoint(totalPoint)}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading || !widgetReady}
            className="w-full rounded-2xl bg-[#2468ff] py-4 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? '결제 요청 중...' : `${formatPoint(selected.amount)} 결제하기`}
          </button>
        </div>
      </section>
    </div>
  )
}

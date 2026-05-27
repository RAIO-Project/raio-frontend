import { useMemo, useState } from 'react'

import { formatPoint, showToast } from '@/shared'
import { usePointStore } from '@/widgets/payment/point-charge'

interface ChargeOption {
  amount: number
  bonus?: number
  label?: string
}

const CHARGE_OPTIONS: ChargeOption[] = [
  { amount: 3000 },
  { amount: 6000 },
  { amount: 9000, bonus: 1000, label: '이달 EVENT!' },
  { amount: 30000, bonus: 4500, label: '적립' },
  { amount: 15000, bonus: 2000, label: '적립' },
]

const PAYMENT_METHODS = [
  '퀵계좌이체',
  '카카오페이',
  '토스',
  '신용카드',
  '핸드폰 결제',
  'Paypal',
  '무통장입금',
  '상품권',
] as const

type PaymentMethod = (typeof PAYMENT_METHODS)[number]

export function PointChargeModal() {
  const isOpen = usePointStore((state) => state.isOpen)
  const closeModal = usePointStore((state) => state.closeModal)
  const addPoint = usePointStore((state) => state.addPoint)
  const balance = usePointStore((state) => state.balance)
  const [selected, setSelected] = useState<ChargeOption>(CHARGE_OPTIONS[2])
  const [method, setMethod] = useState<PaymentMethod>('토스')
  const [eventCash, setEventCash] = useState(true)
  const [agreed, setAgreed] = useState(false)
  const [paymentPopup, setPaymentPopup] = useState(false)
  const [processing, setProcessing] = useState(false)

  const totalPoint = useMemo(
    () => selected.amount + (eventCash ? selected.bonus ?? 0 : 0),
    [eventCash, selected],
  )

  if (!isOpen) return null

  const requestPayment = () => {
    if (!agreed) {
      showToast('이용 약관에 동의해주세요.', 'error')
      return
    }
    setPaymentPopup(true)
  }

  const approvePayment = async () => {
    setProcessing(true)
    await new Promise((resolve) => window.setTimeout(resolve, 650))
    addPoint(totalPoint)
    showToast(`${formatPoint(totalPoint)} 충전 완료`, 'success')
    setProcessing(false)
    setPaymentPopup(false)
    closeModal()
  }

  return (
    <div
      onClick={(event) => event.target === event.currentTarget && closeModal()}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <section className="relative max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-[1.6rem] border border-border bg-white text-[#202124] shadow-2xl animate-slide-up">
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
          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-black/[0.02] px-4 py-4">
              <span className="text-black/60">보유 캐시</span>
              <strong>{formatPoint(balance)}</strong>
              <button className="text-black/65 hover:text-black">사용 내역</button>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-black/[0.02] px-4 py-4">
              <span className="text-black/60">자동충전</span>
              <strong>OFF</strong>
              <button className="text-black/65 hover:text-black">변경하기</button>
            </div>
          </div>

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
                    <span className={`h-6 w-6 rounded-full border-2 ${active ? 'border-[#ef6461]' : 'border-black/20'}`}>
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

          <div>
            <div className="mb-3 flex items-center gap-2 border-b border-black/10 pb-3 text-lg font-bold">
              <span className="text-2xl">▣</span>
              결제 수단
            </div>
            <div className="grid grid-cols-2 gap-x-7 gap-y-4">
              {PAYMENT_METHODS.map((name) => {
                const active = method === name
                return (
                  <button
                    key={name}
                    onClick={() => setMethod(name)}
                    className="flex min-h-7 items-center gap-3 text-left text-sm text-black/75"
                  >
                    <span className={`h-6 w-6 rounded-full border-2 ${active ? 'border-[#ef6461]' : 'border-black/20'}`}>
                      {active && <span className="m-1 block h-3.5 w-3.5 rounded-full bg-[#ef6461]" />}
                    </span>
                    <span className="font-medium">
                      {name}
                      {name === '토스' && <span className="ml-2 rounded-full bg-[#2468ff] px-1.5 py-0.5 text-[10px] font-black text-white">toss</span>}
                      {name === '카카오페이' && <span className="ml-2 rounded-full bg-[#ffe500] px-1.5 py-0.5 text-[10px] font-black text-black">pay</span>}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <label className="block rounded-xl border border-black/15 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3 text-sm font-medium text-black/65">
                <input
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                  type="checkbox"
                  className="h-5 w-5 accent-[#ef6461]"
                />
                이용 약관에 동의합니다.
              </span>
              <span>⌃</span>
            </div>
            <div className="mt-3 max-h-24 overflow-y-auto rounded bg-black/[0.03] p-3 text-xs leading-6 text-black/60">
              <p className="font-bold">제 1 조 (캐시)</p>
              <p>캐시는 서비스 내 콘텐츠 구매 또는 후원에 사용할 수 있는 전자적 지급수단입니다.</p>
              <p>충전은 PC 및 모바일 웹에서 가능하며, 결제 완료 후 즉시 보유 캐시에 반영됩니다.</p>
            </div>
          </label>

          <button
            onClick={requestPayment}
            className="w-full rounded-2xl bg-[#ef6461] py-4 text-sm font-black text-white transition hover:opacity-90"
          >
            {formatPoint(selected.amount)} 결제하고 {formatPoint(totalPoint)} 충전하기
          </button>
        </div>
      </section>

      {paymentPopup && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center bg-black/60 p-5">
          <div className="w-full max-w-sm rounded-[1.5rem] bg-white p-6 text-[#202124] shadow-2xl">
            <div className="mb-5 rounded-2xl bg-[#f2f6ff] p-4">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#2468ff]">Toss Payments</p>
              <h3 className="mt-2 text-xl font-black">결제 요청 확인</h3>
              <p className="mt-1 text-sm text-black/55">실제 연동 시 이 영역에서 토스페이먼츠 결제창을 호출합니다.</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-black/50">결제수단</span><strong>{method}</strong></div>
              <div className="flex justify-between"><span className="text-black/50">결제금액</span><strong>{formatPoint(selected.amount)}</strong></div>
              <div className="flex justify-between"><span className="text-black/50">충전캐시</span><strong>{formatPoint(totalPoint)}</strong></div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button onClick={() => setPaymentPopup(false)} className="rounded-xl border border-black/10 py-3 text-sm font-bold text-black/60">취소</button>
              <button onClick={approvePayment} disabled={processing} className="rounded-xl bg-[#2468ff] py-3 text-sm font-black text-white disabled:opacity-50">
                {processing ? '결제 중...' : '결제 승인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

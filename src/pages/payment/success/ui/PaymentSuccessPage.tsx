import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { confirmPayment, usePaymentStore } from '@/entities/payment'
import { useUserStore } from '@/features/user'
import { showToast } from '@/shared'

type Status = 'confirming' | 'done' | 'error'

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const user = useUserStore((state) => state.user)
  const loadWallet = usePaymentStore((state) => state.loadWallet)
  const [status, setStatus] = useState<Status>('confirming')
  const [errorMsg, setErrorMsg] = useState('')
  const calledRef = useRef(false) // StrictMode 이중 실행 방지

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    const paymentKey = searchParams.get('paymentKey') ?? ''
    const orderId = searchParams.get('orderId') ?? ''
    const amount = Number(searchParams.get('amount') ?? '0')
    const paymentId = sessionStorage.getItem(`toss:${orderId}`) ?? ''

    if (!paymentKey || !orderId || !amount || !paymentId) {
      setStatus('error')
      setErrorMsg('결제 정보가 올바르지 않습니다.')
      return
    }

    confirmPayment({ paymentId, paymentKey, orderId, amount })
      .then(async () => {
        sessionStorage.removeItem(`toss:${orderId}`)
        if (user) await loadWallet(user.id)
        setStatus('done')
        showToast('포인트 충전이 완료되었습니다.', 'success')
        setTimeout(() => navigate('/'), 1500)
      })
      .catch(() => {
        setStatus('error')
        setErrorMsg('결제 승인에 실패했습니다. 고객센터에 문의해주세요.')
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-bg p-8 text-center">
      {status === 'confirming' && (
        <>
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <p className="text-sm text-white/60">결제를 확인하는 중입니다…</p>
        </>
      )}

      {status === 'done' && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-4xl">
            ✓
          </div>
          <div>
            <p className="text-xl font-black text-accent">충전 완료!</p>
            <p className="mt-1 text-sm text-white/50">잠시 후 홈으로 이동합니다.</p>
          </div>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-4xl">
            ✕
          </div>
          <div>
            <p className="text-xl font-black text-red-400">결제 실패</p>
            <p className="mt-1 text-sm text-white/50">{errorMsg}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="rounded-xl bg-accent px-6 py-3 text-sm font-black text-black"
          >
            홈으로 돌아가기
          </button>
        </>
      )}
    </div>
  )
}

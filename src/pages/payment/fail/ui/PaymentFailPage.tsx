import { useNavigate, useSearchParams } from 'react-router-dom'

export function PaymentFailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const code = searchParams.get('code') ?? ''
  const message = searchParams.get('message') ?? '알 수 없는 오류가 발생했습니다.'

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-bg p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-4xl">
        ✕
      </div>
      <div>
        <p className="text-xl font-black text-red-400">결제가 취소되었습니다</p>
        <p className="mt-2 text-sm text-white/50">{message}</p>
        {code && <p className="mt-1 text-xs text-white/25">코드: {code}</p>}
      </div>
      <button
        onClick={() => navigate('/')}
        className="rounded-xl bg-accent px-6 py-3 text-sm font-black text-black"
      >
        홈으로 돌아가기
      </button>
    </div>
  )
}

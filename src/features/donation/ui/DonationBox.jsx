import { useState } from 'react'
import { useAuthStore } from '../../auth/model/authStore'
import { usePointStore } from '../../../widgets/point-charge/ui/pointStore'
import { showToast } from '../../../shared/model/toastStore'
import { formatPoint } from '../../../shared/lib/format'

const AMOUNTS = [100, 500, 1000, 5000]

export function DonationBox({ onDonate }) {
  const token = useAuthStore((state) => state.token)
  const { balance, spendPoint, openModal } = usePointStore()
  const [amount, setAmount] = useState(500)
  const [message, setMessage] = useState('')

  const donate = () => {
    if (!token) return showToast('후원하려면 로그인이 필요합니다.', 'info')
    if (balance < amount) { openModal(); return showToast('포인트가 부족합니다.', 'error') }
    spendPoint(amount)
    onDonate?.(amount, message)
    setMessage('')
    showToast(`${formatPoint(amount)} 후원 완료`, 'success')
  }

  return (
    <section className="rounded-[2rem] border border-accent-2/20 bg-bg-2 p-5">
      <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-black">후원하기</h3><span className="text-xs text-white/40">보유 {formatPoint(balance)}</span></div>
      <div className="grid grid-cols-4 gap-2">{AMOUNTS.map((item) => <button key={item} onClick={() => setAmount(item)} className={`rounded-xl border py-2 text-xs font-black ${amount === item ? 'border-accent-2 bg-accent-2/10 text-accent-2' : 'border-border bg-bg-3 text-white/45'}`}>{formatPoint(item)}</button>)}</div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, 100))} className="mt-3 h-20 w-full resize-none rounded-2xl border border-border bg-bg-3 p-3 text-sm outline-none placeholder:text-white/25 focus:border-accent-2/40" placeholder="응원 메시지" />
      <button onClick={donate} className="mt-3 w-full rounded-2xl bg-gradient-to-r from-accent-2 to-rose-600 py-3 text-sm font-black text-white">💝 {formatPoint(amount)} 후원하기</button>
    </section>
  )
}

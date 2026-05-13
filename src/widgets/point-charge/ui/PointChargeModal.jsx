import { useState } from 'react'
import { usePointStore } from './pointStore'
import { showToast } from '../../../shared/model/toastStore'
import { formatPoint } from '../../../shared/lib/format'

const OPTIONS = [1000, 3000, 5500, 11000, 33000]

export function PointChargeModal() {
  const { isOpen, closeModal, addPoint, balance } = usePointStore()
  const [selected, setSelected] = useState(11000)
  if (!isOpen) return null

  const charge = () => {
    addPoint(selected)
    showToast(`${formatPoint(selected)} 충전 완료`, 'success')
    closeModal()
  }

  return (
    <div onClick={(e) => e.target === e.currentTarget && closeModal()} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border border-border bg-bg-2 p-6 shadow-2xl animate-slide-up">
        <div className="mb-5 flex items-start justify-between">
          <div><h2 className="text-lg font-black">포인트 충전</h2><p className="mt-1 text-xs text-white/40">현재 보유 {formatPoint(balance)}</p></div>
          <button onClick={closeModal} className="text-white/35 hover:text-white">✕</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {OPTIONS.map((point) => <button key={point} onClick={() => setSelected(point)} className={`rounded-2xl border p-3 text-sm font-black ${selected === point ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-bg-3 text-white/55'}`}>{formatPoint(point)}</button>)}
        </div>
        <button onClick={charge} className="mt-5 w-full rounded-2xl bg-accent py-3.5 text-sm font-black text-black">{formatPoint(selected)} 충전하기</button>
        <p className="mt-3 text-center text-[10px] leading-relaxed text-white/25">실결제 연동 전까지는 mock 충전으로 동작합니다.</p>
      </div>
    </div>
  )
}

import { useState } from 'react'

import { UserForm } from '@/features/user'
import { usePointStore } from '@/features/payment/charge-point'

type AuthMode = 'login' | 'register'

export function AuthGateModal() {
  const isAuthOpen = usePointStore((state) => state.isAuthOpen)
  const closeAuth = usePointStore((state) => state.closeAuth)
  const openCharge = usePointStore((state) => state.openCharge)
  const [mode, setMode] = useState<AuthMode>('login')

  if (!isAuthOpen) return null

  const handleSuccess = () => {
    closeAuth()
    openCharge()
  }

  return (
    <div
      onClick={(event) => event.target === event.currentTarget && closeAuth()}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md animate-slide-up">
        <button
          onClick={closeAuth}
          className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-3 text-white/50 shadow-xl hover:text-white"
          aria-label="닫기"
        >
          ✕
        </button>
        <UserForm
          mode={mode}
          compact
          onSuccess={handleSuccess}
          onModeChange={setMode}
        />
      </div>
    </div>
  )
}

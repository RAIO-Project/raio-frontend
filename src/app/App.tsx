import { useEffect } from 'react'

import { usePaymentStore } from '@/entities/payment'
import { useUserStore } from '@/features/user'

import { RouterProvider } from './providers/RouterProvider'

export default function App() {
  const user = useUserStore((state) => state.user)
  const loadWallet = usePaymentStore((state) => state.loadWallet)

  // localStorage에서 세션이 복원된 경우(새로고침·재접속 등)에도 지갑 잔액을 다시 불러온다.
  useEffect(() => {
    if (user) void loadWallet(user.id)
  }, [user, loadWallet])

  return <RouterProvider />
}

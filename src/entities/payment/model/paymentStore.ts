import { create } from 'zustand'
import { getWallet } from '../api/paymentApi'

interface PaymentState {
  walletId: string | null
  balance: number
  walletLoading: boolean
  loadWallet: (userId: string) => Promise<void>
  deductBalance: (amount: number) => boolean
  clear: () => void
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  walletId: null,
  balance: 0,
  walletLoading: false,

  /** 로그인 후 지갑 조회. 없으면 생성. */
  loadWallet: async (userId) => {
    set({ walletLoading: true })
    try {
      const wallet = await getWallet(userId)
      set({ walletId: wallet.id, balance: wallet.balance })
    } catch {
      // 네트워크 에러 시 기존 잔액 유지
    } finally {
      set({ walletLoading: false })
    }
  },

  /** 도네이션 등 낙관적 차감 (백엔드 미연동 구간용) */
  deductBalance: (amount) => {
    if (get().balance < amount) return false
    set((state) => ({ balance: state.balance - amount }))
    return true
  },

  clear: () => set({ walletId: null, balance: 0, walletLoading: false }),
}))

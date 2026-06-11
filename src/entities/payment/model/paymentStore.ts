import { create } from 'zustand'
import { createWallet, getWallet } from '../api/paymentApi'

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

  loadWallet: async (userId) => {
    set({ walletLoading: true })
    try {
      const wallet = await getWallet(userId)
      set({ walletId: wallet.id, balance: wallet.balance })
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 404) {
        // 지갑 없는 신규 유저 — 자동 생성
        try {
          const wallet = await createWallet(userId)
          set({ walletId: wallet.id, balance: wallet.balance })
        } catch {
          // 생성 실패 시 기존 상태 유지
        }
      }
      // 그 외 네트워크 오류는 기존 잔액 유지
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

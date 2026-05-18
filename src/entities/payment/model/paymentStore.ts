import { create } from 'zustand'
import type { Wallet, PointHistory } from './paymentTypes'

interface PaymentState {
  wallet: Wallet
  histories: PointHistory[]
  chargePoint: (amount: number) => void
}

export const usePaymentStore = create<PaymentState>((set) => ({
  wallet: {
    point: 50000,
    updatedAt: new Date().toISOString(),
  },

  histories: [],

  chargePoint: (amount) =>
    set((state) => ({
      wallet: {
        point: state.wallet.point + amount,
        updatedAt: new Date().toISOString(),
      },

      histories: [
        {
          id: crypto.randomUUID(),
          type: 'CHARGE',
          amount,
          createdAt: new Date().toISOString(),
          description: '포인트 충전',
        },
        ...state.histories,
      ],
    })),
}))

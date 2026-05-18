import { create } from 'zustand'

interface PointState {
  balance: number
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
  addPoint: (amount: number) => void
  spendPoint: (amount: number) => boolean
}

export const usePointStore = create<PointState>((set, get) => ({
  balance: 35000,
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  addPoint: (amount) => set((state) => ({ balance: state.balance + amount })),
  spendPoint: (amount) => {
    if (get().balance < amount) return false
    set((state) => ({ balance: state.balance - amount }))
    return true
  },
}))

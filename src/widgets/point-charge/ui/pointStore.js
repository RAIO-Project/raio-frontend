import { create } from 'zustand'

export const usePointStore = create((set) => ({
  balance: 12400,
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  addPoint: (amount) => set((state) => ({ balance: state.balance + amount })),
  spendPoint: (amount) => set((state) => ({ balance: Math.max(0, state.balance - amount) })),
}))

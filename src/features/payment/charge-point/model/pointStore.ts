import { create } from 'zustand'

type PointModal = 'closed' | 'auth' | 'charge'

interface PointState {
  balance: number
  modal: PointModal
  isOpen: boolean
  isAuthOpen: boolean
  openModal: () => void
  openAuth: () => void
  openCharge: () => void
  closeModal: () => void
  closeAuth: () => void
  addPoint: (amount: number) => void
  spendPoint: (amount: number) => boolean
}

export const usePointStore = create<PointState>((set, get) => ({
  balance: 2300,
  modal: 'closed',
  isOpen: false,
  isAuthOpen: false,
  openModal: () => set({ modal: 'charge', isOpen: true, isAuthOpen: false }),
  openAuth: () => set({ modal: 'auth', isOpen: false, isAuthOpen: true }),
  openCharge: () => set({ modal: 'charge', isOpen: true, isAuthOpen: false }),
  closeModal: () => set({ modal: 'closed', isOpen: false, isAuthOpen: false }),
  closeAuth: () => set({ modal: 'closed', isOpen: false, isAuthOpen: false }),
  addPoint: (amount) => set((state) => ({ balance: state.balance + amount })),
  spendPoint: (amount) => {
    if (get().balance < amount) return false
    set((state) => ({ balance: state.balance - amount }))
    return true
  },
}))

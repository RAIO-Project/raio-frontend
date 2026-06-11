import { create } from 'zustand'

interface PointModalState {
  isOpen: boolean
  isAuthOpen: boolean
  isSuccessOpen: boolean
  successAmount: number
  openCharge: () => void
  openAuth: () => void
  closeModal: () => void
  closeAuth: () => void
  openSuccess: (amount: number) => void
  closeSuccess: () => void
}

export const usePointStore = create<PointModalState>((set) => ({
  isOpen: false,
  isAuthOpen: false,
  isSuccessOpen: false,
  successAmount: 0,
  openCharge: () => set({ isOpen: true, isAuthOpen: false }),
  openAuth: () => set({ isOpen: false, isAuthOpen: true }),
  closeModal: () => set({ isOpen: false }),
  closeAuth: () => set({ isAuthOpen: false }),
  openSuccess: (amount) => set({ isSuccessOpen: true, successAmount: amount }),
  closeSuccess: () => set({ isSuccessOpen: false, successAmount: 0 }),
}))

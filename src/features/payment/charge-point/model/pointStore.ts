import { create } from 'zustand'

interface PointModalState {
  isOpen: boolean
  isAuthOpen: boolean
  openCharge: () => void
  openAuth: () => void
  closeModal: () => void
  closeAuth: () => void
}

export const usePointStore = create<PointModalState>((set) => ({
  isOpen: false,
  isAuthOpen: false,
  openCharge: () => set({ isOpen: true, isAuthOpen: false }),
  openAuth: () => set({ isOpen: false, isAuthOpen: true }),
  closeModal: () => set({ isOpen: false }),
  closeAuth: () => set({ isAuthOpen: false }),
}))

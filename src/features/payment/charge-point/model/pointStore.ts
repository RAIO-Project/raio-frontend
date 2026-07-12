import { create } from 'zustand'

/** 로그인 게이트를 연 이유. 로그인 성공 후 이어질 동작을 결정한다. */
type AuthPurpose = 'charge' | 'none'

interface PointModalState {
  isOpen: boolean
  isAuthOpen: boolean
  authPurpose: AuthPurpose
  isSuccessOpen: boolean
  successAmount: number
  openCharge: () => void
  openAuth: (purpose?: AuthPurpose) => void
  closeModal: () => void
  closeAuth: () => void
  openSuccess: (amount: number) => void
  closeSuccess: () => void
}

export const usePointStore = create<PointModalState>((set) => ({
  isOpen: false,
  isAuthOpen: false,
  authPurpose: 'none',
  isSuccessOpen: false,
  successAmount: 0,
  openCharge: () => set({ isOpen: true, isAuthOpen: false }),
  // purpose 를 주지 않으면 로그인만 하고 끝난다 (채팅·후원 등 현재 화면에 머무는 경우)
  openAuth: (purpose = 'none') => set({ isOpen: false, isAuthOpen: true, authPurpose: purpose }),
  closeModal: () => set({ isOpen: false }),
  closeAuth: () => set({ isAuthOpen: false, authPurpose: 'none' }),
  openSuccess: (amount) => set({ isSuccessOpen: true, successAmount: amount }),
  closeSuccess: () => set({ isSuccessOpen: false, successAmount: 0 }),
}))
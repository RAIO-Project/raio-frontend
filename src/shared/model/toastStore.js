import { create } from 'zustand'

export const useToastStore = create((set) => ({
  toasts: [],
  pushToast: (message, type = 'info') => {
    const toast = { id: `${Date.now()}-${Math.random()}`, message, type }
    set((state) => ({ toasts: [...state.toasts, toast] }))
    window.setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((item) => item.id !== toast.id) }))
    }, 3000)
  },
}))

export function showToast(message, type = 'info') {
  useToastStore.getState().pushToast(message, type)
}

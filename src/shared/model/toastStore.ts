import { create } from 'zustand'

export type ToastType = 'info' | 'success' | 'error'
export interface Toast { id: string; message: string; type: ToastType }
interface ToastState { toasts: Toast[]; pushToast: (message: string, type?: ToastType) => void; removeToast: (id: string) => void }

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  pushToast: (message, type = 'info') => {
    const id = crypto.randomUUID()
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
    window.setTimeout(() => set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })), 2600)
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })),
}))

export function showToast(message: string, type: ToastType = 'info'): void {
  useToastStore.getState().pushToast(message, type)
}

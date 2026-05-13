import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => Boolean(get().token),
    }),
    {
      name: 'raio-auth-v2',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)

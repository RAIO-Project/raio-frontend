import { create } from 'zustand'

import type { User } from '@/entities/user'

const ACCESS_TOKEN_KEY = 'raio.accessToken'
const REFRESH_TOKEN_KEY = 'raio.refreshToken'
const USER_KEY = 'raio.user'

interface UserState {
  user: User | null
  token: string | null
  refreshToken: string | null
  setSession: (user: User, accessToken: string, refreshToken: string) => void
  updateTokens: (accessToken: string, refreshToken: string) => void
  logout: () => void
}

function readUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export const useUserStore = create<UserState>((set) => ({
  user: readUser(),
  token: localStorage.getItem(ACCESS_TOKEN_KEY),
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  setSession: (user, accessToken, refreshToken) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    set({ user, token: accessToken, refreshToken })
  },
  updateTokens: (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    set({ token: accessToken, refreshToken })
  },
  logout: () => {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    set({ user: null, token: null, refreshToken: null })
  },
}))

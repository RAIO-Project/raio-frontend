import { create } from 'zustand'

import type { User } from '@/entities/user'

const TOKEN_KEY = 'raio.accessToken'
const USER_KEY = 'raio.user'

interface UserState {
  user: User | null
  token: string | null
  setSession: (user: User, token: string) => void
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
  token: localStorage.getItem(TOKEN_KEY),
  setSession: (user, token) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.setItem(TOKEN_KEY, token)
    set({ user, token })
  },
  logout: () => {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
    set({ user: null, token: null })
  },
}))

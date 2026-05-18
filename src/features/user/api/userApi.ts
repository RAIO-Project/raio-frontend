import { httpClient } from '@/shared'
import type { LoginRequest, RegisterRequest, TokenPairResponse, User, UserRole, UserSession } from '@/entities/user'

function buildUserFromToken(accessToken: string, email: string): User {
  const payload = JSON.parse(atob(accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) as {
    sub: string
    roles?: string[]
  }
  return {
    id: String(payload.sub),
    email,
    nickname: '',
    phoneNumber: '',
    role: (payload.roles?.[0] ?? 'USER') as UserRole,
    status: 'ACTIVE',
    lastLoginAt: null,
  }
}

export async function loginUser(payload: LoginRequest): Promise<UserSession> {
  const { data } = await httpClient.post<TokenPairResponse>('/auth/login', payload)
  return {
    user: buildUserFromToken(data.accessToken, payload.email),
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  }
}

export async function registerUser(payload: RegisterRequest): Promise<UserSession> {
  await httpClient.post('/auth/register', payload)
  return loginUser({ email: payload.email, password: payload.password })
}

export async function logoutUser(): Promise<void> {
  await httpClient.post('/auth/logout')
}

export async function refreshTokens(refreshToken: string): Promise<TokenPairResponse> {
  const { data } = await httpClient.post<TokenPairResponse>('/auth/refresh', { refreshToken })
  return data
}

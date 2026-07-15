import { httpClient } from '@/shared'
import type { LoginRequest, RegisterRequest, TokenPairResponse, User, UserRole, UserSession } from '@/entities/user'

function buildUserFromToken(
  accessToken: string,
  email: string,
  overrides?: Partial<Pick<User, 'nickname'>>,
): User {
  const raw = accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  const payload = JSON.parse(atob(raw)) as {
    sub: string
    roles?: string[]
    nickName?: string
  }
  return {
    id: String(payload.sub),
    email,
    nickname: overrides?.nickname ?? payload.nickName ?? '',
    phoneNumber: '',
    role: (payload.roles?.[0] ?? 'USER') as UserRole,
    status: 'ACTIVE',
    lastLoginAt: null,
  }
}

export async function loginUser(
  payload: LoginRequest,
  overrides?: Partial<Pick<User, 'nickname'>>,
): Promise<UserSession> {
  const { data } = await httpClient.post<TokenPairResponse>('/auth/login', payload)
  return {
    user: buildUserFromToken(data.accessToken, payload.email, overrides),
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  }
}

export async function registerUser(payload: RegisterRequest): Promise<UserSession> {
  await httpClient.post<number>('/auth/register', payload)
  return loginUser({ email: payload.email, password: payload.password }, { nickname: payload.nickname })
}

export async function logoutUser(): Promise<void> {
  await httpClient.post('/auth/logout')
}

export async function refreshTokens(refreshToken: string): Promise<TokenPairResponse> {
  const { data } = await httpClient.post<TokenPairResponse>('/auth/refresh', { refreshToken })
  return data
}

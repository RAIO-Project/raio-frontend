export type UserRole = 'USER' | 'ADMIN'
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'REMOVED'

export interface User {
  id: string
  email: string
  nickname: string
  phoneNumber: string
  role: UserRole
  status: UserStatus
  lastLoginAt: string | null
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest extends LoginRequest {
  nickname: string
  phoneNumber: string
}

export interface TokenPairResponse {
  accessToken: string
  refreshToken: string
}

export interface UserSession {
  user: User
  accessToken: string
  refreshToken: string
}

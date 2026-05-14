export type UserRole = 'USER' | 'ADMIN'
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'REMOVED'

export interface User {
  /** 사용자 ID (PK) */
  id: string
  /** 이메일 */
  email: string
  /** 비밀번호: 화면/요청 DTO에서만 사용하고 저장소에는 저장하지 않습니다. */
  password?: string
  /** 닉네임 */
  nickname: string
  /** 휴대폰 번호 */
  phoneNumber: string
  /** 권한 */
  role: UserRole
  /** 상태 */
  status: UserStatus
  /** 마지막 로그인 일시 */
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

export interface UserSession {
  user: User
  token: string
}

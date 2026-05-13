export const USER_ROLES = ['USER', 'ADMIN']
export const USER_STATUS = ['ACTIVE', 'SUSPENDED', 'REMOVED']

export function createGuestUser() {
  return {
    id: '',
    email: '',
    password: '',
    nickname: '',
    phoneNumber: '',
    role: 'USER',
    status: 'ACTIVE',
    lastLoginAt: null,
  }
}

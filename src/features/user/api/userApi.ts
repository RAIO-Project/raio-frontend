import type { LoginRequest, RegisterRequest, User, UserSession } from '@/entities/user'

const USER_DB_KEY = 'raio.mock.users'

interface StoredUser extends User {
  password: string
}

function readUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USER_DB_KEY) ?? '[]') as StoredUser[]
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]): void {
  localStorage.setItem(USER_DB_KEY, JSON.stringify(users))
}

function sanitizeUser(user: StoredUser): User {
  const { password: _password, ...safeUser } = user
  return safeUser
}

function createToken(userId: string): string {
  return `mock-token-${userId}-${Date.now()}`
}

export async function loginUser(payload: LoginRequest): Promise<UserSession> {
  const users = readUsers()
  const user = users.find((item) => item.email === payload.email && item.password === payload.password)
  if (!user || user.status !== 'ACTIVE') {
    throw new Error('Invalid credentials')
  }

  const updated: StoredUser = { ...user, lastLoginAt: new Date().toISOString() }
  writeUsers(users.map((item) => (item.id === user.id ? updated : item)))

  return {
    user: sanitizeUser(updated),
    token: createToken(updated.id),
  }
}

export async function registerUser(payload: RegisterRequest): Promise<UserSession> {
  const users = readUsers()
  if (users.some((item) => item.email === payload.email)) {
    throw new Error('Duplicated email')
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    email: payload.email,
    password: payload.password,
    nickname: payload.nickname,
    phoneNumber: payload.phoneNumber,
    role: 'USER',
    status: 'ACTIVE',
    lastLoginAt: new Date().toISOString(),
  }

  writeUsers([...users, user])

  return {
    user: sanitizeUser(user),
    token: createToken(user.id),
  }
}

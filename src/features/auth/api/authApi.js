import { httpClient } from '../../../shared/api/httpClient'

function toUser(payload) {
  return {
    id: payload.id ?? payload.userId ?? crypto.randomUUID(),
    email: payload.email,
    password: '',
    nickname: payload.nickname,
    phoneNumber: payload.phoneNumber ?? '',
    role: payload.role ?? 'USER',
    status: payload.status ?? 'ACTIVE',
    lastLoginAt: payload.lastLoginAt ?? new Date().toISOString(),
  }
}

function makeMockToken(email) {
  return `mock-${btoa(`${email}:${Date.now()}`).replaceAll('=', '')}`
}

export async function loginUser({ email, password }) {
  try {
    const { data } = await httpClient.post('/auth/login', { email, password })
    return { user: toUser(data.user ?? data), token: data.token ?? data.accessToken }
  } catch (error) {
    if (import.meta.env.PROD) throw error
    await new Promise((resolve) => setTimeout(resolve, 350))
    return {
      user: toUser({ id: 'mock-user-1', email, nickname: email.split('@')[0], phoneNumber: '010-0000-0000' }),
      token: makeMockToken(email),
    }
  }
}

export async function registerUser(form) {
  const payload = {
    email: form.email,
    password: form.password,
    nickname: form.nickname,
    phoneNumber: form.phoneNumber,
    role: 'USER',
    status: 'ACTIVE',
  }
  try {
    const { data } = await httpClient.post('/auth/register', payload)
    return { user: toUser(data.user ?? data), token: data.token ?? data.accessToken }
  } catch (error) {
    if (import.meta.env.PROD) throw error
    await new Promise((resolve) => setTimeout(resolve, 450))
    return { user: toUser({ ...payload, id: crypto.randomUUID() }), token: makeMockToken(form.email) }
  }
}

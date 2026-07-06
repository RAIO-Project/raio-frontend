import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '@/features/user/model/userStore'

const ACCESS_TOKEN_KEY = 'raio.accessToken'
const REFRESH_TOKEN_KEY = 'raio.refreshToken'
const USER_KEY = 'raio.user'

const BASE_URL = import.meta.env.VITE_API_URL || ''

export const httpClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  withCredentials: true,
})

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let pendingQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

function processQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => (token ? resolve(token) : reject(error)))
  pendingQueue = []
}

function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: { config: InternalAxiosRequestConfig & { _retry?: boolean }; response?: { status: number } }) => {
    const original = error.config

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`
            resolve(httpClient(original))
          },
          reject,
        })
      })
    }

    original._retry = true
    isRefreshing = true

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (!refreshToken) {
      clearSession()
      isRefreshing = false
      return Promise.reject(error)
    }

    try {
      const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(`${BASE_URL}/auth/refresh`, {
        refreshToken,
      })
      useUserStore.getState().updateTokens(data.accessToken, data.refreshToken)
      original.headers.Authorization = `Bearer ${data.accessToken}`
      processQueue(null, data.accessToken)
      return httpClient(original)
    } catch (refreshError) {
      processQueue(refreshError, null)
      clearSession()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

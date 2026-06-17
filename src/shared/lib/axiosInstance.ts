import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { API_CONFIG } from './apiConfig'
import { refreshAccessToken } from './refreshToken'

const baseConfig = {
  baseURL: API_CONFIG.BASE_URL,
  headers: { 'Content-Type': 'application/json' },
}

export const publicInstance = axios.create(baseConfig)

export const authInstance = axios.create(baseConfig)

// Request: attach Bearer token
authInstance.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    delete config.headers['Content-Type']
    delete config.headers['content-type']
  }
  return config
})

// Response: 401 single-flight refresh queue
interface FailedRequest {
  resolve: (token: string) => void
  reject: (err: unknown) => void
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token!)))
  failedQueue = []
}

authInstance.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    if (!original) return Promise.reject(error)

    const isRefreshCall = original.url?.includes('/auth/token')

    if (error.response?.status === 401 && !original._retry && !isRefreshCall) {
      if (isRefreshing) {
        original._retry = true
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`
          return authInstance(original)
        })
      }

      original._retry = true
      isRefreshing = true
      try {
        const token = await refreshAccessToken()
        processQueue(null, token)
        original.headers.Authorization = `Bearer ${token}`
        return authInstance(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        useAuthStore.getState().logout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  },
)

export default authInstance

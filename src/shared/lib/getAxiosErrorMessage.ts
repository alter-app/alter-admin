import axios from 'axios'
import type { ApiError } from '@/shared/types/common'

export function getAxiosErrorMessage(error: unknown, fallback = '오류가 발생했습니다'): string {
  if (!axios.isAxiosError(error)) return fallback
  const data = error.response?.data as ApiError | undefined
  if (data?.message) return data.message
  if (data?.data?.message) return data.data.message
  if (error.message && error.message !== 'Network Error') return error.message
  return fallback
}

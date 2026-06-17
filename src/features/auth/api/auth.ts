import { publicInstance } from '@/shared/lib/axiosInstance'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import type { LoginApiResponse, LoginRequest } from '../types'

export async function loginIDPW(credentials: LoginRequest): Promise<void> {
  const res = await publicInstance.post<LoginApiResponse>('/public/users/login', credentials)
  const { accessToken, refreshToken, scope } = res.data.data

  if (scope !== 'ADMIN') {
    throw new Error('관리자 계정이 아닙니다')
  }

  useAuthStore.getState().setAuth({ token: accessToken, refreshToken, scope })
}

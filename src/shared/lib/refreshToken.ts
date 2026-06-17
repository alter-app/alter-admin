import axios from 'axios'
import type { CommonApiResponse } from '@/shared/types/common'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { API_CONFIG } from './apiConfig'

interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  scope: string
}

export async function refreshAccessToken(): Promise<string> {
  const { refreshToken, isLoggedIn } = useAuthStore.getState()
  if (!refreshToken || !isLoggedIn) throw new Error('refreshToken 없음')

  const { data: result } = await axios.post<CommonApiResponse<RefreshTokenResponse>>(
    `${API_CONFIG.BASE_URL}/admin/auth/token`,
    {},
    { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${refreshToken}` } },
  )

  const { accessToken, refreshToken: newRefreshToken } = result.data
  useAuthStore.getState().setAuth({ token: accessToken, refreshToken: newRefreshToken })
  return accessToken
}

import type { CommonApiResponse } from '@/shared/types/common'

export interface LoginRequest {
  contact: string
  password: string
}

export interface TokenResponse {
  authorizationId: string
  scope: string
  accessToken: string
  refreshToken: string
}

export type LoginApiResponse = CommonApiResponse<TokenResponse>

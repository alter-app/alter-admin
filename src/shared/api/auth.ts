import axios from 'axios'
import axiosInstance from '../lib/axiosInstance'
import { useAuthStore } from '../stores/useAuthStore'

interface ApiResponse<T> {
  timestamp: string
  data: T
}

interface GenerateTokenResponseDto {
  authorizationId: string
  scope: string
  accessToken: string
  refreshToken: string
}

interface ErrorResponse {
  code?: string
  message?: string
}

function getErrorMessage(code?: string): string | undefined {
  const messages: Record<string, string> = {
    B001: '인증 코드가 일치하지 않습니다.',
    B011: '존재하지 않는 사용자 계정입니다.',
  }
  return code ? messages[code] : undefined
}

export async function loginIDPW(contact: string, password: string): Promise<void> {
  try {
    const { data: result } = await axiosInstance.post<ApiResponse<GenerateTokenResponseDto>>(
      '/public/users/login',
      { contact: contact.replace(/-/g, ''), password }
    )

    const { data } = result
    const scope = data.scope === 'APP' ? 'USER' : (data.scope as 'MANAGER' | 'USER')

    useAuthStore.getState().setAuth({
      token: data.accessToken,
      refreshToken: data.refreshToken,
      authorizationId: data.authorizationId,
      scope,
    })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData: ErrorResponse = error.response?.data ?? {}
      throw {
        data: errorData,
        message: errorData.message || getErrorMessage(errorData.code) || '로그인에 실패했습니다.',
      }
    }
    throw { message: '네트워크 오류가 발생했습니다.' }
  }
}

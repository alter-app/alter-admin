import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  refreshToken: string | null
  authorizationId: string | null
  isLoggedIn: boolean
  scope: 'MANAGER' | 'USER' | null
  setAuth: (data: {
    token: string
    refreshToken?: string
    authorizationId: string
    scope: 'MANAGER' | 'USER'
  }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null,
      refreshToken: null,
      authorizationId: null,
      isLoggedIn: false,
      scope: null,
      setAuth: data =>
        set({
          token: data.token,
          refreshToken: data.refreshToken ?? null,
          authorizationId: data.authorizationId,
          isLoggedIn: true,
          scope: data.scope,
        }),
      logout: () =>
        set({
          token: null,
          refreshToken: null,
          authorizationId: null,
          isLoggedIn: false,
          scope: null,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

export default useAuthStore

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  token: string | null
  refreshToken: string | null
  isLoggedIn: boolean
  scope: string | null
  hasHydrated: boolean
  setAuth: (data: { token: string; refreshToken?: string; scope?: string }) => void
  logout: () => void
  setHydrated: () => void
}

function getPersistStorage() {
  try {
    localStorage.setItem('__probe__', '1')
    localStorage.removeItem('__probe__')
    return localStorage
  } catch {
    const map = new Map<string, string>()
    return {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => map.set(k, v),
      removeItem: (k: string) => map.delete(k),
    }
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null,
      refreshToken: null,
      isLoggedIn: false,
      scope: null,
      hasHydrated: false,
      setAuth: ({ token, refreshToken, scope }) =>
        set(s => ({
          token,
          refreshToken: refreshToken ?? s.refreshToken,
          scope: scope ?? s.scope,
          isLoggedIn: true,
        })),
      logout: () =>
        set({ token: null, refreshToken: null, isLoggedIn: false, scope: null }),
      setHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: 'admin-auth-storage',
      storage: createJSONStorage(() => getPersistStorage()),
      partialize: s => ({
        token: s.token,
        refreshToken: s.refreshToken,
        isLoggedIn: s.isLoggedIn,
        scope: s.scope,
      }),
      onRehydrateStorage: () => state => {
        state?.setHydrated()
      },
    },
  ),
)


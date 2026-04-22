export type LoginResponse = {
  timestamp: string
  data: {
    authorizationId: string
    scope: string
    accessToken: string
    refreshToken: string
  }
}

export type AuthSession = LoginResponse['data']

const AUTH_STORAGE_KEY = 'alter-admin-auth'

export function saveAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function getAuthSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}


import { AdminPage } from '@/pages/admin'
import { LoginPage } from '@/pages/login/LoginPage'
import { useAuthStore } from '@/shared/stores/useAuthStore'

export function App() {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn)
  const scope = useAuthStore(s => s.scope)
  const hasHydrated = useAuthStore(s => s.hasHydrated)

  if (!hasHydrated) return null

  if (!isLoggedIn || scope !== 'ADMIN') return <LoginPage />

  return <AdminPage />
}

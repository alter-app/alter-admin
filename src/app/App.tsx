import { useState } from 'react'
import { DashboardPage } from '@/pages/dashboard'
import { LoginPage } from '@/pages/login'
import { clearAuthSession, getAuthSession, type AuthSession } from '@/shared/lib/auth'

export function App() {
  const [session, setSession] = useState<AuthSession | null>(() => getAuthSession())

  if (!session) {
    return <LoginPage onLoginSuccess={setSession} />
  }

  return (
    <DashboardPage
      authorizationId={session.authorizationId}
      accessToken={session.accessToken}
      onLogout={() => {
        clearAuthSession()
        setSession(null)
      }}
    />
  )
}


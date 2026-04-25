import { useNavigate } from 'react-router-dom'
import { Sidebar } from '@/pages/dashboard/ui/Sidebar'
import { TopBar } from '@/pages/dashboard/ui/TopBar'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { MembersTable } from './MembersTable'

export function MembersPage() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <TopBar title="회원관리" onLogout={handleLogout} />
          <div className="flex-1 px-8 pb-10">
            <MembersTable />
          </div>
        </main>
      </div>
    </div>
  )
}

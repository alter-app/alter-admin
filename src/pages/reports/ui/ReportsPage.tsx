import { useNavigate } from 'react-router-dom'
import { Sidebar } from '@/pages/dashboard/ui/Sidebar'
import { TopBar } from '@/pages/dashboard/ui/TopBar'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { ReportsTable } from './ReportsTable'

export function ReportsPage() {
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
          <TopBar title="신고관리" onLogout={handleLogout} />
          <div className="flex-1 px-8 pb-10">
            <ReportsTable />
          </div>
        </main>
      </div>
    </div>
  )
}

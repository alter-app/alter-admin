import { useAdminStore } from '@/shared/stores/useAdminStore'
import { Header } from '@/widgets/app-shell/Header'
import { Sidebar } from '@/widgets/app-shell/Sidebar'
import { AdminModals } from '@/widgets/modals/AdminModals'
import { buildListConfig } from './lists'
import { DashboardView } from './views/DashboardView'
import { JobDetailView } from './views/JobDetailView'
import { ListView } from './views/ListView'
import { MemberDetailView } from './views/MemberDetailView'
import { ReportDetailView } from './views/ReportDetailView'
import { SystemSettingsView } from './views/SystemSettingsView'
import { WsManageDetailView } from './views/WsManageDetailView'
import { WsRequestDetailView } from './views/WsRequestDetailView'

function MainContent() {
  const menu = useAdminStore(s => s.menu)
  const workspaceSub = useAdminStore(s => s.workspaceSub)
  const detail = useAdminStore(s => s.detail)
  const openDetail = useAdminStore(s => s.openDetail)
  const openConfirm = useAdminStore(s => s.openConfirm)
  const selectWorkspaceSub = useAdminStore(s => s.selectWorkspaceSub)

  if (detail) {
    switch (detail.type) {
      case 'member':
        return <MemberDetailView member={detail.row} />
      case 'job':
        return <JobDetailView job={detail.row} />
      case 'wsRequest':
        return <WsRequestDetailView request={detail.row} />
      case 'wsManage':
        return <WsManageDetailView workspace={detail.row} />
      case 'report':
        return <ReportDetailView report={detail.row} />
    }
  }

  if (menu === 'dashboard') return <DashboardView />
  if (menu === 'system') return <SystemSettingsView />

  const config = buildListConfig(menu, workspaceSub, {
    openDetail,
    openConfirm,
    selectWorkspaceSub,
  })
  return config ? <ListView config={config} /> : null
}

export function AdminPage() {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        background: '#f4f4f4',
      }}
    >
      <Sidebar />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header />
        <main style={{ flex: 1, padding: 28, overflowX: 'hidden' }}>
          <div style={{ maxWidth: 1320, margin: '0 auto' }}>
            <MainContent />
          </div>
        </main>
      </div>
      <AdminModals />
    </div>
  )
}

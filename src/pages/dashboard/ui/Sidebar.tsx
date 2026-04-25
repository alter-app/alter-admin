import { NavLink, useNavigate } from 'react-router-dom'
import { Icon, type IconName } from './components/Icon'
import { useAuthStore } from '@/shared/stores/useAuthStore'

type NavItemId = 'dashboard' | 'users' | 'jobs' | 'stores' | 'reports' | 'system'

type NavItem = {
  id: NavItemId
  path: string
  label: string
}

const navItems: NavItem[] = [
  { id: 'dashboard', path: '/dashboard', label: '대시보드' },
  { id: 'users', path: '/members', label: '회원관리' },
  { id: 'jobs', path: '/jobs', label: '공고관리' },
  { id: 'stores', path: '/stores', label: '업장관리' },
  { id: 'reports', path: '/reports', label: '신고관리' },
  { id: 'system', path: '/system', label: '시스템관리' },
]

function iconForId(id: NavItemId): IconName {
  switch (id) {
    case 'dashboard': return 'grid'
    case 'users': return 'users'
    case 'jobs': return 'file'
    case 'stores': return 'grid'
    case 'reports': return 'file'
    case 'system': return 'settings'
  }
}

export function Sidebar() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-gray-100 bg-white">
      <div className="px-7 pt-6 pb-5">
        <div className="text-[13px] tracking-wide text-gray-400">
          데이터 큐레이션 스위트
        </div>
        <div className="mt-1 text-[18px] font-semibold text-gray-900">
          에디토리얼 관리자
        </div>
      </div>

      <nav className="px-4 py-2">
        <div className="space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold',
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-100'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <span className="text-emerald-700/90">
                    <Icon name={iconForId(item.id)} className="h-5 w-5" />
                  </span>
                  <span className="tracking-wide">{item.label}</span>
                  {isActive && (
                    <span
                      className="ml-auto h-9 w-[3px] rounded-full bg-emerald-600"
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="mt-auto px-6 pb-6">
        <div className="space-y-3 text-[12px] font-semibold text-gray-400">
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50"
          >
            <Icon name="help" className="h-4 w-4" />
            도움말 센터
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50"
          >
            <Icon name="logout" className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </div>
    </aside>
  )
}

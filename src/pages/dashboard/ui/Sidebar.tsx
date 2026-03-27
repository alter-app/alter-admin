import { Icon } from './components/Icon'

const navItems = [
  { id: 'dashboard', label: '대시보드', active: true },
  { id: 'analytics', label: '분석', active: false },
  { id: 'curation', label: '큐레이션', active: false },
  { id: 'reports', label: '리포트', active: false },
  { id: 'team', label: '팀', active: false },
] as const

export function Sidebar() {
  return (
    <aside className="w-[260px] shrink-0 border-r border-gray-100 bg-white">
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
            <a
              key={item.id}
              href="#"
              className={[
                'flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold',
                item.active
                  ? 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
              ].join(' ')}
            >
              <span className="text-emerald-700/90">
                <Icon
                  name={
                    item.id === 'dashboard'
                      ? 'grid'
                      : item.id === 'analytics'
                        ? 'chart'
                        : item.id === 'curation'
                          ? 'sparkles'
                          : item.id === 'reports'
                            ? 'file'
                            : 'users'
                  }
                  className="h-5 w-5"
                />
              </span>
              <span className="tracking-wide">{item.label}</span>
              {item.active ? (
                <span
                  className="ml-auto h-9 w-[3px] rounded-full bg-emerald-600"
                  aria-hidden="true"
                />
              ) : null}
            </a>
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
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50"
          >
            <Icon name="logout" className="h-4 w-4" />
            로그아웃
          </a>
        </div>
      </div>
    </aside>
  )
}

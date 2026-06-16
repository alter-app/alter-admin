import { useAdminStore } from '@/shared/stores/useAdminStore'
import type { MenuKey } from '@/shared/stores/useAdminStore'

const MENUS: { key: MenuKey; label: string }[] = [
  { key: 'dashboard', label: '대시보드' },
  { key: 'members', label: '회원 관리' },
  { key: 'jobs', label: '공고 관리' },
  { key: 'workspaces', label: '업장 관리' },
  { key: 'reports', label: '신고 관리' },
  { key: 'terms', label: '약관 관리' },
  { key: 'system', label: '시스템 관리' },
]

export function Sidebar() {
  const menu = useAdminStore(s => s.menu)
  const collapsed = useAdminStore(s => s.collapsed)
  const selectMenu = useAdminStore(s => s.selectMenu)
  const toggleSidebar = useAdminStore(s => s.toggleSidebar)

  return (
    <aside
      style={{
        width: collapsed ? 76 : 244,
        flex: `0 0 ${collapsed ? 76 : 244}px`,
        background: '#ffffff',
        borderRight: '1px solid #e5e5e5',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        transition: 'width .22s ease',
        zIndex: 20,
      }}
    >
      <div
        style={{
          height: 72,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 20px',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 600 600"
          fill="none"
          style={{ flex: '0 0 auto' }}
        >
          <path
            d="M300 0C465.685 0 600 134.315 600 300H300V600C134.315 600 0 465.685 0 300C0 134.315 134.315 0 300 0Z"
            fill="url(#lg0)"
          />
          <path
            d="M300 600C300 434.315 434.315 300 600 300L600 600L300 600Z"
            fill="url(#lg1)"
          />
          <defs>
            <linearGradient
              id="lg0"
              x1="0"
              y1="300"
              x2="600"
              y2="300"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.485577" stopColor="#07C079" />
              <stop offset="1" stopColor="#0F7745" />
            </linearGradient>
            <linearGradient
              id="lg1"
              x1="600"
              y1="450"
              x2="300"
              y2="450"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#07C079" />
              <stop offset="1" stopColor="#0F7745" />
            </linearGradient>
          </defs>
        </svg>
        {!collapsed && (
          <span
            style={{
              fontFamily: "'RixYeoljeongdo_Pro'",
              fontSize: 18,
              color: '#232323',
              letterSpacing: '-.01em',
            }}
          >
            관리자 페이지
          </span>
        )}
      </div>

      <nav
        style={{
          flex: 1,
          padding: '14px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          overflowY: 'auto',
        }}
      >
        {MENUS.map(m => {
          const active = menu === m.key
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => selectMenu(m.key)}
              title={m.label}
              className={active ? undefined : 'adm-nav-hover'}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                height: 46,
                padding: '0 14px',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
                background: active ? '#e6f9f2' : 'transparent',
                color: active ? '#0f7745' : '#5f5f5f',
                textAlign: 'left',
                transition: 'background .15s ease',
              }}
            >
              {collapsed ? (
                <span
                  style={{
                    flex: '0 0 100%',
                    textAlign: 'center',
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  {m.label.charAt(0)}
                </span>
              ) : (
                <span style={{ fontSize: 14, fontWeight: active ? 600 : 500 }}>
                  {m.label}
                </span>
              )}
              {active && (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 9,
                    bottom: 9,
                    width: 3,
                    borderRadius: '0 3px 3px 0',
                    background: '#07c079',
                  }}
                />
              )}
            </button>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={toggleSidebar}
        className="adm-hover-f8"
        style={{
          height: 52,
          border: 'none',
          borderTop: '1px solid #f0f0f0',
          background: '#fff',
          cursor: 'pointer',
          color: '#828282',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 13,
        }}
      >
        <span style={{ fontSize: 15 }}>{collapsed ? '›' : '‹'}</span>
        {!collapsed && <span>접기</span>}
      </button>
    </aside>
  )
}

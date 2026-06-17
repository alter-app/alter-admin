import { useAdminStore } from '@/shared/stores/useAdminStore'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import type { Detail, MenuKey } from '@/shared/stores/useAdminStore'

const MENU_LABELS: Record<MenuKey, string> = {
  dashboard: '대시보드',
  members: '회원 관리',
  jobs: '공고 관리',
  workspaces: '업장 관리',
  reports: '신고 관리',
  terms: '약관 관리',
  system: '시스템 관리',
}

function detailLabel(detail: Detail): string {
  switch (detail.type) {
    case 'member':
      return detail.row.name
    case 'job':
      return detail.row.title
    case 'wsRequest':
      return detail.row.businessName
    case 'wsManage':
      return detail.row.name
    case 'report':
      return detail.row.targetName
  }
}

interface Crumb {
  label: string
  sep: boolean
  color: string
  weight: number
  cursor: 'pointer' | 'default'
  onClick: () => void
}

export function Header() {
  const menu = useAdminStore(s => s.menu)
  const workspaceSub = useAdminStore(s => s.workspaceSub)
  const detail = useAdminStore(s => s.detail)
  const userMenuOpen = useAdminStore(s => s.userMenuOpen)
  const selectMenu = useAdminStore(s => s.selectMenu)
  const toggleUserMenu = useAdminStore(s => s.toggleUserMenu)
  const openPasswordModal = useAdminStore(s => s.openPasswordModal)
  const openLogout = useAdminStore(s => s.openLogout)
  const adminEmail = useAuthStore(s => s.scope === 'ADMIN' ? (s.token ? '관리자' : '') : '')

  let leaf: string | null = '목록'
  if (menu === 'dashboard') leaf = null
  else if (detail) leaf = detailLabel(detail)
  else if (menu === 'workspaces')
    leaf = workspaceSub === 'requests' ? '업장 등록 신청' : '업장 관리'

  const crumbs: Crumb[] = [
    {
      label: '홈',
      sep: false,
      color: '#828282',
      weight: 400,
      cursor: 'pointer',
      onClick: () => selectMenu('dashboard'),
    },
    {
      label: MENU_LABELS[menu],
      sep: true,
      color: leaf ? '#828282' : '#232323',
      weight: leaf ? 400 : 600,
      cursor: 'pointer',
      onClick: () => selectMenu(menu),
    },
  ]
  if (leaf)
    crumbs.push({
      label: leaf,
      sep: true,
      color: '#232323',
      weight: 600,
      cursor: 'default',
      onClick: () => {},
    })

  return (
    <header
      style={{
        height: 72,
        flex: '0 0 72px',
        background: '#ffffff',
        borderBottom: '1px solid #e5e5e5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 15,
      }}
    >
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {crumbs.map((c, i) => (
          <span
            key={i}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {c.sep && (
              <span style={{ color: '#c3c3c3', fontSize: 13 }}>›</span>
            )}
            <button
              type="button"
              onClick={c.onClick}
              style={{
                border: 'none',
                background: 'none',
                cursor: c.cursor,
                padding: '2px 0',
                fontSize: 14,
                fontWeight: c.weight,
                color: c.color,
              }}
            >
              {c.label}
            </button>
          </span>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          type="button"
          title="알림 (준비 중)"
          disabled
          style={{
            position: 'relative',
            width: 42,
            height: 42,
            borderRadius: 12,
            border: '1px solid #eee',
            background: '#fafafa',
            cursor: 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a3a3a3"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
          <span
            style={{
              position: 'absolute',
              top: 8,
              right: 9,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#c3c3c3',
            }}
          />
        </button>

        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={toggleUserMenu}
            className="adm-hover-f8"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              height: 42,
              padding: '0 14px',
              borderRadius: 12,
              border: '1px solid #eee',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500, color: '#232323' }}>
              {adminEmail || '관리자'}
            </span>
            <span style={{ color: '#a3a3a3', fontSize: 11 }}>▾</span>
          </button>

          {userMenuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 50,
                width: 248,
                background: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: 16,
                boxShadow: '0 12px 32px rgba(0,0,0,.12)',
                padding: 8,
                zIndex: 40,
                animation: 'ddIn .14s ease',
              }}
            >
              <div style={{ padding: '12px 12px 14px' }}>
                <div
                  style={{ fontSize: 11, color: '#a3a3a3', fontWeight: 600 }}
                >
                  로그인 계정
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#232323',
                    marginTop: 4,
                  }}
                >
                  {adminEmail || '관리자'}
                </div>
              </div>
              <div
                style={{ height: 1, background: '#f0f0f0', margin: '2px 0' }}
              />
              <button
                type="button"
                onClick={() => openPasswordModal()}
                className="adm-hover-f4"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  height: 42,
                  padding: '0 12px',
                  border: 'none',
                  background: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: 14,
                  color: '#232323',
                  textAlign: 'left',
                }}
              >
                🔑 비밀번호 변경
              </button>
              <button
                type="button"
                onClick={openLogout}
                className="adm-hover-red"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  height: 42,
                  padding: '0 12px',
                  border: 'none',
                  background: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: 14,
                  color: '#dc0000',
                  textAlign: 'left',
                }}
              >
                ↩ 로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

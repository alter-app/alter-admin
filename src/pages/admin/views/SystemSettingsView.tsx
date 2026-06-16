import { admins, badge } from '@/shared/admin/data'
import { Badge } from '@/shared/ui/Badge'

const TOGGLES = [
  { label: '신규 가입 허용', desc: '앱에서 신규 회원 가입을 받습니다', on: true },
  { label: '업장 자동 승인', desc: '서류 검증 시 자동으로 승인 처리', on: false },
  { label: '점검 모드', desc: '활성화 시 사용자 접속이 차단됩니다', on: false },
]

const cardStyle = {
  background: '#fff',
  border: '1px solid #e5e5e5',
  borderRadius: 16,
  padding: 22,
} as const

const sectionTitle = { margin: '0 0 16px', fontSize: 16, fontWeight: 600 } as const

export function SystemSettingsView() {
  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>시스템 관리</h1>
      </div>
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
      >
        <section style={cardStyle}>
          <h2 style={sectionTitle}>전역 설정</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {TOGGLES.map(t => (
              <div
                key={t.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '13px 0',
                  borderBottom: '1px solid #f4f4f4',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{t.label}</div>
                  <div
                    style={{ fontSize: 12, color: '#a3a3a3', marginTop: 3 }}
                  >
                    {t.desc}
                  </div>
                </div>
                <span
                  style={{
                    width: 44,
                    height: 26,
                    borderRadius: 999,
                    background: t.on ? '#07c079' : '#d6d6d6',
                    position: 'relative',
                    flex: '0 0 auto',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 3,
                      left: t.on ? 21 : 3,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#fff',
                      boxShadow: '0 1px 3px rgba(0,0,0,.2)',
                      transition: 'left .2s',
                    }}
                  />
                </span>
              </div>
            ))}
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitle}>데이터 백업 / 복원</h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f4f4f4',
                borderRadius: 12,
                padding: '14px 16px',
              }}
            >
              <div>
                <div
                  style={{ fontSize: 13, color: '#a3a3a3', fontWeight: 600 }}
                >
                  최근 백업
                </div>
                <div style={{ fontSize: 14, marginTop: 3 }}>
                  2026-06-16 03:00 (자동)
                </div>
              </div>
              <Badge text="정상" bg="#e6f9f2" fg="#0f7745" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="adm-hover-bright"
              style={{
                flex: 1,
                height: 44,
                border: 'none',
                borderRadius: 12,
                background: '#07c079',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(7,192,121,.3)',
              }}
            >
              지금 백업
            </button>
            <button
              type="button"
              className="adm-hover-f4"
              style={{
                flex: 1,
                height: 44,
                border: '1px solid #c3c3c3',
                borderRadius: 12,
                background: '#fff',
                color: '#5f5f5f',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              복원
            </button>
          </div>
        </section>

        <section style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
              관리자 계정 · 권한
            </h2>
            <button
              type="button"
              className="adm-hover-f4"
              style={{
                height: 38,
                padding: '0 14px',
                border: '1px solid #c3c3c3',
                borderRadius: 10,
                background: '#fff',
                color: '#5f5f5f',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + 관리자 추가
            </button>
          </div>
          <div
            style={{
              border: '1px solid #f0f0f0',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#efefef' }}>
                  {['이메일', '이름', '권한', '최근 접속'].map(h => (
                    <th
                      key={h}
                      style={{
                        padding: '11px 16px',
                        textAlign: 'left',
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#5f5f5f',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                  <th
                    style={{
                      padding: '11px 16px',
                      textAlign: 'center',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#5f5f5f',
                    }}
                  >
                    상태
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins.map(a => {
                  const r = badge(a.roleTone)
                  const st = badge(a.tone)
                  return (
                    <tr key={a.email} style={{ borderTop: '1px solid #f4f4f4' }}>
                      <td
                        style={{
                          padding: '13px 16px',
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {a.email}
                      </td>
                      <td
                        style={{
                          padding: '13px 16px',
                          fontSize: 14,
                          color: '#5f5f5f',
                        }}
                      >
                        {a.name}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <Badge
                          text={a.role}
                          bg={r.bg}
                          fg={r.fg}
                          style={{ padding: '3px 10px' }}
                        />
                      </td>
                      <td
                        style={{
                          padding: '13px 16px',
                          fontSize: 14,
                          color: '#828282',
                        }}
                      >
                        {a.lastLogin}
                      </td>
                      <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                        <Badge
                          text={a.status}
                          bg={st.bg}
                          fg={st.fg}
                          style={{ padding: '3px 10px' }}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}

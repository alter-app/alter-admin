import { badge, repRows } from '@/shared/admin/data'
import type { Member } from '@/shared/admin/data'
import { userRoleTone, userStatusTone } from '@/shared/admin/enums'
import { useMember, useUpdateMemberStatus } from '@/features/members/hooks/useMembers'
import { useAdminStore } from '@/shared/stores/useAdminStore'
import { Badge } from '@/shared/ui/Badge'
import { BackButton, FieldGrid } from './detailParts'

export function MemberDetailView({ member }: { member: Member }) {
  const openConfirm = useAdminStore(s => s.openConfirm)
  const openPasswordModal = useAdminStore(s => s.openPasswordModal)

  // Re-fetch by ID for fresh data (contact/birthday/gender/reputationSummary etc.)
  const { data: detail } = useMember(member.id)
  const updateStatus = useUpdateMemberStatus(member.id)

  // Use fetched detail if available, else fall back to row snapshot
  const name = detail?.name ?? member.name
  const email = detail?.email ?? member.email
  const nickname = detail?.nickname ?? member.nickname
  const roleLabel = detail?.role.description ?? member.role
  const statusLabel = detail?.status.description ?? member.status
  const roleTone = detail ? userRoleTone(detail.role.value) : member.roleTone
  const statusTone = detail ? userStatusTone(detail.status.value) : member.statusTone
  const contact = detail?.contact ?? member.contact
  const birthday = detail?.birthday ?? member.birthday
  const gender = detail?.gender.description ?? member.gender
  const createdAt = detail?.createdAt ?? member.createdAt
  const updatedAt = detail?.updatedAt ?? member.updatedAt
  const topKeywords = detail?.reputationSummary?.topKeywords ?? []

  const rb = badge(roleTone)
  const sb = badge(statusTone)

  const fields = [
    { label: '닉네임', value: nickname },
    { label: '연락처', value: contact },
    { label: '생년월일', value: birthday },
    { label: '성별', value: gender },
    { label: '가입일', value: createdAt },
    { label: '최종 수정', value: updatedAt },
  ]

  function handleStatusChange(status: 'ACTIVE' | 'SUSPENDED' | 'DELETED', title: string, desc: string, label: string, color: string) {
    openConfirm({
      title,
      desc,
      label,
      color,
      onConfirm: () => updateStatus.mutate({ status }),
    })
  }

  return (
    <>
      <BackButton />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: 16,
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <section
            style={{
              background: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginBottom: 22,
              }}
            >
              <span
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#07c079,#0f7745)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 600,
                }}
              >
                {name.charAt(0)}
              </span>
              <div>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <span style={{ fontSize: 20, fontWeight: 600 }}>
                    {name}
                  </span>
                  <Badge text={roleLabel} bg={rb.bg} fg={rb.fg} />
                  <Badge text={statusLabel} bg={sb.bg} fg={sb.fg} />
                </div>
                <div
                  style={{ fontSize: 14, color: '#828282', marginTop: 6 }}
                >
                  {email}
                </div>
              </div>
            </div>
            <FieldGrid fields={fields} />
          </section>

          <section
            style={{
              background: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                평판 관리
              </h2>
              <span style={{ fontSize: 12, color: '#a3a3a3' }}>
                키워드는 실 데이터 · 개별 목록은 예시
              </span>
            </div>
            {topKeywords.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  flexWrap: 'wrap',
                  marginBottom: 20,
                }}
              >
                {topKeywords.map(r => (
                  <div
                    key={r.description}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: '#e6f9f2',
                      border: '1px solid #b5ecd7',
                      borderRadius: 999,
                      padding: '7px 14px',
                    }}
                  >
                    {r.emoji && <span style={{ fontSize: 16 }}>{r.emoji}</span>}
                    <span
                      style={{ fontSize: 13, fontWeight: 600, color: '#0f7745' }}
                    >
                      {r.description}
                    </span>
                    <span
                      style={{ fontSize: 12, color: '#51d3a1', fontWeight: 600 }}
                    >
                      {r.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
                    {['구분', '내용', '상대'].map(h => (
                      <th
                        key={h}
                        style={{
                          padding: '11px 14px',
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
                        padding: '11px 14px',
                        textAlign: 'center',
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#5f5f5f',
                      }}
                    >
                      상태
                    </th>
                    <th
                      style={{
                        padding: '11px 14px',
                        textAlign: 'right',
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#5f5f5f',
                      }}
                    >
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {repRows.map((r, i) => {
                    const b = badge(r.tone)
                    return (
                      <tr key={i} style={{ borderTop: '1px solid #f4f4f4' }}>
                        <td style={{ padding: '12px 14px', fontSize: 13, color: '#828282' }}>
                          {r.kind}
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 13, color: '#232323' }}>
                          {r.content}
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 13, color: '#5f5f5f' }}>
                          {r.counterpart}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <Badge text={r.status} bg={b.bg} fg={b.fg} style={{ padding: '3px 10px' }} />
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() =>
                              openConfirm({
                                title: '평판 비활성',
                                desc: '선택한 평판을 비활성 처리할까요? (예시)',
                                label: '비활성',
                                color: '#dc0000',
                              })
                            }
                            className="adm-hover-red"
                            style={{
                              fontSize: 12,
                              color: '#dc0000',
                              border: '1px solid #f3caca',
                              background: '#fff',
                              borderRadius: 8,
                              padding: '5px 10px',
                              cursor: 'pointer',
                            }}
                          >
                            비활성
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside
          style={{
            background: '#fff',
            border: '1px solid #e5e5e5',
            borderRadius: 16,
            padding: 22,
            position: 'sticky',
            top: 100,
          }}
        >
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>
            회원 조치
          </h3>
          <div style={{ fontSize: 12, color: '#a3a3a3', fontWeight: 600, marginBottom: 8 }}>
            상태 변경
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
            <button
              type="button"
              onClick={() => handleStatusChange('ACTIVE', '활성 처리', '해당 회원을 활성 상태로 변경할까요?', '활성', '#07c079')}
              className="adm-hover-bright-soft"
              style={{
                height: 42,
                border: '1px solid #b5ecd7',
                borderRadius: 12,
                background: '#e6f9f2',
                color: '#0f7745',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              활성으로 변경
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange('SUSPENDED', '정지 처리', '해당 회원을 정지 처리할까요?', '정지', '#e8920b')}
              className="adm-hover-bright-soft"
              style={{
                height: 42,
                border: '1px solid #f3e2c4',
                borderRadius: 12,
                background: '#fdf3e2',
                color: '#b9740a',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              정지 처리
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange('DELETED', '삭제 처리', '삭제된 회원은 복구할 수 없습니다. 계속할까요?', '삭제', '#dc0000')}
              className="adm-hover-bright-soft"
              style={{
                height: 42,
                border: '1px solid #f3caca',
                borderRadius: 12,
                background: '#fdeaea',
                color: '#dc0000',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              삭제 처리
            </button>
          </div>
          <div style={{ height: 1, background: '#f0f0f0', marginBottom: 18 }} />
          <button
            type="button"
            onClick={() => openPasswordModal({ userId: member.id })}
            className="adm-btn-primary"
            style={{
              width: '100%',
              height: 46,
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
            비밀번호 강제 변경
          </button>
        </aside>
      </div>
    </>
  )
}

import { badge } from '@/shared/admin/data'
import type { Report, Tone } from '@/shared/admin/data'
import { useAdminStore } from '@/shared/stores/useAdminStore'
import { Badge } from '@/shared/ui/Badge'
import { BackButton } from './detailParts'

const STATUS_OPTIONS: [string, Tone][] = [
  ['대기중', 'amber'],
  ['처리중', 'amber'],
  ['완료', 'green'],
  ['거부됨', 'red'],
]

export function ReportDetailView({ report }: { report: Report }) {
  const openConfirm = useAdminStore(s => s.openConfirm)
  const b = badge(report.tone)

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
              gap: 10,
              marginBottom: 20,
            }}
          >
            <Badge text={report.targetType} bg="#e9eefc" fg="#003BDC" />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
              {report.targetName}
            </h2>
            <Badge text={report.status} bg={b.bg} fg={b.fg} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: '#a3a3a3',
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                신고 사유
              </div>
              <div
                style={{
                  background: '#f4f4f4',
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 14,
                  color: '#232323',
                  lineHeight: 1.6,
                }}
              >
                {report.reason}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: '#a3a3a3',
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                관리자 코멘트
              </div>
              <textarea
                placeholder="처리 코멘트를 입력하세요"
                defaultValue={report.adminComment}
                style={{
                  width: '100%',
                  minHeight: 96,
                  border: '1px solid #c3c3c3',
                  borderRadius: 12,
                  padding: 14,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                gap: 18,
                fontSize: 13,
                color: '#a3a3a3',
              }}
            >
              <span>신고일 {report.createdAt}</span>
              <span>최종 수정 {report.updatedAt}</span>
            </div>
          </div>
        </section>

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
          <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 600 }}>
            처리 상태
          </h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              marginBottom: 18,
            }}
          >
            {STATUS_OPTIONS.map(([label, tone]) => {
              const active = label === report.status
              const bd = badge(tone)
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    openConfirm({
                      title: '상태 변경',
                      desc: `신고 상태를 "${label}"(으)로 변경할까요?`,
                      label: '변경',
                      color: '#07c079',
                    })
                  }
                  className="adm-hover-bright-098"
                  style={{
                    height: 42,
                    border: `1px solid ${active ? bd.fg : '#e5e5e5'}`,
                    borderRadius: 12,
                    background: active ? bd.bg : '#fff',
                    color: active ? bd.fg : '#5f5f5f',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    padding: '0 14px',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
          <div style={{ height: 1, background: '#f0f0f0', marginBottom: 18 }} />
          <button
            type="button"
            onClick={() =>
              openConfirm({
                title: '계정 제재',
                desc: '피신고자 계정을 정지 처리합니다. 계속할까요?',
                label: '제재',
                color: '#dc0000',
              })
            }
            className="adm-hover-bright-soft"
            style={{
              width: '100%',
              height: 44,
              border: '1px solid #f3e2c4',
              borderRadius: 12,
              background: '#fdf3e2',
              color: '#b9740a',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 8,
            }}
          >
            피신고자 계정 제재
          </button>
          <button
            type="button"
            onClick={() =>
              openConfirm({
                title: '신고 삭제',
                desc: '신고 내역을 삭제할까요?',
                label: '삭제',
                color: '#dc0000',
              })
            }
            className="adm-hover-red"
            style={{
              width: '100%',
              height: 44,
              border: '1px solid #f3caca',
              borderRadius: 12,
              background: '#fff',
              color: '#dc0000',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            신고 삭제
          </button>
        </aside>
      </div>
    </>
  )
}

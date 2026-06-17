import { useState } from 'react'
import { badge } from '@/shared/admin/data'
import type { Report } from '@/shared/admin/data'
import { reportStatusTone } from '@/shared/admin/enums'
import { useReport, useUpdateReportStatus, useDeleteReport } from '@/features/reports/hooks/useReports'
import { useAdminStore } from '@/shared/stores/useAdminStore'
import { Badge } from '@/shared/ui/Badge'
import { BackButton } from './detailParts'
import type { UpdateReportStatusRequest } from '@/features/reports/types'

const STATUS_OPTIONS: { label: string; value: UpdateReportStatusRequest['status'] }[] = [
  { label: '대기중', value: 'PENDING' },
  { label: '처리중', value: 'PROCESSING' },
  { label: '완료', value: 'RESOLVED' },
  { label: '거부됨', value: 'REJECTED' },
]

export function ReportDetailView({ report }: { report: Report }) {
  const openConfirm = useAdminStore(s => s.openConfirm)
  const back = useAdminStore(s => s.back)
  const [adminComment, setAdminComment] = useState(report.adminComment)

  const { data: detail } = useReport(report.id)
  const updateStatus = useUpdateReportStatus(report.id)
  const deleteReport = useDeleteReport(report.id)

  const targetType = detail?.targetType.description ?? report.targetType
  const targetName = detail?.target.targetName ?? report.targetName
  const statusLabel = detail?.status.description ?? report.status
  const statusTone = detail ? reportStatusTone(detail.status.value) : report.tone
  const reason = detail?.reason ?? report.reason
  const savedComment = detail?.adminComment ?? report.adminComment
  const createdAt = detail?.createdAt ?? report.createdAt
  const updatedAt = detail?.updatedAt ?? report.updatedAt

  const b = badge(statusTone)

  function handleStatusChange(label: string, value: UpdateReportStatusRequest['status']) {
    openConfirm({
      title: '상태 변경',
      desc: `신고 상태를 "${label}"(으)로 변경할까요?`,
      label: '변경',
      color: '#07c079',
      onConfirm: () => updateStatus.mutate({ status: value, adminComment }),
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
            <Badge text={targetType} bg="#e9eefc" fg="#003BDC" />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
              {targetName}
            </h2>
            <Badge text={statusLabel} bg={b.bg} fg={b.fg} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: '#a3a3a3', fontWeight: 600, marginBottom: 6 }}>
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
                {reason}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#a3a3a3', fontWeight: 600, marginBottom: 6 }}>
                관리자 코멘트
              </div>
              <textarea
                placeholder="처리 코멘트를 입력하세요"
                value={adminComment || savedComment}
                onChange={e => setAdminComment(e.target.value)}
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
            <div style={{ display: 'flex', gap: 18, fontSize: 13, color: '#a3a3a3' }}>
              <span>신고일 {createdAt}</span>
              <span>최종 수정 {updatedAt}</span>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
            {STATUS_OPTIONS.map(({ label, value }) => {
              const active = label === statusLabel
              const bd = badge(reportStatusTone(value))
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleStatusChange(label, value)}
                  disabled={updateStatus.isPending}
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
                title: '신고 삭제',
                desc: '신고 내역을 삭제할까요?',
                label: '삭제',
                color: '#dc0000',
                onConfirm: () => deleteReport.mutate(undefined, { onSuccess: () => back() }),
              })
            }
            disabled={deleteReport.isPending}
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

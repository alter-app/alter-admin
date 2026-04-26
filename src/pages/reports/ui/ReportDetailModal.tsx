import { useEffect, useState } from 'react'
import { fetchReportDetail, type ReportDetail, type ReportTargetType, type ReportStatus } from '../api/reports'

const TARGET_TYPE_LABEL: Record<ReportTargetType, string> = {
  USER:       '회원',
  REPUTATION: '평판',
  POSTING:    '게시글',
  WORKSPACE:  '업장',
}

const STATUS_LABEL: Record<ReportStatus, string> = {
  PENDING:    '대기',
  PROCESSING: '처리중',
  RESOLVED:   '해결됨',
  REJECTED:   '거절됨',
  CANCELLED:  '취소됨',
  DELETED:    '삭제됨',
}

function TargetTypeBadge({ type }: { type: ReportTargetType }) {
  const cls =
    type === 'USER'       ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100' :
    type === 'REPUTATION' ? 'bg-violet-50 text-violet-700 ring-1 ring-violet-100' :
    type === 'POSTING'    ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100' :
                            'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${cls}`}>
      {TARGET_TYPE_LABEL[type]}
    </span>
  )
}

function StatusBadge({ status }: { status: ReportStatus }) {
  const cls =
    status === 'PENDING'    ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100' :
    status === 'PROCESSING' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100' :
    status === 'RESOLVED'   ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100' :
    status === 'REJECTED'   ? 'bg-red-50 text-red-600 ring-1 ring-red-100' :
    status === 'CANCELLED'  ? 'bg-gray-100 text-gray-500' :
                              'bg-gray-100 text-gray-400'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${cls}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 border-b border-gray-50 py-3 last:border-0">
      <dt className="w-24 shrink-0 text-[12px] font-semibold text-gray-400">{label}</dt>
      <dd className="break-all text-[13px] text-gray-900">{value}</dd>
    </div>
  )
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
      {children}
    </div>
  )
}

function SkeletonBody() {
  return (
    <div className="space-y-6 p-6">
      {[3, 2].map((rows, si) => (
        <div key={si}>
          <div className="mb-3 h-3 w-16 animate-pulse rounded bg-gray-100" />
          <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex gap-4 py-1">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-48 animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const formatDate = (iso: string) => iso.slice(0, 10).replace(/-/g, '.')

function ModalContent({ detail }: { detail: ReportDetail }) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <SectionTitle>신고 정보</SectionTitle>
        <dl>
          <InfoRow label="신고 대상"  value={detail.target.targetName} />
          <InfoRow label="신고 사유"  value={detail.reason} />
        </dl>
      </div>

      {detail.adminComment && (
        <div>
          <SectionTitle>관리자 코멘트</SectionTitle>
          <div className="rounded-xl bg-gray-50 px-4 py-3 text-[13px] leading-relaxed text-gray-700 ring-1 ring-gray-100">
            {detail.adminComment}
          </div>
        </div>
      )}

      <div>
        <SectionTitle>기록</SectionTitle>
        <dl>
          <InfoRow label="신고일"    value={formatDate(detail.createdAt)} />
          <InfoRow label="최종수정일" value={formatDate(detail.updatedAt)} />
        </dl>
      </div>
    </div>
  )
}

export function ReportDetailModal({
  reportId,
  onClose,
}: {
  reportId: number
  onClose: () => void
}) {
  const [detail, setDetail] = useState<ReportDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setDetail(null)
    setLoading(true)

    fetchReportDetail(reportId, controller.signal)
      .then(data => {
        setDetail(data)
        setLoading(false)
      })
      .catch(err => {
        if ((err as Error).name === 'CanceledError') return
        setLoading(false)
      })

    return () => controller.abort()
  }, [reportId])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-start gap-4 border-b border-gray-100 px-6 py-5">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-50 text-[20px] font-bold text-amber-600">
            {loading ? (
              <div className="h-7 w-7 animate-pulse rounded-full bg-amber-100" />
            ) : (
              '!'
            )}
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="space-y-2">
                <div className="h-5 w-24 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
              </div>
            ) : detail ? (
              <>
                <div className="text-[18px] font-semibold text-gray-900">
                  {detail.target.targetName}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <TargetTypeBadge type={detail.targetType} />
                  <StatusBadge status={detail.status} />
                </div>
              </>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="닫기"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 바디 */}
        <div className="max-h-[50vh] overflow-y-auto">
          {loading ? <SkeletonBody /> : detail ? (
            <ModalContent detail={detail} />
          ) : (
            <div className="py-16 text-center text-[13px] text-gray-400">
              데이터를 불러오지 못했습니다
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-end border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-2 text-[13px] font-semibold text-gray-600 hover:bg-gray-50"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

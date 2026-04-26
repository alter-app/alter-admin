import { useEffect, useRef, useState } from 'react'
import { fetchReports, type Report, type ReportTargetType, type ReportStatus } from '../api/reports'

const PAGE_SIZE = 10

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

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <tr key={i} className="border-b border-gray-50">
          <td className="py-4 pl-6 pr-3"><div className="h-4 w-5 animate-pulse rounded bg-gray-100" /></td>
          <td className="px-3 py-4"><div className="h-4 w-24 animate-pulse rounded bg-gray-100" /></td>
          <td className="px-3 py-4"><div className="h-6 w-14 animate-pulse rounded-full bg-gray-100" /></td>
          <td className="px-3 py-4"><div className="h-6 w-14 animate-pulse rounded-full bg-gray-100" /></td>
          <td className="px-3 py-4"><div className="h-4 w-24 animate-pulse rounded bg-gray-100" /></td>
          <td className="py-4 pl-3 pr-6"><div className="h-7 w-16 animate-pulse rounded-lg bg-gray-100" /></td>
        </tr>
      ))}
    </>
  )
}

export function ReportsTable() {
  const [reports, setReports] = useState<Report[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const isTotalLoadedRef = useRef(false)
  const [loading, setLoading] = useState(true)

  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null])
  const [pageIdx, setPageIdx] = useState(0)
  const [nextCursor, setNextCursor] = useState<string | null>(null)

  const [targetTypeFilter, setTargetTypeFilter] = useState<'' | ReportTargetType>('')
  const [statusFilter, setStatusFilter] = useState<'' | ReportStatus>('')

  const resetPagination = () => {
    setCursorStack([null])
    setPageIdx(0)
    isTotalLoadedRef.current = false
  }

  const handleTargetTypeFilter = (value: '' | ReportTargetType) => {
    setTargetTypeFilter(value)
    resetPagination()
  }

  const handleStatusFilter = (value: '' | ReportStatus) => {
    setStatusFilter(value)
    resetPagination()
  }

  const goNext = () => {
    if (!nextCursor) return
    setCursorStack(prev => [...prev.slice(0, pageIdx + 1), nextCursor])
    setPageIdx(prev => prev + 1)
  }

  const goPrev = () => {
    if (pageIdx === 0) return
    setPageIdx(prev => prev - 1)
  }

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    fetchReports({
      cursor: cursorStack[pageIdx],
      pageSize: PAGE_SIZE,
      targetType: targetTypeFilter || undefined,
      status: statusFilter || undefined,
      signal: controller.signal,
    })
      .then(res => {
        setReports(res.data)
        setNextCursor(res.page.cursor)
        if (!isTotalLoadedRef.current) {
          setTotalCount(res.page.totalCount)
          isTotalLoadedRef.current = true
        }
        setLoading(false)
      })
      .catch(err => {
        if ((err as Error).name === 'CanceledError') return
        setLoading(false)
      })

    return () => controller.abort()
  }, [pageIdx, cursorStack, targetTypeFilter, statusFilter])

  const formatDate = (iso: string) => iso.slice(0, 10).replace(/-/g, '.')
  const hasPrev = pageIdx > 0
  const hasNext = !!nextCursor

  return (
    <div>
      {/* 통계 카드 */}
      <div className="mb-6">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">전체 신고</div>
          {loading && totalCount === 0 ? (
            <div className="mt-2 h-9 w-24 animate-pulse rounded-lg bg-gray-100" />
          ) : (
            <div className="mt-2 text-[32px] font-semibold leading-none text-gray-900">
              {totalCount.toLocaleString()}
              <span className="ml-1 text-[14px] font-medium text-gray-400">건</span>
            </div>
          )}
        </div>
      </div>

      {/* 테이블 카드 */}
      <div className="rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* 툴바 */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
          <select
            value={targetTypeFilter}
            onChange={e => handleTargetTypeFilter(e.target.value as '' | ReportTargetType)}
            className="h-9 rounded-xl border border-gray-200 bg-gray-50 px-3 text-[13px] text-gray-600 outline-none focus:border-emerald-300 focus:bg-white"
          >
            <option value="">전체 대상</option>
            <option value="USER">회원</option>
            <option value="REPUTATION">평판</option>
            <option value="POSTING">게시글</option>
            <option value="WORKSPACE">업장</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => handleStatusFilter(e.target.value as '' | ReportStatus)}
            className="h-9 rounded-xl border border-gray-200 bg-gray-50 px-3 text-[13px] text-gray-600 outline-none focus:border-emerald-300 focus:bg-white"
          >
            <option value="">전체 상태</option>
            <option value="PENDING">대기</option>
            <option value="PROCESSING">처리중</option>
            <option value="RESOLVED">해결됨</option>
            <option value="REJECTED">거절됨</option>
            <option value="CANCELLED">취소됨</option>
            <option value="DELETED">삭제됨</option>
          </select>
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 pl-6 pr-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">#</th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">신고 대상</th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">대상 유형</th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">상태</th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">신고일</th>
                <th className="py-3 pl-3 pr-6 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">관리</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton />
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[13px] text-gray-400">
                    신고 내역이 없습니다
                  </td>
                </tr>
              ) : (
                reports.map((report, idx) => (
                  <tr key={report.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="py-4 pl-6 pr-3 text-[13px] text-gray-400">
                      {pageIdx * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-3 py-4 text-[13px] font-semibold text-gray-900">
                      {report.targetName}
                    </td>
                    <td className="px-3 py-4">
                      <TargetTypeBadge type={report.targetType} />
                    </td>
                    <td className="px-3 py-4">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="px-3 py-4 text-[13px] text-gray-600">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="py-4 pl-3 pr-6">
                      <button
                        type="button"
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-semibold text-gray-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <div className="text-[12px] text-gray-400">
            {!loading && `${pageIdx * PAGE_SIZE + 1}–${pageIdx * PAGE_SIZE + reports.length}번째 신고`}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={!hasPrev || loading}
              onClick={goPrev}
              className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              이전
            </button>
            <button
              type="button"
              disabled={!hasNext || loading}
              onClick={goNext}
              className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { badge, pages } from '@/shared/admin/data'
import { reportStatusTone } from '@/shared/admin/enums'
import { useReports } from '@/features/reports/hooks/useReports'
import { useAdminStore } from '@/shared/stores/useAdminStore'
import type { ReportListItem } from '@/features/reports/types'
import { ListView } from './ListView'
import type { ListConfig } from '../lists'

export function ReportsListView() {
  const openDetail = useAdminStore(s => s.openDetail)
  const [currentPage, setCurrentPage] = useState(1)

  const { data: pages_data, isLoading, fetchNextPage, hasNextPage } = useReports({ pageSize: 20 })

  const allItems = pages_data?.pages.flatMap(p => p.data) ?? []
  const totalCount = pages_data?.pages[0]?.page.totalCount ?? 0

  function toRow(r: ReportListItem) {
    const sb = badge(reportStatusTone(r.status.value))
    return {
      onOpen: () =>
        openDetail({
          type: 'report',
          row: {
            id: r.id,
            targetType: r.targetType.description,
            targetName: r.targetName,
            status: r.status.description,
            tone: reportStatusTone(r.status.value),
            createdAt: r.createdAt,
            reason: '',
            adminComment: '',
            updatedAt: r.createdAt,
          },
        }),
      cells: [
        { kind: 'text' as const, text: r.targetType.description, align: 'left' as const, color: '#232323', weight: 600 },
        { kind: 'text' as const, text: r.targetName, align: 'left' as const, color: '#5f5f5f', weight: 400 },
        { kind: 'badge' as const, text: r.status.description, bg: sb.bg, fg: sb.fg, align: 'center' as const },
        { kind: 'text' as const, text: r.createdAt, align: 'right' as const, color: '#828282', weight: 400 },
      ],
    }
  }

  const ESTIMATED_PAGES = Math.ceil(totalCount / 20) || 1

  const config: ListConfig = {
    title: '신고 관리',
    columns: [
      { label: '신고 대상 유형', align: 'left', width: '20%' },
      { label: '대상명', align: 'left', width: '34%' },
      { label: '상태', align: 'center', width: '16%' },
      { label: '신고일', align: 'right', width: '18%' },
    ],
    rows: isLoading ? [] : allItems.map(toRow),
    pages: pages(ESTIMATED_PAGES, currentPage),
    filters: [
      { kind: 'select', label: '대상 유형', options: ['전체', '사용자', '평판', '공고', '업장'] },
      { kind: 'select', label: '상태', options: ['전체', '대기중', '처리중', '완료', '거부됨'] },
    ],
  }

  return (
    <ListView
      config={config}
      currentPage={currentPage}
      totalPage={ESTIMATED_PAGES}
      onPageChange={(p) => {
        setCurrentPage(p)
        if (hasNextPage && p > (pages_data?.pages.length ?? 1)) fetchNextPage()
      }}
      isLoading={isLoading}
    />
  )
}

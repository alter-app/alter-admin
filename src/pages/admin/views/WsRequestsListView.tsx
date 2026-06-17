import { useState } from 'react'
import { badge, pages } from '@/shared/admin/data'
import { wsRequestStatusTone } from '@/shared/admin/enums'
import { useWorkspaceRequests } from '@/features/workspace-requests/hooks/useWorkspaceRequests'
import { useAdminStore } from '@/shared/stores/useAdminStore'
import type { WsRequestListItem } from '@/features/workspace-requests/types'
import { ListView } from './ListView'
import { workspaceTabs, type ListConfig } from '../lists'

export function WsRequestsListView() {
  const openDetail = useAdminStore(s => s.openDetail)
  const selectWorkspaceSub = useAdminStore(s => s.selectWorkspaceSub)
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 20

  const { data, isLoading } = useWorkspaceRequests({ page: currentPage, pageSize: PAGE_SIZE })

  function toRow(w: WsRequestListItem) {
    const sb = badge(wsRequestStatusTone(w.status.value))
    return {
      onOpen: () =>
        openDetail({
          type: 'wsRequest',
          row: {
            id: w.id,
            businessName: w.businessName,
            fullAddress: w.fullAddress,
            createdAt: w.createdAt,
            status: w.status.description,
            tone: wsRequestStatusTone(w.status.value),
            registrationNo: '',
            businessType: '',
            contact: '',
            lat: '',
            lng: '',
          },
        }),
      cells: [
        { kind: 'text' as const, text: w.businessName, align: 'left' as const, color: '#232323', weight: 600 },
        { kind: 'text' as const, text: w.fullAddress, align: 'left' as const, color: '#5f5f5f', weight: 400 },
        { kind: 'text' as const, text: w.createdAt, align: 'center' as const, color: '#828282', weight: 400 },
        { kind: 'badge' as const, text: w.status.description, bg: sb.bg, fg: sb.fg, align: 'right' as const },
      ],
    }
  }

  const totalPage = data?.page.totalPage ?? 1

  const config: ListConfig = {
    title: '업장 관리',
    subtitle: '업장 등록 신청 심사 · 승인 / 반려',
    tabs: workspaceTabs('requests', selectWorkspaceSub),
    columns: [
      { label: '업장명', align: 'left', width: '26%' },
      { label: '주소', align: 'left', width: '38%' },
      { label: '신청일', align: 'center', width: '16%' },
      { label: '상태', align: 'right', width: '16%' },
    ],
    rows: isLoading ? [] : (data?.data ?? []).map(toRow),
    pages: pages(totalPage, currentPage),
    filters: [
      { kind: 'select', label: '상태', options: ['전체', '승인대기', '활성화', '반려'] },
      { kind: 'input', label: '검색', placeholder: '업장명 / 주소' },
    ],
  }

  return (
    <ListView
      config={config}
      currentPage={currentPage}
      totalPage={totalPage}
      onPageChange={setCurrentPage}
      isLoading={isLoading}
    />
  )
}

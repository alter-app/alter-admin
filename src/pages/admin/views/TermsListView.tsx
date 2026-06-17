import { useState } from 'react'
import { badge, pages } from '@/shared/admin/data'
import { termsStatusTone } from '@/shared/admin/enums'
import { useTermsList } from '@/features/terms/hooks/useTerms'
import { useAdminStore } from '@/shared/stores/useAdminStore'
import type { TermsListItem } from '@/features/terms/types'
import { ListView } from './ListView'
import type { ListConfig } from '../lists'

export function TermsListView() {
  const openConfirm = useAdminStore(s => s.openConfirm)
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 20

  const { data, isLoading } = useTermsList({ page: currentPage, pageSize: PAGE_SIZE })

  function toRow(t: TermsListItem) {
    const sb = badge(termsStatusTone(t.status.value))
    return {
      onOpen: () =>
        openConfirm({
          title: t.title,
          desc: '약관 상세 조회 (상세 페이지 준비 중)',
          label: '확인',
          color: '#07c079',
        }),
      cells: [
        { kind: 'text' as const, text: t.type.description, align: 'left' as const, color: '#232323', weight: 600 },
        { kind: 'text' as const, text: t.version, align: 'left' as const, color: '#828282', weight: 400 },
        { kind: 'text' as const, text: t.title, align: 'left' as const, color: '#5f5f5f', weight: 400 },
        { kind: 'text' as const, text: t.required ? '필수' : '선택', align: 'center' as const, color: '#5f5f5f', weight: 400 },
        { kind: 'badge' as const, text: t.status.description, bg: sb.bg, fg: sb.fg, align: 'center' as const },
        { kind: 'text' as const, text: t.effectiveAt ?? '-', align: 'right' as const, color: '#828282', weight: 400 },
      ],
    }
  }

  const totalPage = data?.page.totalPage ?? 1

  const config: ListConfig = {
    title: '약관 관리',
    columns: [
      { label: '유형', align: 'left', width: '16%' },
      { label: '버전', align: 'left', width: '10%' },
      { label: '약관명', align: 'left', width: '30%' },
      { label: '필수 여부', align: 'center', width: '12%' },
      { label: '상태', align: 'center', width: '12%' },
      { label: '시행일', align: 'right', width: '16%' },
    ],
    rows: isLoading ? [] : (data?.data ?? []).map(toRow),
    pages: pages(totalPage, currentPage),
    filters: [
      { kind: 'select', label: '유형', options: ['전체', '서비스 이용약관', '개인정보 처리방침', '위치정보', '마케팅'] },
      { kind: 'select', label: '상태', options: ['전체', '작성중', '게시됨', '폐기됨'] },
    ],
    hasPrimary: true,
    primaryLabel: '+ 약관 생성',
    onPrimary: () =>
      openConfirm({
        title: '약관 생성',
        desc: '신규 약관 작성 폼으로 이동합니다. (준비 중)',
        label: '확인',
        color: '#07c079',
      }),
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

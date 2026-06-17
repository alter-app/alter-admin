import { useState } from 'react'
import { badge, pages } from '@/shared/admin/data'
import { userRoleTone, userStatusTone } from '@/shared/admin/enums'
import { useMembers } from '@/features/members/hooks/useMembers'
import { useAdminStore } from '@/shared/stores/useAdminStore'
import type { MemberListItem } from '@/features/members/types'
import { ListView } from './ListView'
import type { ListConfig } from '../lists'

export function MembersListView() {
  const openDetail = useAdminStore(s => s.openDetail)
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 20

  const { data, isLoading } = useMembers({ page: currentPage, pageSize: PAGE_SIZE })

  function toRow(m: MemberListItem) {
    const rb = badge(userRoleTone(m.role.value))
    const sb = badge(userStatusTone(m.status.value))
    return {
      onOpen: () =>
        openDetail({
          type: 'member',
          row: {
            id: m.id,
            email: m.email,
            name: m.name,
            nickname: m.nickname,
            role: m.role.description,
            roleTone: userRoleTone(m.role.value),
            status: m.status.description,
            statusTone: userStatusTone(m.status.value),
            createdAt: m.createdAt,
            contact: '',
            birthday: '',
            gender: '',
            updatedAt: '',
          },
        }),
      cells: [
        { kind: 'text' as const, text: m.email, align: 'left' as const, color: '#232323', weight: 600 },
        { kind: 'text' as const, text: m.name, align: 'left' as const, color: '#5f5f5f', weight: 400 },
        { kind: 'text' as const, text: m.nickname, align: 'left' as const, color: '#828282', weight: 400 },
        { kind: 'badge' as const, text: m.role.description, bg: rb.bg, fg: rb.fg, align: 'center' as const },
        { kind: 'badge' as const, text: m.status.description, bg: sb.bg, fg: sb.fg, align: 'center' as const },
        { kind: 'text' as const, text: m.createdAt, align: 'right' as const, color: '#828282', weight: 400 },
      ],
    }
  }

  const totalPage = data?.page.totalPage ?? 1

  const config: ListConfig = {
    title: '회원 관리',
    columns: [
      { label: '이메일', align: 'left', width: '22%' },
      { label: '이름', align: 'left', width: '10%' },
      { label: '닉네임', align: 'left', width: '12%' },
      { label: '권한', align: 'center', width: '12%' },
      { label: '상태', align: 'center', width: '12%' },
      { label: '가입일', align: 'right', width: '16%' },
    ],
    rows: isLoading ? [] : (data?.data ?? []).map(toRow),
    pages: pages(totalPage, currentPage),
    filters: [
      { kind: 'select', label: '상태', options: ['전체', '활성', '정지', '삭제됨'] },
      { kind: 'select', label: '권한', options: ['전체', '일반', '매니저', '관리자'] },
      { kind: 'input', label: '검색', placeholder: '이메일 / 이름 / 닉네임 / 연락처' },
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

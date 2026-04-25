import { useEffect, useState } from 'react'
import { fetchMembers, type Member, type MemberRole, type MemberStatus } from '../api/members'
import { MemberDetailModal } from './MemberDetailModal'

const PAGE_SIZE = 10

const ROLE_LABEL: Record<MemberRole, string> = {
  ROLE_USER: '일반회원',
  ROLE_MANAGER: '업장주',
  ROLE_ADMIN: '관리자',
}

const STATUS_LABEL: Record<MemberStatus, string> = {
  ACTIVE: '활성',
  SUSPENDED: '정지',
  DELETED: '탈퇴',
}

function RoleBadge({ role }: { role: MemberRole }) {
  const cls =
    role === 'ROLE_USER'
      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
      : role === 'ROLE_MANAGER'
        ? 'bg-violet-50 text-violet-700 ring-1 ring-violet-100'
        : 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${cls}`}>
      {ROLE_LABEL[role]}
    </span>
  )
}

function StatusBadge({ status }: { status: MemberStatus }) {
  const cls =
    status === 'ACTIVE'
      ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100'
      : status === 'SUSPENDED'
        ? 'bg-gray-100 text-gray-500'
        : 'bg-red-50 text-red-600 ring-1 ring-red-100'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${cls}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}

function StatCard({ label, value, loading }: { label: string; value: number; loading: boolean }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</div>
      {loading ? (
        <div className="mt-2 h-9 w-24 animate-pulse rounded-lg bg-gray-100" />
      ) : (
        <div className="mt-2 text-[32px] font-semibold leading-none text-gray-900">
          {value.toLocaleString()}
          <span className="ml-1 text-[14px] font-medium text-gray-400">명</span>
        </div>
      )}
    </div>
  )
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <tr key={i} className="border-b border-gray-50">
          <td className="py-4 pl-6 pr-3">
            <div className="h-4 w-5 animate-pulse rounded bg-gray-100" />
          </td>
          <td className="px-3 py-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-gray-100" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-20 animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-36 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          </td>
          <td className="px-3 py-4"><div className="h-4 w-24 animate-pulse rounded bg-gray-100" /></td>
          <td className="px-3 py-4"><div className="h-6 w-16 animate-pulse rounded-full bg-gray-100" /></td>
          <td className="px-3 py-4"><div className="h-4 w-24 animate-pulse rounded bg-gray-100" /></td>
          <td className="px-3 py-4"><div className="h-6 w-14 animate-pulse rounded-full bg-gray-100" /></td>
          <td className="py-4 pl-3 pr-6"><div className="h-7 w-16 animate-pulse rounded-lg bg-gray-100" /></td>
        </tr>
      ))}
    </>
  )
}

export function MembersTable() {
  const [members, setMembers] = useState<Member[]>([])
  const [pagination, setPagination] = useState({ totalCount: 0, totalPage: 1 })
  const [loading, setLoading] = useState(true)

  const [totalCount, setTotalCount] = useState(0)
  const [isTotalLoaded, setIsTotalLoaded] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'' | MemberRole>('')
  const [statusFilter, setStatusFilter] = useState<'' | MemberStatus>('')

  // 검색어 디바운스 (300ms) 및 페이지 리셋
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  // 회원 목록 조회
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    fetchMembers({
      page,
      pageSize: PAGE_SIZE,
      name: debouncedSearch || undefined,
      role: roleFilter || undefined,
      status: statusFilter || undefined,
      signal: controller.signal,
    })
      .then(res => {
        setMembers(res.data)
        setPagination({ totalCount: res.page.totalCount, totalPage: res.page.totalPage })
        if (!debouncedSearch && !roleFilter && !statusFilter) {
          setTotalCount(res.page.totalCount)
          setIsTotalLoaded(true)
        }
        setLoading(false)
      })
      .catch(err => {
        if ((err as Error).name === 'CanceledError') return
        setLoading(false)
      })

    return () => controller.abort()
  }, [page, debouncedSearch, roleFilter, statusFilter, refreshKey])

  const handleRoleFilter = (value: '' | MemberRole) => {
    setRoleFilter(value)
    setPage(1)
  }

  const handleStatusFilter = (value: '' | MemberStatus) => {
    setStatusFilter(value)
    setPage(1)
  }

  const formatDate = (iso: string) => iso.slice(0, 10).replace(/-/g, '.')

  return (
    <div>
      {/* 통계 카드 */}
      <div className="mb-6">
        <StatCard label="전체 회원" value={totalCount} loading={!isTotalLoaded} />
      </div>

      {/* 테이블 카드 */}
      <div className="rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* 툴바 */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
          <input
            type="text"
            placeholder="이름으로 검색..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9 min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 text-[13px] outline-none placeholder:text-gray-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
          <select
            value={roleFilter}
            onChange={e => handleRoleFilter(e.target.value as '' | MemberRole)}
            className="h-9 rounded-xl border border-gray-200 bg-gray-50 px-3 text-[13px] text-gray-600 outline-none focus:border-emerald-300 focus:bg-white"
          >
            <option value="">전체 역할</option>
            <option value="ROLE_USER">일반회원</option>
            <option value="ROLE_MANAGER">업장주</option>
            <option value="ROLE_ADMIN">관리자</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => handleStatusFilter(e.target.value as '' | MemberStatus)}
            className="h-9 rounded-xl border border-gray-200 bg-gray-50 px-3 text-[13px] text-gray-600 outline-none focus:border-emerald-300 focus:bg-white"
          >
            <option value="">전체 상태</option>
            <option value="ACTIVE">활성</option>
            <option value="SUSPENDED">정지</option>
            <option value="DELETED">탈퇴</option>
          </select>
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 pl-6 pr-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">#</th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">회원</th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">닉네임</th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">역할</th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">가입일</th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">상태</th>
                <th className="py-3 pl-3 pr-6 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">관리</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton />
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[13px] text-gray-400">
                    검색 결과가 없습니다
                  </td>
                </tr>
              ) : (
                members.map((member, idx) => (
                  <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="py-4 pl-6 pr-3 text-[13px] text-gray-400">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-700">
                          {member.name.slice(0, 1)}
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-gray-900">{member.name}</div>
                          <div className="text-[11px] text-gray-400">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-[13px] text-gray-600">{member.nickname}</td>
                    <td className="px-3 py-4">
                      <RoleBadge role={member.role.value} />
                    </td>
                    <td className="px-3 py-4 text-[13px] text-gray-600">{formatDate(member.createdAt)}</td>
                    <td className="px-3 py-4">
                      <StatusBadge status={member.status.value} />
                    </td>
                    <td className="py-4 pl-3 pr-6">
                      <button
                        type="button"
                        onClick={() => setSelectedMemberId(member.id)}
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
            {!loading && pagination.totalCount > 0
              ? `총 ${pagination.totalCount.toLocaleString()}명 중 ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, pagination.totalCount)}명`
              : !loading
                ? '결과 없음'
                : ''}
          </div>
          {pagination.totalPage > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                이전
              </button>
              {Array.from({ length: pagination.totalPage }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={[
                    'min-w-[32px] rounded-lg px-3 py-1.5 text-[13px] font-semibold',
                    p === page ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:bg-gray-100',
                  ].join(' ')}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={page === pagination.totalPage}
                onClick={() => setPage(p => p + 1)}
                className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedMemberId !== null && (
        <MemberDetailModal
          memberId={selectedMemberId}
          onClose={() => setSelectedMemberId(null)}
          onStatusChange={() => setRefreshKey(k => k + 1)}
        />
      )}
    </div>
  )
}

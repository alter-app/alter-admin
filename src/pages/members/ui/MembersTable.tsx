import { useState, useMemo } from 'react'

type MemberRole = 'WORKER' | 'EMPLOYER'
type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN'

type Member = {
  id: number
  name: string
  email: string
  contact: string
  role: MemberRole
  joinedAt: string
  status: MemberStatus
}

const MOCK_MEMBERS: Member[] = [
  { id: 1,  name: '김민준', email: 'kim.minjun@email.com',     contact: '010-1234-5678', role: 'WORKER',   joinedAt: '2025-01-15', status: 'ACTIVE' },
  { id: 2,  name: '이지은', email: 'lee.jieun@email.com',      contact: '010-2345-6789', role: 'WORKER',   joinedAt: '2025-02-20', status: 'ACTIVE' },
  { id: 3,  name: '박서준', email: 'park.seojun@email.com',    contact: '010-3456-7890', role: 'EMPLOYER', joinedAt: '2025-01-05', status: 'ACTIVE' },
  { id: 4,  name: '최유진', email: 'choi.yujin@email.com',     contact: '010-4567-8901', role: 'WORKER',   joinedAt: '2025-03-10', status: 'INACTIVE' },
  { id: 5,  name: '정하은', email: 'jung.haeun@email.com',     contact: '010-5678-9012', role: 'EMPLOYER', joinedAt: '2024-12-01', status: 'ACTIVE' },
  { id: 6,  name: '강도현', email: 'kang.dohyun@email.com',    contact: '010-6789-0123', role: 'WORKER',   joinedAt: '2025-04-05', status: 'ACTIVE' },
  { id: 7,  name: '윤서영', email: 'yoon.seoyeong@email.com',  contact: '010-7890-1234', role: 'WORKER',   joinedAt: '2025-03-20', status: 'ACTIVE' },
  { id: 8,  name: '임지호', email: 'lim.jiho@email.com',       contact: '010-8901-2345', role: 'EMPLOYER', joinedAt: '2024-11-15', status: 'ACTIVE' },
  { id: 9,  name: '조민지', email: 'jo.minji@email.com',       contact: '010-9012-3456', role: 'WORKER',   joinedAt: '2025-02-28', status: 'WITHDRAWN' },
  { id: 10, name: '신예은', email: 'shin.yeeun@email.com',     contact: '010-0123-4567', role: 'WORKER',   joinedAt: '2025-04-15', status: 'ACTIVE' },
  { id: 11, name: '오준혁', email: 'oh.junhyuk@email.com',     contact: '010-1234-9876', role: 'EMPLOYER', joinedAt: '2025-01-20', status: 'ACTIVE' },
  { id: 12, name: '황지수', email: 'hwang.jisu@email.com',     contact: '010-2345-0987', role: 'WORKER',   joinedAt: '2025-03-05', status: 'INACTIVE' },
  { id: 13, name: '문성민', email: 'moon.sungmin@email.com',   contact: '010-3456-1098', role: 'WORKER',   joinedAt: '2024-10-10', status: 'ACTIVE' },
  { id: 14, name: '백수진', email: 'baek.sujin@email.com',     contact: '010-4567-2109', role: 'EMPLOYER', joinedAt: '2025-02-10', status: 'ACTIVE' },
  { id: 15, name: '류준서', email: 'ryu.junseo@email.com',     contact: '010-5678-3210', role: 'WORKER',   joinedAt: '2026-04-22', status: 'ACTIVE' },
  { id: 16, name: '홍지민', email: 'hong.jimin@email.com',     contact: '010-6789-4321', role: 'WORKER',   joinedAt: '2026-04-23', status: 'WITHDRAWN' },
  { id: 17, name: '남다은', email: 'nam.daeun@email.com',      contact: '010-7890-5432', role: 'EMPLOYER', joinedAt: '2025-03-25', status: 'ACTIVE' },
  { id: 18, name: '전민서', email: 'jeon.minseo@email.com',    contact: '010-8901-6543', role: 'WORKER',   joinedAt: '2025-01-30', status: 'ACTIVE' },
  { id: 19, name: '장예서', email: 'jang.yeseo@email.com',     contact: '010-9012-7654', role: 'WORKER',   joinedAt: '2026-04-24', status: 'ACTIVE' },
  { id: 20, name: '고은별', email: 'ko.eunbyul@email.com',     contact: '010-0123-8765', role: 'EMPLOYER', joinedAt: '2025-02-05', status: 'ACTIVE' },
]

const PAGE_SIZE = 10

const ROLE_LABEL: Record<MemberRole, string> = { WORKER: '워커', EMPLOYER: '업장주' }
const STATUS_LABEL: Record<MemberStatus, string> = { ACTIVE: '활성', INACTIVE: '비활성', WITHDRAWN: '탈퇴' }

function RoleBadge({ role }: { role: MemberRole }) {
  const cls =
    role === 'WORKER'
      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
      : 'bg-violet-50 text-violet-700 ring-1 ring-violet-100'
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
      : status === 'INACTIVE'
        ? 'bg-gray-100 text-gray-500'
        : 'bg-red-50 text-red-600 ring-1 ring-red-100'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${cls}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}

export function MembersTable() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'ALL' | MemberRole>('ALL')
  const [statusFilter, setStatusFilter] = useState<'ALL' | MemberStatus>('ALL')
  const [page, setPage] = useState(1)

  const stats = useMemo(() => {
    const total = MOCK_MEMBERS.length
    const active = MOCK_MEMBERS.filter(m => m.status === 'ACTIVE').length
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const newThisWeek = MOCK_MEMBERS.filter(m => new Date(m.joinedAt) >= oneWeekAgo).length
    return { total, active, newThisWeek }
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return MOCK_MEMBERS.filter(m => {
      if (q && !m.name.includes(q) && !m.email.toLowerCase().includes(q)) return false
      if (roleFilter !== 'ALL' && m.role !== roleFilter) return false
      if (statusFilter !== 'ALL' && m.status !== statusFilter) return false
      return true
    })
  }, [search, roleFilter, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleRoleFilter = (value: 'ALL' | MemberRole) => {
    setRoleFilter(value)
    setPage(1)
  }

  const handleStatusFilter = (value: 'ALL' | MemberStatus) => {
    setStatusFilter(value)
    setPage(1)
  }

  return (
    <div>
      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">전체 회원</div>
          <div className="mt-2 text-[32px] font-semibold leading-none text-gray-900">
            {stats.total.toLocaleString()}
            <span className="ml-1 text-[14px] font-medium text-gray-400">명</span>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">활성 회원</div>
          <div className="mt-2 text-[32px] font-semibold leading-none text-gray-900">
            {stats.active.toLocaleString()}
            <span className="ml-1 text-[14px] font-medium text-gray-400">명</span>
          </div>
          <div className="mt-1.5 text-[12px] text-gray-400">
            활성 비율 {((stats.active / stats.total) * 100).toFixed(0)}%
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">이번 주 신규</div>
          <div className="mt-2 text-[32px] font-semibold leading-none text-emerald-700">
            {stats.newThisWeek.toLocaleString()}
            <span className="ml-1 text-[14px] font-medium text-emerald-400">명</span>
          </div>
          <div className="mt-1.5 text-[12px] text-gray-400">7일 내 가입</div>
        </div>
      </div>

      {/* 테이블 카드 */}
      <div className="rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* 툴바 */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
          <input
            type="text"
            placeholder="이름, 이메일로 검색..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="h-9 min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 text-[13px] outline-none placeholder:text-gray-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
          <select
            value={roleFilter}
            onChange={e => handleRoleFilter(e.target.value as 'ALL' | MemberRole)}
            className="h-9 rounded-xl border border-gray-200 bg-gray-50 px-3 text-[13px] text-gray-600 outline-none focus:border-emerald-300 focus:bg-white"
          >
            <option value="ALL">전체 역할</option>
            <option value="WORKER">워커</option>
            <option value="EMPLOYER">업장주</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => handleStatusFilter(e.target.value as 'ALL' | MemberStatus)}
            className="h-9 rounded-xl border border-gray-200 bg-gray-50 px-3 text-[13px] text-gray-600 outline-none focus:border-emerald-300 focus:bg-white"
          >
            <option value="ALL">전체 상태</option>
            <option value="ACTIVE">활성</option>
            <option value="INACTIVE">비활성</option>
            <option value="WITHDRAWN">탈퇴</option>
          </select>
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 pl-6 pr-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  #
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  회원
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  연락처
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  역할
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  가입일
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  상태
                </th>
                <th className="py-3 pl-3 pr-6 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  관리
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[13px] text-gray-400">
                    검색 결과가 없습니다
                  </td>
                </tr>
              ) : (
                paginated.map((member, idx) => (
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
                    <td className="px-3 py-4 text-[13px] text-gray-600">{member.contact}</td>
                    <td className="px-3 py-4">
                      <RoleBadge role={member.role} />
                    </td>
                    <td className="px-3 py-4 text-[13px] text-gray-600">
                      {member.joinedAt.replace(/-/g, '.')}
                    </td>
                    <td className="px-3 py-4">
                      <StatusBadge status={member.status} />
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
            {filtered.length > 0
              ? `총 ${filtered.length}명 중 ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)}명`
              : '결과 없음'}
          </div>
          {pageCount > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                이전
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={[
                    'min-w-[32px] rounded-lg px-3 py-1.5 text-[13px] font-semibold',
                    p === page
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-500 hover:bg-gray-100',
                  ].join(' ')}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={page === pageCount}
                onClick={() => setPage(p => p + 1)}
                className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { fetchMemberDetail, updateMemberStatus, updateMemberPassword, type MemberDetail, type MemberRole, type MemberStatus } from '../api/members'

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

const GENDER_LABEL: Record<string, string> = {
  GENDER_MALE: '남성',
  GENDER_FEMALE: '여성',
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
      {[5, 3, 2].map((rows, si) => (
        <div key={si}>
          <div className="mb-3 h-3 w-16 animate-pulse rounded bg-gray-100" />
          <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex gap-4 py-1">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const formatDate = (iso: string) => iso.slice(0, 10).replace(/-/g, '.')
const formatBirthday = (bd: string) =>
  bd.length === 8 ? `${bd.slice(0, 4)}.${bd.slice(4, 6)}.${bd.slice(6, 8)}` : bd

function ModalContent({ detail }: { detail: MemberDetail }) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <SectionTitle>기본 정보</SectionTitle>
        <dl>
          <InfoRow label="이메일"    value={detail.email} />
          <InfoRow label="닉네임"    value={detail.nickname} />
          <InfoRow label="연락처"    value={detail.contact} />
          <InfoRow label="생년월일"  value={formatBirthday(detail.birthday)} />
          <InfoRow label="성별"      value={GENDER_LABEL[detail.gender.value] ?? detail.gender.description} />
        </dl>
      </div>

      <div>
        <SectionTitle>계정 정보</SectionTitle>
        <dl>
          <InfoRow label="가입일"    value={formatDate(detail.createdAt)} />
          <InfoRow label="최종수정일" value={formatDate(detail.updatedAt)} />
        </dl>
      </div>

      {(detail.reputationSummary?.topKeywords?.length ?? 0) > 0 && (
        <div>
          <SectionTitle>평판 키워드</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {detail.reputationSummary!.topKeywords.map(kw => (
              <span
                key={kw.id}
                className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-[12px] font-medium text-gray-700 ring-1 ring-gray-100"
              >
                <span>{kw.emoji}</span>
                <span>{kw.description}</span>
                <span className="font-semibold text-emerald-600">{kw.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function MemberDetailModal({
  memberId,
  onClose,
  onStatusChange,
}: {
  memberId: number
  onClose: () => void
  onStatusChange?: () => void
}) {
  const [detail, setDetail] = useState<MemberDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [passwordUpdating, setPasswordUpdating] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setDetail(null)
    setLoading(true)

    fetchMemberDetail(memberId, controller.signal)
      .then(data => {
        setDetail(data)
        setLoading(false)
      })
      .catch(err => {
        if ((err as Error).name === 'CanceledError') return
        setLoading(false)
      })

    return () => controller.abort()
  }, [memberId])

  const handleStatusChange = async (newStatus: MemberStatus) => {
    if (updating) return
    setUpdating(true)
    try {
      await updateMemberStatus(memberId, newStatus)
      setDetail(prev => prev ? { ...prev, status: { ...prev.status, value: newStatus } } : null)
      onStatusChange?.()
    } finally {
      setUpdating(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!newPassword.trim() || passwordUpdating) return
    setPasswordUpdating(true)
    try {
      await updateMemberPassword(memberId, newPassword)
      setNewPassword('')
      setPasswordSuccess(true)
      setTimeout(() => setPasswordSuccess(false), 2500)
    } finally {
      setPasswordUpdating(false)
    }
  }

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
        {/* 모달 헤더 */}
        <div className="flex items-start gap-4 border-b border-gray-100 px-6 py-5">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-[20px] font-bold text-emerald-700">
            {loading ? (
              <div className="h-7 w-7 animate-pulse rounded-full bg-emerald-100" />
            ) : (
              detail?.name.slice(0, 1)
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
                <div className="text-[18px] font-semibold text-gray-900">{detail.name}</div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <RoleBadge role={detail.role.value} />
                  <StatusBadge status={detail.status.value} />
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

        {/* 모달 바디 */}
        <div className="max-h-[40vh] overflow-y-auto">
          {loading ? <SkeletonBody /> : detail ? (
            <ModalContent detail={detail} />
          ) : (
            <div className="py-16 text-center text-[13px] text-gray-400">
              데이터를 불러오지 못했습니다
            </div>
          )}
        </div>

        {/* 비밀번호 변경 (항상 보임) */}
        {!loading && detail && (
          <div className="border-t border-gray-100 px-6 py-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              비밀번호 변경
            </div>
            <div className="flex h-10 items-center rounded-xl border border-gray-200 bg-gray-50 focus-within:border-emerald-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="새 비밀번호 입력"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handlePasswordChange()}
                className="h-full flex-1 bg-transparent px-4 text-[13px] outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={e => { e.stopPropagation(); setShowPassword(v => !v) }}
                className="px-2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.73 10.73a3 3 0 0 0 4.24 4.24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="m1 1 22 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                )}
              </button>
              <div className="h-4 w-px bg-gray-200" />
              <button
                type="button"
                disabled={passwordUpdating}
                onClick={handlePasswordChange}
                className="rounded-r-xl px-4 text-[12px] font-semibold text-gray-700 hover:text-gray-900 disabled:cursor-not-allowed"
              >
                {passwordUpdating ? '변경 중' : '변경'}
              </button>
            </div>
            {passwordSuccess && (
              <p className="mt-2 text-[12px] font-medium text-emerald-600">
                비밀번호가 변경됐습니다.
              </p>
            )}
          </div>
        )}

        {/* 모달 푸터 - 상태 변경 */}
        {!loading && detail && detail.status.value !== 'DELETED' && (
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
            <span className="text-[12px] text-gray-400">상태 변경</span>
            <div className="flex gap-2">
              {detail.status.value === 'ACTIVE' && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusChange('SUSPENDED')}
                  className="rounded-xl border border-red-200 px-4 py-2 text-[12px] font-semibold text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {updating ? '처리 중...' : '정지'}
                </button>
              )}
              {detail.status.value === 'SUSPENDED' && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusChange('ACTIVE')}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-[12px] font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {updating ? '처리 중...' : '활성화'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useAdminStore } from '@/shared/stores/useAdminStore'
import { useUpdateMemberPassword } from '@/features/members/hooks/useMembers'
import {
  useCreateWorkspaceComment,
  useUpdateWorkspaceRequestStatus,
} from '@/features/workspace-requests/hooks/useWorkspaceRequests'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'

interface OverlayProps {
  maxWidth: number
  onClose: () => void
  cardStyle?: CSSProperties
  children: ReactNode
}

function Overlay({ maxWidth, onClose, cardStyle, children }: OverlayProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        animation: 'ovFade .15s ease',
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        style={{
          position: 'absolute',
          inset: 0,
          border: 'none',
          background: 'rgba(0,0,0,.8)',
          backdropFilter: 'blur(2px)',
          cursor: 'pointer',
        }}
      />
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth,
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 20px 50px rgba(0,0,0,.3)',
          animation: 'ovPop .2s ease',
          ...cardStyle,
        }}
      >
        {children}
      </div>
    </div>
  )
}

const fieldLabelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#5f5f5f',
}

const inputStyle: CSSProperties = {
  height: 50,
  padding: '0 16px',
  border: '1px solid #c3c3c3',
  borderRadius: 12,
  fontSize: 15,
  outline: 'none',
}

const cancelBtnStyle: CSSProperties = {
  flex: 1,
  height: 50,
  border: '1px solid #c3c3c3',
  borderRadius: 12,
  background: '#fff',
  color: '#5f5f5f',
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
}

function primaryBtnStyle(color: string): CSSProperties {
  return {
    flex: 1,
    height: 50,
    border: 'none',
    borderRadius: 12,
    background: color,
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: color === '#07c079' ? '0 2px 8px rgba(7,192,121,.3)' : 'none',
  }
}

function PasswordModal() {
  const closeModal = useAdminStore(s => s.closeModal)
  const passwordPayload = useAdminStore(s => s.passwordPayload)
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [error, setError] = useState('')

  const updatePw = useUpdateMemberPassword(passwordPayload?.userId ?? 0)

  async function handleSubmit() {
    if (newPw !== confirmPw) {
      setError('비밀번호가 일치하지 않습니다')
      return
    }
    if (newPw.length < 8) {
      setError('8자 이상 입력하세요')
      return
    }
    if (passwordPayload?.userId) {
      await updatePw.mutateAsync({ newPassword: newPw })
    }
    closeModal()
  }

  const subtitle = passwordPayload
    ? '선택한 회원의 비밀번호를 강제 변경합니다.'
    : '관리자 계정 비밀번호를 변경합니다.'

  return (
    <Overlay maxWidth={420} onClose={closeModal} cardStyle={{ padding: 28 }}>
      <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 600 }}>
        비밀번호 변경
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 13, color: '#828282' }}>
        {subtitle}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <span style={fieldLabelStyle}>새 비밀번호</span>
          <input
            type="password"
            value={newPw}
            onChange={e => setNewPw(e.target.value)}
            placeholder="새 비밀번호 입력 (8자 이상)"
            style={inputStyle}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <span style={fieldLabelStyle}>새 비밀번호 확인</span>
          <input
            type="password"
            value={confirmPw}
            onChange={e => setConfirmPw(e.target.value)}
            placeholder="한 번 더 입력"
            style={inputStyle}
          />
        </label>
        {error && (
          <p style={{ margin: 0, fontSize: 13, color: '#dc0000' }}>{error}</p>
        )}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        <button
          type="button"
          onClick={closeModal}
          className="adm-hover-f4"
          style={cancelBtnStyle}
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={updatePw.isPending}
          className="adm-hover-bright"
          style={primaryBtnStyle('#07c079')}
        >
          {updatePw.isPending ? '변경 중...' : '변경하기'}
        </button>
      </div>
    </Overlay>
  )
}

function RejectModal() {
  const closeModal = useAdminStore(s => s.closeModal)
  const rejectPayload = useAdminStore(s => s.rejectPayload)
  const workspaceRequestId = rejectPayload?.workspaceRequestId ?? 0
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const createComment = useCreateWorkspaceComment(workspaceRequestId)
  const updateStatus = useUpdateWorkspaceRequestStatus(workspaceRequestId)
  const pending = createComment.isPending || updateStatus.isPending

  async function handleSubmit() {
    const comment = reason.trim()
    if (!comment) {
      setError('반려 사유를 입력해 주세요.')
      return
    }
    if (comment.length > 255) {
      setError('반려 사유는 255자를 초과할 수 없습니다.')
      return
    }
    if (!workspaceRequestId) return
    try {
      // 사유 없이 반려되는 상황을 막기 위해 댓글 작성 → 상태 변경 순서로 처리
      await createComment.mutateAsync({ comment })
      await updateStatus.mutateAsync({ status: 'REVOKED' })
      closeModal()
    } catch (e) {
      setError(getAxiosErrorMessage(e, '반려 처리에 실패했습니다'))
    }
  }

  return (
    <Overlay maxWidth={460} onClose={closeModal} cardStyle={{ padding: 28 }}>
      <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 600 }}>
        반려 처리
      </h2>
      <p
        style={{
          margin: '0 0 20px',
          fontSize: 13,
          color: '#828282',
          lineHeight: 1.5,
        }}
      >
        작성한 사유로 신청 상태가{' '}
        <span style={{ color: '#dc0000', fontWeight: 600 }}>반려</span>로
        변경되고, 신청자에게 보이는{' '}
        <span style={{ fontWeight: 600, color: '#5f5f5f' }}>
          첫 운영자 댓글
        </span>
        로 등록됩니다.
      </p>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={fieldLabelStyle}>반려 사유</span>
          <span
            style={{
              fontSize: 12,
              color: reason.length >= 255 ? '#dc0000' : '#a3a3a3',
            }}
          >
            {reason.length}/255
          </span>
        </span>
        <textarea
          value={reason}
          onChange={e => {
            setReason(e.target.value)
            setError('')
          }}
          maxLength={255}
          placeholder="반려 사유를 입력하세요 (신청자에게 그대로 전달됩니다)"
          style={{
            minHeight: 108,
            padding: 14,
            border: '1px solid #c3c3c3',
            borderRadius: 12,
            fontSize: 14,
            fontFamily: 'inherit',
            lineHeight: 1.55,
            resize: 'vertical',
            outline: 'none',
          }}
        />
      </label>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 16,
            padding: '11px 13px',
            background: '#fdeaea',
            border: '1px solid #f3caca',
            borderRadius: 11,
            fontSize: 13,
            color: '#dc0000',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#dc0000"
            strokeWidth="1.9"
            strokeLinecap="round"
            style={{ flex: '0 0 auto' }}
          >
            <line x1="12" y1="8" x2="12" y2="13" />
            <line x1="12" y1="16.6" x2="12" y2="16.6" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        <button
          type="button"
          onClick={closeModal}
          className="adm-hover-f4"
          style={cancelBtnStyle}
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={pending}
          className="adm-hover-bright"
          style={primaryBtnStyle('#dc0000')}
        >
          {pending ? '처리 중...' : '반려 처리'}
        </button>
      </div>
    </Overlay>
  )
}

function ConfirmModal() {
  const closeModal = useAdminStore(s => s.closeModal)
  const cfg = useAdminStore(s => s.confirmCfg)
  if (!cfg) return null

  function handleConfirm() {
    closeModal()
    cfg?.onConfirm?.()
  }

  return (
    <Overlay
      maxWidth={340}
      onClose={closeModal}
      cardStyle={{ overflow: 'hidden' }}
    >
      <div style={{ padding: '30px 24px 24px', textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 600 }}>
          {cfg.title}
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: '#828282',
            lineHeight: 1.5,
          }}
        >
          {cfg.desc}
        </p>
      </div>
      <div style={{ display: 'flex', borderTop: '1px solid #e5e5e5' }}>
        <button
          type="button"
          onClick={closeModal}
          className="adm-hover-f8"
          style={{
            flex: 1,
            height: 56,
            border: 'none',
            background: '#fff',
            color: '#828282',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          취소
        </button>
        <div style={{ width: 1, background: '#e5e5e5' }} />
        <button
          type="button"
          onClick={handleConfirm}
          className="adm-hover-f8"
          style={{
            flex: 1,
            height: 56,
            border: 'none',
            background: '#fff',
            color: cfg.color,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {cfg.label}
        </button>
      </div>
    </Overlay>
  )
}

export function AdminModals() {
  const modal = useAdminStore(s => s.modal)
  if (modal === 'password') return <PasswordModal />
  if (modal === 'reject') return <RejectModal />
  if (modal === 'confirm') return <ConfirmModal />
  return null
}

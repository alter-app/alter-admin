import type { CSSProperties, ReactNode } from 'react'
import { useAdminStore } from '@/shared/stores/useAdminStore'

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
  const detail = useAdminStore(s => s.detail)
  const isMember = detail?.type === 'member'

  const subtitle = isMember
    ? `${detail.row.name} 회원의 비밀번호를 강제 변경합니다.`
    : '관리자 계정 비밀번호를 변경합니다.'

  const fields = isMember
    ? [
        { label: '새 비밀번호', placeholder: '새 비밀번호 입력' },
        { label: '새 비밀번호 확인', placeholder: '한 번 더 입력' },
      ]
    : [
        { label: '현재 비밀번호', placeholder: '현재 비밀번호 입력' },
        { label: '새 비밀번호', placeholder: '새 비밀번호 입력' },
        { label: '새 비밀번호 확인', placeholder: '한 번 더 입력' },
      ]

  return (
    <Overlay maxWidth={420} onClose={closeModal} cardStyle={{ padding: 28 }}>
      <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 600 }}>
        비밀번호 변경
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 13, color: '#828282' }}>
        {subtitle}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {fields.map(f => (
          <label
            key={f.label}
            style={{ display: 'flex', flexDirection: 'column', gap: 7 }}
          >
            <span style={fieldLabelStyle}>{f.label}</span>
            <input type="password" placeholder={f.placeholder} style={inputStyle} />
          </label>
        ))}
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
          onClick={closeModal}
          className="adm-hover-bright"
          style={primaryBtnStyle('#07c079')}
        >
          변경하기
        </button>
      </div>
    </Overlay>
  )
}

function RejectModal() {
  const closeModal = useAdminStore(s => s.closeModal)
  return (
    <Overlay maxWidth={440} onClose={closeModal} cardStyle={{ padding: 28 }}>
      <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 600 }}>
        반려 사유 등록
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 13, color: '#828282' }}>
        반려 사유는 신청자에게 전달되며 심사 메모에 기록됩니다.
      </p>
      <label
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 7,
          marginBottom: 14,
        }}
      >
        <span style={fieldLabelStyle}>반려 유형</span>
        <select
          style={{
            height: 48,
            padding: '0 14px',
            border: '1px solid #c3c3c3',
            borderRadius: 12,
            fontSize: 14,
            outline: 'none',
            background: '#fff',
          }}
        >
          <option>서류 미비</option>
          <option>정보 불일치</option>
          <option>중복 신청</option>
          <option>기타</option>
        </select>
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <span style={fieldLabelStyle}>상세 사유</span>
        <textarea
          placeholder="반려 사유를 입력하세요"
          style={{
            minHeight: 104,
            padding: 14,
            border: '1px solid #c3c3c3',
            borderRadius: 12,
            fontSize: 14,
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
          }}
        />
      </label>
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
          onClick={closeModal}
          className="adm-hover-bright"
          style={primaryBtnStyle('#dc0000')}
        >
          반려 처리
        </button>
      </div>
    </Overlay>
  )
}

function ConfirmModal() {
  const closeModal = useAdminStore(s => s.closeModal)
  const cfg = useAdminStore(s => s.confirmCfg)
  if (!cfg) return null
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
          onClick={closeModal}
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

import { useState } from 'react'
import { loginIDPW } from '@/features/auth/api/auth'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'

export function LoginPage() {
  const [contact, setContact] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginIDPW({ contact, password })
    } catch (err) {
      setError(getAxiosErrorMessage(err, '로그인에 실패했습니다'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f4f4',
      }}
    >
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: 20,
          padding: '48px 44px',
          width: 400,
          boxShadow: '0 4px 20px rgba(0,0,0,.06)',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
          <svg width="32" height="32" viewBox="0 0 600 600" fill="none" style={{ flex: '0 0 auto' }}>
            <path
              d="M300 0C465.685 0 600 134.315 600 300H300V600C134.315 600 0 465.685 0 300C0 134.315 134.315 0 300 0Z"
              fill="url(#llg0)"
            />
            <path
              d="M300 600C300 434.315 434.315 300 600 300L600 600L300 600Z"
              fill="url(#llg1)"
            />
            <defs>
              <linearGradient id="llg0" x1="0" y1="300" x2="600" y2="300" gradientUnits="userSpaceOnUse">
                <stop offset="0.485577" stopColor="#07C079" />
                <stop offset="1" stopColor="#0F7745" />
              </linearGradient>
              <linearGradient id="llg1" x1="600" y1="450" x2="300" y2="450" gradientUnits="userSpaceOnUse">
                <stop stopColor="#07C079" />
                <stop offset="1" stopColor="#0F7745" />
              </linearGradient>
            </defs>
          </svg>
          <span style={{ fontFamily: "'RixYeoljeongdo_Pro'", fontSize: 20, color: '#232323' }}>
            관리자 페이지
          </span>
        </div>

        <h1 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 700, color: '#232323' }}>로그인</h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#5f5f5f', marginBottom: 6 }}>
              휴대폰 번호
            </label>
            <input
              type="tel"
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="010XXXXXXXX"
              required
              style={{
                width: '100%',
                height: 44,
                padding: '0 14px',
                border: '1.5px solid #e5e5e5',
                borderRadius: 10,
                fontSize: 14,
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#5f5f5f', marginBottom: 6 }}>
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
              style={{
                width: '100%',
                height: 44,
                padding: '0 14px',
                border: '1.5px solid #e5e5e5',
                borderRadius: 10,
                fontSize: 14,
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <p style={{ margin: 0, fontSize: 13, color: '#dc0000', background: '#fdeaea', borderRadius: 8, padding: '10px 14px' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="adm-btn-primary"
            style={{
              marginTop: 8,
              height: 48,
              border: 'none',
              borderRadius: 12,
              background: '#07c079',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'filter .15s, transform .15s',
            }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}

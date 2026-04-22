import { useState } from 'react'
import { type AuthSession, type LoginResponse, saveAuthSession } from '@/shared/lib/auth'

export function LoginPage({ onLoginSuccess }: { onLoginSuccess: (session: AuthSession) => void }) {
  const [contact, setContact] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setSubmitting(true)

    try {
      const response = await fetch('/public/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error(`로그인 실패: ${response.status}`)
      }

      const result: LoginResponse = await response.json()
      saveAuthSession(result.data)
      onLoginSuccess(result.data)
    } catch (error) {
      setErrorMessage((error as Error).message || '로그인 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto mt-20 w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900">관리자 로그인</h1>
        <p className="mt-2 text-sm text-gray-500">아이디(연락처)와 비밀번호를 입력하세요.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">아이디(연락처)</span>
            <input
              type="text"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-emerald-500"
              placeholder="01012345678"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-emerald-500"
              placeholder="password123"
              required
            />
          </label>

          {errorMessage ? <p className="text-sm font-medium text-rose-600">{errorMessage}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}


import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginIDPW } from '@/shared/api/auth'
import { useAuthStore } from '@/shared/stores/useAuthStore'

export function LoginPage() {
  const [contact, setContact] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { isLoggedIn, token } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn && token) {
      navigate('/dashboard', { replace: true })
    }
  }, [isLoggedIn, token, navigate])

  const formatContact = (value: string) => {
    const onlyNumber = value.replace(/\D/g, '').slice(0, 11)
    if (onlyNumber.length < 4) return onlyNumber
    if (onlyNumber.length < 8) return `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3)}`
    return `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3, 7)}-${onlyNumber.slice(7)}`
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setSubmitting(true)

    try {
      await loginIDPW(contact, password)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      const apiError = error as { message?: string }
      setErrorMessage(apiError.message || '로그인 중 오류가 발생했습니다.')
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
              type="tel"
              value={contact}
              onChange={event => {
                setContact(formatContact(event.target.value))
                setErrorMessage('')
              }}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-emerald-500"
              placeholder="010-1234-5678"
              maxLength={13}
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={event => {
                setPassword(event.target.value)
                setErrorMessage('')
              }}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-emerald-500"
              placeholder="password"
              required
            />
          </label>

          {errorMessage && (
            <p className="text-sm font-medium text-rose-600">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={submitting || !contact.trim() || !password.trim()}
            className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}

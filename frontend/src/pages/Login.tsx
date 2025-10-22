import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { login } from '../services/auth'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setError(null)
    setFieldErrors({})
    setSubmitting(true)
    try {
      // basic client-side checks
      const nextFieldErrors: { email?: string; password?: string } = {}
      if (!email.trim()) nextFieldErrors.email = 'Email is required.'
      if (!password.trim()) nextFieldErrors.password = 'Password is required.'
      if (Object.keys(nextFieldErrors).length) {
        setFieldErrors(nextFieldErrors)
        return
      }
      await login({ email, password })
      navigate('/feed')
    } catch (e: any) {
      const data = e?.response?.data
      // For login failures, always show the banner message and avoid mapping
      // server errors to field-level to prevent duplicate messaging.
      setFieldErrors({})
      const message = data?.message || 'These credentials do not match our records.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-[28px] leading-8 font-bold tracking-[-0.02em]">Welcome to MiniTweet</h1>
        <p className="text-center text-[15px] leading-5 text-gray-600 mt-1">Connect with friends in 20 characters or less</p>

        <form className="mt-8 space-y-3" onSubmit={onSubmit}>
          {error && Object.keys(fieldErrors).length === 0 && (
            <div className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>
          )}
          <input
            type="text"
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={
              `w-full rounded-2xl bg-[rgba(18,20,25,0.09)] p-3 outline-none placeholder:text-[rgba(46,24,20,0.4)] placeholder:text-[15px] placeholder:leading-5 border ${fieldErrors.email ? 'border-red-500' : 'border-transparent'}`
            }
          />
          {fieldErrors.email && (
            <p className="text-[13px] leading-5 text-red-600">{fieldErrors.email}</p>
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            className={
              `w-full rounded-2xl bg-[rgba(18,20,25,0.09)] p-3 outline-none placeholder:text-[rgba(46,24,20,0.4)] placeholder:text-[15px] placeholder:leading-5 border ${fieldErrors.password ? 'border-red-500' : 'border-transparent'}`
            }
          />
          {fieldErrors.password && (
            <p className="text-[13px] leading-5 text-red-600">{fieldErrors.password}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 rounded-2xl bg-[#121419] text-white py-4 font-medium text-[15px] leading-5 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {submitting ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <Link
          to="/register"
          className="mt-3 block w-full text-center rounded-2xl border border-[rgba(18,20,25,0.2)] bg-white py-4 font-medium text-[15px] leading-5 cursor-pointer"
        >
          Create Account
        </Link>
      </div>
    </div>
  )
}



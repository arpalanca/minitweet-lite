import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { register } from '../services/auth'

export default function Register() {
	const navigate = useNavigate()
	const [first, setFirst] = useState('')
	const [last, setLast] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [fieldErrors, setFieldErrors] = useState<{ first?: string; last?: string; email?: string; password?: string }>({})

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (submitting) return
		setError(null)
		setFieldErrors({})
		setSubmitting(true)
		try {
			const passwordStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
			const nextFieldErrors: { first?: string; last?: string; email?: string; password?: string } = {}
			if (!first.trim()) nextFieldErrors.first = 'First name is required.'
			if (!last.trim()) nextFieldErrors.last = 'Surname is required.'
			if (!email.trim()) nextFieldErrors.email = 'Email is required.'
			if (!password.trim()) nextFieldErrors.password = 'Password is required.'
			else if (!passwordStrong.test(password)) {
				nextFieldErrors.password = 'Min 8 chars with uppercase, lowercase, number, and special character.'
			}
			if (Object.keys(nextFieldErrors).length) {
				setFieldErrors(nextFieldErrors)
				return
			}
			await register({
				name: `${first} ${last}`.trim(),
				email,
				password,
				password_confirmation: password,
			})
			navigate('/feed')
		} catch (e: any) {
			const data = e?.response?.data
			if (data?.errors) {
				setFieldErrors({
					email: data.errors.email?.[0],
					password: data.errors.password?.[0],
				})
			}
			const message = data?.message || 'Registration failed.'
			setError(message)
		} finally {
			setSubmitting(false)
		}
	}
	return (
		<div className="min-h-screen grid place-items-center px-4">
			<div className="w-full max-w-sm">
				<h1 className="text-center text-[28px] leading-8 font-bold tracking-[-0.02em]">Sign up with Email</h1>

				<form className="mt-8 space-y-3" onSubmit={onSubmit}>
					{error && (
						<div className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>
					)}
					<div className="grid grid-cols-2 gap-3">
						<div>
							<input
								type="text"
								placeholder="Firstname"
								value={first}
								onChange={(e) => setFirst(e.target.value)}
								className={`w-full rounded-2xl bg-[rgba(18,20,25,0.09)] p-3 outline-none placeholder:text-[rgba(46,24,20,0.4)] placeholder:text-[15px] placeholder:leading-5 border ${fieldErrors.first ? 'border-red-500' : 'border-transparent'}`}
							/>
							{fieldErrors.first && <p className="mt-1 text-[13px] leading-5 text-red-600">{fieldErrors.first}</p>}
						</div>
						<div>
							<input
								type="text"
								placeholder="Surname"
								value={last}
								onChange={(e) => setLast(e.target.value)}
								className={`w-full rounded-2xl bg-[rgba(18,20,25,0.09)] p-3 outline-none placeholder:text-[rgba(46,24,20,0.4)] placeholder:text-[15px] placeholder:leading-5 border ${fieldErrors.last ? 'border-red-500' : 'border-transparent'}`}
							/>
							{fieldErrors.last && <p className="mt-1 text-[13px] leading-5 text-red-600">{fieldErrors.last}</p>}
						</div>
					</div>
					<input
						type="email"
						placeholder="Email Address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={`w-full rounded-2xl bg-[rgba(18,20,25,0.09)] p-3 outline-none placeholder:text-[rgba(46,24,20,0.4)] placeholder:text-[15px] placeholder:leading-5 border ${fieldErrors.email ? 'border-red-500' : 'border-transparent'}`}
					/>
					{fieldErrors.email && <p className="text-[13px] leading-5 text-red-600">{fieldErrors.email}</p>}
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className={`w-full rounded-2xl bg-[rgba(18,20,25,0.09)] p-3 outline-none placeholder:text-[rgba(46,24,20,0.4)] placeholder:text-[15px] placeholder:leading-5 border ${fieldErrors.password ? 'border-red-500' : 'border-transparent'}`}
					/>
					{fieldErrors.password && <p className="text-[13px] leading-5 text-red-600">{fieldErrors.password}</p>}

					<button
						type="submit"
						disabled={submitting}
						className="w-full mt-6 rounded-2xl bg-[#121419] text-white py-4 font-medium text-[15px] leading-5 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
					>
						{submitting ? 'Creating…' : 'Create Account'}
					</button>

					<p className="text-center text-[13px] leading-[100%] text-[rgba(18,20,25,0.62)] mt-2">
						By signing up, you agree to our Terms &amp; Conditions.
					</p>
					<p className="text-center text-[13px] leading-[100%] text-[rgba(18,20,25,0.62)] mt-12">
						Have an account already?{' '}
						<Link to="/login" className="text-[#121419]">Log in</Link>
					</p>
				</form>
			</div>
		</div>
	)
}



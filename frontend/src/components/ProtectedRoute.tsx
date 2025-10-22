import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { http } from '../lib/http'

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
	const [loading, setLoading] = useState(true)
	const [authorized, setAuthorized] = useState(false)

	useEffect(() => {
		let mounted = true
		http.get('/api/user')
			.then(() => mounted && setAuthorized(true))
			.catch(() => mounted && setAuthorized(false))
			.finally(() => mounted && setLoading(false))
		return () => {
			mounted = false
		}
	}, [])

	if (loading) return null
	return authorized ? children : <Navigate to="/login" replace />
}



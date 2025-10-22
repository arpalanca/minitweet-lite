import { http, ensureCsrfCookie } from '../lib/http'

export type LoginPayload = { email: string; password: string }
export type RegisterPayload = { name: string; email: string; password: string; password_confirmation: string }

export async function login(payload: LoginPayload) {
	await ensureCsrfCookie()
	await http.post('/login', payload)
	return (await http.get('/api/user')).data
}

export async function register(payload: RegisterPayload) {
	await ensureCsrfCookie()
	await http.post('/register', payload)
	return (await http.get('/api/user')).data
}

export async function logout() {
	await http.post('/logout')
}



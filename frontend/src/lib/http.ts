import axios from 'axios'

export const http = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
	xsrfCookieName: 'XSRF-TOKEN',
	xsrfHeaderName: 'X-XSRF-TOKEN',
	headers: {
		'X-Requested-With': 'XMLHttpRequest',
		'Accept': 'application/json',
	},
})

export async function ensureCsrfCookie(): Promise<void> {
	await http.get('/sanctum/csrf-cookie')
}

function readCookie(name: string): string | null {
	const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'))
	return match ? decodeURIComponent(match[1]) : null
}

http.interceptors.request.use((config) => {
	// Explicitly attach CSRF header from cookie for cross-origin SPA requests
	const token = readCookie('XSRF-TOKEN')
	if (token) {
		config.headers = config.headers ?? {}
		;(config.headers as any)['X-XSRF-TOKEN'] = token
	}
	return config
})



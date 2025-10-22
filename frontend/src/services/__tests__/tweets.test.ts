import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as httpMod from '../../lib/http'
import { fetchTweets, createTweet } from '../../services/tweets'

describe('tweets service', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
	})

	it('fetchTweets forwards data from API', async () => {
		const mock = vi.spyOn(httpMod, 'http', 'get').mockReturnValue({ get: vi.fn() } as any)
		// fallback simple mock
		vi.spyOn(httpMod.http, 'get').mockResolvedValue({ data: { data: [{ id: 1, body: 'hi' }] } } as any)
		const res = await fetchTweets()
		expect(res.data[0].id).toBe(1)
	})

	it('createTweet posts payload', async () => {
		vi.spyOn(httpMod.http, 'post').mockResolvedValue({ data: { id: 1, body: 'hello' } } as any)
		const res = await createTweet({ body: 'hello' })
		expect(res.id).toBe(1)
	})
})



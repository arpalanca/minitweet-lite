import { http } from '../lib/http'

export type TweetPayload = { body: string }

export async function fetchTweets() {
	return (await http.get('/api/tweets')).data
}

export async function createTweet(payload: TweetPayload) {
	return (await http.post('/api/tweets', payload)).data
}

export async function likeTweet(id: number) {
	return (await http.post(`/api/tweets/${id}/like`)).data
}

export async function unlikeTweet(id: number) {
	return (await http.delete(`/api/tweets/${id}/like`)).data
}



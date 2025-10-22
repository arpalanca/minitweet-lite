import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../services/auth'
import { useState, useEffect } from 'react'
import { createTweet, fetchTweets, likeTweet, unlikeTweet } from '../services/tweets'
import { getAvatarUrl } from '../lib/avatar'
import { http } from '../lib/http'
import logoutIcon from '../assets/icons/logout.svg'
import sendIcon from '../assets/icons/tweet.svg'
import heartIcon from '../assets/icons/heart.svg'
import heartLikedIcon from '../assets/icons/heart-liked.svg'

type Tweet = { id: number; body: string; user: { id: number; name: string; email?: string }; liked_by?: { id: number }[]; }
type Me = { id: number; name: string; email?: string }

function TweetCard({ tweet, me, onToggleLike }: { tweet: Tweet; me: Me | null; onToggleLike: (t: Tweet, liked: boolean) => void }) {
  const liked = (tweet.liked_by?.length ?? 0) > 0
  return (
    <div className="rounded-2xl border border-[#F2F2F2] bg-white p-6">
      <div className="grid grid-cols-[40px_1fr] gap-3 font-inter">
        <img src={getAvatarUrl(tweet.user?.email ?? tweet.user?.id ?? 'u')} className="h-10 w-10 rounded-full col-start-1 row-start-1" />
        <div className="col-start-2 row-start-1">
          <div className="text-[13px] leading-4 font-semibold tracking-[-0.005em] text-[#1B2328]">{tweet.user?.name ?? 'User'}</div>
          <div className="mt-1 text-[13px] leading-4 tracking-[-0.005em] text-[#1B2328]">2h ago</div>
        </div>
        <p className="col-start-1 col-span-2 mt-3 text-[15px] leading-5 tracking-[-0.005em] text-[#1B2328] break-all">{tweet.body}</p>
        <div className="col-start-1 col-span-2 mt-4 flex items-center gap-2 text-[#1B2328]">
          <button onClick={() => onToggleLike(tweet, liked)} className="cursor-pointer">
            <img src={liked ? heartLikedIcon : heartIcon} className="h-5 w-5" />
          </button>
          <span className="text-[15px] leading-5 font-medium">{tweet.liked_by?.length ?? 0}</span>
        </div>
      </div>
    </div>
  )
}

export default function Feed() {
  const navigate = useNavigate()
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [me, setMe] = useState<Me | null>(null)
  const overLimit = body.length > 280

  async function load() {
    setLoading(true)
    try {
      const [meRes, listRes] = await Promise.all([
        http.get('/api/user'),
        fetchTweets(),
      ])
      setMe(meRes.data)
      setTweets(listRes.data ?? listRes)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onTweet() {
    const text = body.trim()
    if (!text || text.length > 280) return
    const t = await createTweet({ body: text })
    setTweets((cur) => [t, ...cur])
    setBody('')
  }

  async function onLogout() {
    await logout()
    navigate('/login')
  }

  async function onToggleLike(tweet: Tweet, liked: boolean) {
    try {
      if (liked) {
        await unlikeTweet(tweet.id)
        setTweets(cur => cur.map(t => t.id === tweet.id ? { ...t, liked_by: (t.liked_by || []).filter(u => u.id !== (me?.id ?? -1)) } : t))
      } else {
        await likeTweet(tweet.id)
        setTweets(cur => cur.map(t => t.id === tweet.id ? { ...t, liked_by: [ ...(t.liked_by || []), { id: me!.id } ] } : t))
      }
    } catch {}
  }

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex items-center justify-between px-8 py-6">
        <Link to="/feed" className="text-[#121419] text-[24px] leading-[100%] tracking-[-0.02em] font-bold cursor-pointer">MiniTweet</Link>
        <div className="flex items-center gap-3">
          <img src={getAvatarUrl(me?.email ?? me?.id ?? 'me')} className="h-8 w-8 rounded-full" />
          <button onClick={onLogout} className="flex items-center gap-2 text-[15px] leading-5 font-medium cursor-pointer" type="button">
            <img src={logoutIcon} className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4">
        <div className="rounded-2xl bg-white p-6 border border-[#F2F2F2]">
          <div className="flex items-start gap-3">
            <img src={getAvatarUrl(me?.email ?? me?.id ?? 'me')} className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <textarea
                placeholder="What's happening?"
                className="w-full resize-none rounded-lg bg-[rgba(18,20,25,0.09)] py-2 px-3 outline-none placeholder:text-[rgba(46,24,20,0.4)] placeholder:text-[15px] placeholder:leading-5"
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-[12px] leading-5 ${overLimit ? 'text-red-600' : 'text-[rgba(18,20,25,0.62)]'}`}>{Math.max(0, 280 - body.length)} characters remaining</span>
                <button disabled={overLimit} onClick={onTweet} className="inline-flex items-center gap-2 rounded-lg bg-[#121419] px-4 py-2 text-white text-[15px] leading-5 font-medium cursor-pointer disabled:opacity-60" type="button">
                  <img src={sendIcon} className="h-4 w-4" />
                  Tweet
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {tweets.map((t) => (
            <TweetCard key={t.id} tweet={t} me={me} onToggleLike={onToggleLike} />
          ))}
        </div>
      </main>
    </div>
  )
}



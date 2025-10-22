export function getAvatarUrl(seed: string | number, size = 40): string {
	const s = encodeURIComponent(String(seed))
	// DiceBear avatars are deterministic given the seed
	return `https://api.dicebear.com/8.x/thumbs/svg?seed=${s}&radius=50&scale=90`
}



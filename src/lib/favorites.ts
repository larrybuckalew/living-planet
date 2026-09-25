const KEY = 'lp-favorites'
const EVENT = 'lp-favorites-changed'

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id)
}

export function toggleFavorite(id: string): string[] {
  const list = getFavorites()
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // storage unavailable (private mode) — favorites just won't persist
  }
  window.dispatchEvent(new Event(EVENT))
  return next
}

export function onFavoritesChange(cb: () => void): () => void {
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}

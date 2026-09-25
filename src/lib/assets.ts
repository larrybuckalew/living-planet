/**
 * Resolve a public-asset path against the app's base URL so builds work
 * both at root (Verdent, local dev) and under a sub-path (GitHub Pages).
 */
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

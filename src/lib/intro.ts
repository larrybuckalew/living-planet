/** True once per browser session — gates the cinematic intro flythrough. */
export function shouldPlayIntro(): boolean {
  try {
    if (sessionStorage.getItem('lp-intro')) return false
    sessionStorage.setItem('lp-intro', '1')
    return true
  } catch {
    return false
  }
}

import { latLonToVec3 } from './globe'

export type SubsolarPoint = { lat: number; lon: number }

/** Approximate subsolar point (±4° longitude) — plenty for visual realism. */
export function subsolarPoint(date: Date = new Date()): SubsolarPoint {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0)
  const dayOfYear = (date.getTime() - start) / 86400000
  const lat = -23.44 * Math.cos(((360 / 365) * (dayOfYear + 10) * Math.PI) / 180)
  const utcHours =
    date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600
  let lon = -15 * (utcHours - 12)
  lon = ((lon + 540) % 360) - 180
  return { lat, lon }
}

/** Direction from the globe centre towards the sun, in scene space. */
export function sunDirection(date: Date = new Date()): { x: number; y: number; z: number } {
  const s = subsolarPoint(date)
  const v = latLonToVec3(s.lat, s.lon, 1).normalize()
  return { x: v.x, y: v.y, z: v.z }
}

/** Solar elevation angle in degrees at a location. */
export function solarElevation(lat: number, lon: number, date: Date = new Date()): number {
  const rad = Math.PI / 180
  const s = subsolarPoint(date)
  const dec = s.lat * rad
  const phi = lat * rad
  const ha = (s.lon - lon) * rad
  return (
    Math.asin(
      Math.sin(dec) * Math.sin(phi) + Math.cos(dec) * Math.cos(phi) * Math.cos(ha),
    ) / rad
  )
}

export type SunState = 'day' | 'twilight' | 'night'

export function sunState(lat: number, lon: number, date: Date = new Date()): SunState {
  const e = solarElevation(lat, lon, date)
  if (e > 0) return 'day'
  if (e > -6) return 'twilight'
  return 'night'
}

/** Local solar time (HH:MM) at a longitude — nature has no time zones. */
export function localSolarTime(lon: number, date: Date = new Date()): string {
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60
  const h = (utcHours + lon / 15 + 24) % 24
  let hh = Math.floor(h)
  let mm = Math.round((h - hh) * 60)
  if (mm === 60) {
    mm = 0
    hh = (hh + 1) % 24
  }
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

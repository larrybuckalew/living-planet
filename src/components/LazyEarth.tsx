import { lazy } from 'react'

/** three.js + the globe live in their own chunk, loaded only when a globe is on screen. */
const Earth = lazy(() => import('@/components/Earth'))

export default Earth

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Suspense } from 'react'
import LazyEarth from '@/components/LazyEarth'
import GlobeControls from '@/components/GlobeControls'
import GlobeSkeleton from '@/components/GlobeSkeleton'
import PlaceCard from '@/components/PlaceCard'
import { getPlace, places } from '@/data/places'
import { localSolarTime, sunState } from '@/lib/sun'
import { isFavorite, toggleFavorite } from '@/lib/favorites'
import { setAmbience } from '@/lib/ambient'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M10 2.5 12.2 7.3 17.5 8 13.7 11.6 14.7 16.8 10 14.2 5.3 16.8 6.3 11.6 2.5 8 7.8 7.3 10 2.5Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Destination() {
  const { slug } = useParams()
  const [night, setNight] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const place = getPlace(slug)
  const [fav, setFav] = useState(() => isFavorite(place?.id ?? ''))

  useEffect(() => {
    setFav(isFavorite(place?.id ?? ''))
  }, [place?.id])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (place) setAmbience(place.ambience)
  }, [place])

  if (!place) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-6 pt-24">
        <h1 className="font-display text-4xl font-light text-fg">This place is not on the map yet</h1>
        <p className="mt-4 text-sm text-mist">The Atlas is still growing.</p>
        <Link
          to="/"
          className="mt-8 inline-flex h-11 w-fit items-center rounded-full bg-amber px-6 text-sm font-medium text-[#10261b] transition hover:brightness-110"
        >
          Back to the globe
        </Link>
      </main>
    )
  }

  const others = places.filter((p) => p.id !== place.id).slice(0, 3)

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease }}>
      <section className="relative min-h-[680px] lg:min-h-[85vh]">
        <div className="absolute inset-0">
          <Suspense fallback={<GlobeSkeleton />}>
            <LazyEarth focus={{ lat: place.lat, lon: place.lon }} night={night} />
          </Suspense>
        </div>
        <GlobeControls night={night} onToggleNight={() => setNight(n => !n)} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-forest" />

        <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col px-6 pb-16 pt-28 lg:min-h-[85vh] lg:pt-32">
          <Link
            to="/#journeys"
            className="group inline-flex w-fit items-center gap-2 text-[13px] font-medium text-mist transition-colors hover:text-fg"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
              <path d="M14 8H3M7 3.5 2.5 8 7 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All journeys
          </Link>

          <motion.div {...fadeUp} transition={{ duration: 0.9, delay: 0.15, ease }} className="mt-8 max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber">
              Journey over {place.name.split(' ')[0]}
            </p>
            <div className="mt-3 flex items-start justify-between gap-4">
              <h1 className="font-display text-[clamp(2.5rem,5.5vw,4.75rem)] font-light leading-[1.04] text-fg">
                {place.name}
              </h1>
              <button
                type="button"
                onClick={() => setFav(toggleFavorite(place.id).includes(place.id))}
                aria-pressed={fav}
                aria-label={fav ? 'Remove from my journeys' : 'Save to my journeys'}
                title={fav ? 'Saved to my journeys' : 'Save to my journeys'}
                className={`mt-3 shrink-0 rounded-full border p-2.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber ${
                  fav
                    ? 'border-amber/70 text-amber'
                    : 'border-fg/20 text-mist hover:text-fg'
                }`}
              >
                <StarIcon filled={fav} />
              </button>
            </div>
            <span className="mt-4 inline-block font-mono text-sm text-amber">
              {place.lat.toFixed(2)}, {place.lon.toFixed(2)}
            </span>
            <p className="mt-1 font-mono text-sm text-mist" aria-live="off">
              {localSolarTime(place.lon, now)} local ·{' '}
              {sunState(place.lat, place.lon, now).charAt(0).toUpperCase() +
                sunState(place.lat, place.lon, now).slice(1)}{' '}
              over this place right now
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.9, delay: 0.3, ease }}
            className="mt-auto w-full max-w-xl rounded-2xl border border-fg/10 bg-pine p-6 shadow-[0_32px_96px_-32px_rgba(0,0,0,0.9)] md:p-8"
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {place.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-mist">
                    {stat.label}
                  </p>
                  <p className="mt-1 font-display text-xl text-fg">{stat.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-mist">{place.description[0]}</p>
            <p className="mt-3 text-sm leading-relaxed text-mist">{place.description[1]}</p>
            <Link
              to="/atlas"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-amber px-6 text-sm font-medium text-[#10261b] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
            >
              Open the Atlas
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber">
            Continue the journey
          </p>
          <h2 className="mt-3 font-display text-3xl font-light text-fg">Nearby in spirit</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {others.map((other) => (
              <PlaceCard key={other.id} place={other} />
            ))}
          </div>
        </div>
      </section>
    </motion.main>
  )
}

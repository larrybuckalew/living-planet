import { useState, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import LazyEarth from '@/components/LazyEarth'
import GlobeControls from '@/components/GlobeControls'
import GlobeSkeleton from '@/components/GlobeSkeleton'
import { featuredPlace } from '@/data/places'

const ease = [0.22, 1, 0.36, 1] as const

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 8h11M9 3.5 13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Hero({ intro = false }: { intro?: boolean }) {
  const [night, setNight] = useState(false)
  // Hold the headline until the camera has started its dolly-in.
  const d = intro ? 0.9 : 0.15

  return (
    <section className="relative min-h-[680px] lg:min-h-[82vh]">
      <div className="absolute inset-0">
        <Suspense fallback={<GlobeSkeleton />}>
          <LazyEarth night={night} intro={intro} />
        </Suspense>
      </div>
      <GlobeControls night={night} onToggleNight={() => setNight(n => !n)} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-forest" />

      <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col px-6 pb-16 pt-28 lg:min-h-[82vh] lg:pt-36">
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: d, ease }}
          className="max-w-xl font-display text-[clamp(2.75rem,6.5vw,6rem)] font-light leading-[1.02] tracking-[-0.01em] text-fg"
        >
          See the Earth
          <br />
          breathe
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: d + 0.2, ease }}
          className="mt-5 max-w-md text-[15px] leading-relaxed text-mist"
        >
          A living, spinning globe. Drag to orbit the planet, and follow the sunset as it crosses
          the continents.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: d + 0.4, ease }}
          className="mt-auto w-full max-w-md rounded-2xl border border-fg/10 bg-pine p-6 shadow-[0_32px_96px_-32px_rgba(0,0,0,0.9)]"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber">
            Featured flight
          </p>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="font-display text-2xl text-fg">{featuredPlace.name}</h2>
            <span className="font-mono text-xs text-amber">
              {featuredPlace.lat.toFixed(2)}, {featuredPlace.lon.toFixed(2)}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-mist">
            The planet&rsquo;s largest rainforest, breathing out a fifth of its oxygen. Glide over
            the flooded canopy as sunset crosses the terminator line.
          </p>
          <Link
            to={`/destination/${featuredPlace.id}`}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-amber px-6 text-sm font-medium text-[#10261b] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
          >
            Visit this place
            <ArrowIcon />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

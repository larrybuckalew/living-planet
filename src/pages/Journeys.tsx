import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { collections, getPlace } from '@/data/places'
import { satelliteCrop } from '@/lib/globe'
import { assetUrl } from '@/lib/assets'

const ease = [0.22, 1, 0.36, 1] as const

export default function Journeys() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease }}
      className="mx-auto max-w-7xl px-6 pb-24 pt-32"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber">Journeys</p>
      <h1 className="mt-3 max-w-xl font-display text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1.05] text-fg">
        Guided trails across the planet
      </h1>
      <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-mist">
        Each journey threads a handful of places into one story. Follow it start to finish, or
        drop into any stop along the way.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {collections.map((collection, i) => {
          const stops = collection.placeIds
            .map(getPlace)
            .filter((p): p is NonNullable<typeof p> => Boolean(p))
          return (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: (i % 2) * 0.1, ease }}
            >
              <Link
                to={`/journeys/${collection.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-fg/10 bg-forest transition-colors hover:border-amber/50"
              >
                <div className="grid aspect-[8/3] grid-cols-4">
                  {stops.map((stop) => (
                    <div
                      key={stop.id}
                      role="img"
                      aria-label={`Satellite view of ${stop.name}`}
                      className="h-full w-full bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${assetUrl('textures-opt/earth-blue-marble.webp')})`,
                        ...satelliteCrop(stop.lat, stop.lon, 8),
                      }}
                    />
                  ))}
                </div>
                <div className="flex flex-1 flex-col px-6 py-5">
                  <h2 className="font-display text-2xl font-light text-fg">{collection.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{collection.blurb}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-amber">
                    {stops.length} stops
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.main>
  )
}

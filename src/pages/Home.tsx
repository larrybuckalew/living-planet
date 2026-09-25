import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hero from '@/sections/Hero'
import Destinations from '@/sections/Destinations'
import { getPlace } from '@/data/places'
import { shouldPlayIntro } from '@/lib/intro'
import { getFavorites, onFavoritesChange } from '@/lib/favorites'

const ease = [0.22, 1, 0.36, 1] as const

export default function Home() {
  const [intro] = useState(shouldPlayIntro)
  const [favs, setFavs] = useState<string[]>(getFavorites)

  useEffect(
    () =>
      onFavoritesChange(() => {
        setFavs(getFavorites())
      }),
    [],
  )

  const favPlaces = favs.map(getPlace).filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease }}
    >
      <Hero intro={intro} />
      <Destinations />

      {favPlaces.length > 0 && (
        <section className="border-t border-fg/10">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber">
              Saved on this device
            </p>
            <h2 className="mt-3 font-display text-2xl font-light text-fg">My journeys</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {favPlaces.map((place) => (
                <Link
                  key={place.id}
                  to={`/destination/${place.id}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-fg/15 px-4 text-sm text-fg/85 transition-colors hover:border-amber/60 hover:text-amber"
                >
                  <svg width="13" height="13" viewBox="0 0 20 20" className="text-amber" aria-hidden="true">
                    <path
                      d="M10 2.5 12.2 7.3 17.5 8 13.7 11.6 14.7 16.8 10 14.2 5.3 16.8 6.3 11.6 2.5 8 7.8 7.3 10 2.5Z"
                      fill="currentColor"
                    />
                  </svg>
                  {place.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="atlas" className="border-t border-fg/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-light text-fg">
              The whole world, one orbit away
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-mist">
              Every place in the Atlas is a living scene — real satellite imagery, real
              coordinates, real stories.
            </p>
          </div>
          <Link
            to="/atlas"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-amber/70 px-6 text-sm font-medium text-amber transition hover:bg-amber hover:text-[#10261b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
          >
            Open the Atlas
          </Link>
        </div>
      </section>
    </motion.main>
  )
}

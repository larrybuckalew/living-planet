import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { places } from '@/data/places'
import PlaceCard from '@/components/PlaceCard'

const ease = [0.22, 1, 0.36, 1] as const

export default function Atlas() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return places
    return places.filter(
      (p) => p.name.toLowerCase().includes(q) || p.blurb.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease }}
      className="mx-auto max-w-7xl px-6 pb-24 pt-32"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber">The Atlas</p>
      <div className="mt-3 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <h1 className="max-w-xl font-display text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1.05] text-fg">
          Every place on the planet
        </h1>
        <div className="w-full max-w-sm">
          <label htmlFor="atlas-search" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mist">
            Search
          </label>
          <input
            id="atlas-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rainforest, desert, ice…"
            className="mt-2 h-11 w-full border-b border-fg/25 bg-transparent text-sm text-fg placeholder:text-mist/60 focus:border-amber focus:outline-none"
          />
        </div>
      </div>

      <p className="mt-6 font-mono text-xs text-mist" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'place' : 'places'}
        {query.trim() ? ` matching “${query.trim()}”` : ''}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((place, i) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease }}
          >
            <PlaceCard place={place} />
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 font-display text-2xl font-light text-mist">
          Nothing here yet — but the planet is big. Try another word.
        </p>
      )}
    </motion.main>
  )
}

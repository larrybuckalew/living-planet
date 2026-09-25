import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCollection, getPlace } from '@/data/places'
import PlaceCard from '@/components/PlaceCard'

const ease = [0.22, 1, 0.36, 1] as const

export default function CollectionDetail() {
  const { id } = useParams()
  const collection = getCollection(id)

  if (!collection) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-6 pt-24">
        <h1 className="font-display text-4xl font-light text-fg">This journey does not exist yet</h1>
        <Link
          to="/journeys"
          className="mt-8 inline-flex h-11 w-fit items-center rounded-full bg-amber px-6 text-sm font-medium text-[#10261b] transition hover:brightness-110"
        >
          All journeys
        </Link>
      </main>
    )
  }

  const stops = collection.placeIds
    .map(getPlace)
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease }}
      className="mx-auto max-w-7xl px-6 pb-24 pt-32"
    >
      <Link
        to="/journeys"
        className="group inline-flex w-fit items-center gap-2 text-[13px] font-medium text-mist transition-colors hover:text-fg"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
          <path d="M14 8H3M7 3.5 2.5 8 7 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All journeys
      </Link>

      <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber">
        Journey · {stops.length} stops
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1.05] text-fg">
        {collection.title}
      </h1>
      <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-mist">{collection.blurb}</p>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stops.map((stop, i) => (
          <motion.div
            key={stop.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease }}
          >
            <PlaceCard place={stop} />
          </motion.div>
        ))}
      </div>
    </motion.main>
  )
}

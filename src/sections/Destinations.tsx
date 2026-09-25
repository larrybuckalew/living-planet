import { Link } from 'react-router-dom'
import { places } from '@/data/places'
import PlaceCard from '@/components/PlaceCard'

const featured = places.filter((p) =>
  ['andes', 'galapagos', 'amazon-delta'].includes(p.id),
)

export default function Destinations() {
  return (
    <section id="journeys" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber">
          More places to breathe
        </p>
        <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-xl font-display text-[clamp(2rem,4vw,3.25rem)] font-light leading-[1.08] text-fg">
            Places to breathe
          </h2>
          <div className="flex items-center gap-6">
            <Link to="/journeys" className="group inline-flex items-center gap-2 text-[13px] font-medium text-fg/80 transition-colors hover:text-fg">
              Journeys
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link to="/atlas" className="group inline-flex items-center gap-2 text-[13px] font-medium text-amber">
              Open the Atlas
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {featured.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </div>
    </section>
  )
}

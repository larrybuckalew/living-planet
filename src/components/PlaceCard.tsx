import { Link } from 'react-router-dom'
import type { Place } from '@/data/places'
import { satelliteCrop } from '@/lib/globe'
import { assetUrl } from '@/lib/assets'

export default function PlaceCard({ place }: { place: Place }) {
  return (
    <Link
      to={`/destination/${place.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-fg/10 bg-forest transition-colors hover:border-amber/50"
    >
      <div
        role="img"
        aria-label={`Satellite view of ${place.name}`}
        className="aspect-[4/3] w-full bg-no-repeat transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage: `url(${assetUrl('textures-opt/earth-blue-marble.webp')})`,
          ...satelliteCrop(place.lat, place.lon),
        }}
      />
      <div className="flex flex-1 flex-col px-5 py-4">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-lg text-fg">{place.name}</h3>
          <span className="shrink-0 font-mono text-xs text-amber">
            {place.lat.toFixed(2)}, {place.lon.toFixed(2)}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-mist">{place.blurb}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-amber opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Fly here
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M2 8h11M9 3.5 13.5 8 9 12.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  )
}

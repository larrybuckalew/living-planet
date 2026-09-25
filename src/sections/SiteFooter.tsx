import { Link } from 'react-router-dom'

export default function SiteFooter() {
  return (
    <footer id="about" className="relative border-t border-fg/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="font-display text-base lowercase text-fg">
          living planet
        </Link>
        <nav className="flex flex-wrap gap-8" aria-label="Footer">
          <Link
            to="/atlas"
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mist transition-colors hover:text-fg"
          >
            Atlas
          </Link>
          <Link
            to="/#journeys"
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mist transition-colors hover:text-fg"
          >
            Journeys
          </Link>
          <Link
            to="/"
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mist transition-colors hover:text-fg"
          >
            Home
          </Link>
        </nav>
        <span className="font-mono text-xs text-mist">Imagery: NASA. © 2026</span>
      </div>
    </footer>
  )
}

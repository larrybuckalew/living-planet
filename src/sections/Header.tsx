import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-forest/95 via-forest/60 to-transparent" />
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5" aria-label="Primary">
        <Link to="/" className="font-display text-lg lowercase tracking-[-0.01em] text-fg">
          living planet
        </Link>
        <div className="hidden items-center gap-8 sm:flex">
          <NavLink
            to="/atlas"
            className={({ isActive }) =>
              `text-[13px] font-medium transition-colors hover:text-fg ${
                isActive ? 'text-amber' : 'text-fg/70'
              }`
            }
          >
            Atlas
          </NavLink>
          <NavLink
            to="/journeys"
            className={({ isActive }) =>
              `text-[13px] font-medium transition-colors hover:text-fg ${
                isActive ? 'text-amber' : 'text-fg/70'
              }`
            }
          >
            Journeys
          </NavLink>
          <Link to="/#journeys" className="text-[13px] font-medium text-fg/70 transition-colors hover:text-fg">
            Places
          </Link>
          <a href="#about" className="text-[13px] font-medium text-fg/70 transition-colors hover:text-fg">
            About
          </a>
          <Link
            to="/atlas"
            className="inline-flex h-10 items-center rounded-full border border-fg/25 px-5 text-[13px] font-medium text-fg transition-colors hover:border-amber hover:text-amber"
          >
            Explore
          </Link>
        </div>
        <Link
          to="/atlas"
          className="inline-flex h-10 items-center rounded-full border border-fg/25 px-4 text-[13px] font-medium text-fg sm:hidden"
        >
          Explore
        </Link>
      </nav>
    </header>
  )
}

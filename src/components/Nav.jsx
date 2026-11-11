import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { NAV_LINKS, IDENTITY } from '../content'

/**
 * Nav — sticky top nav.
 * Active domain link shifts the accent colour via CSS custom property.
 * Collapses to hamburger on mobile.
 */
export default function Nav() {
  const location = useLocation()
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef(null)

  // Detect active domain accent
  const activeLink = NAV_LINKS.find(l => l.href !== '/' && location.pathname.startsWith(l.href))
  const accentColor = activeLink?.color ?? '#00e5ff'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [location.pathname])

  return (
    <header
      ref={navRef}
      role="banner"
      style={{ '--accent': accentColor }}
      className={`fixed inset-x-0 top-0 z-50 h-nav transition-all duration-300 ${
        scrolled ? 'bg-base/90 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="container-grid flex h-full items-center justify-between">
        {/* Logo / wordmark */}
        <NavLink
          to="/"
          aria-label={`${IDENTITY.name} — home`}
          className="font-display text-xl font-bold tracking-tight text-text hover:text-[var(--accent)] transition-colors duration-200"
        >
          {IDENTITY.name.split(' ')[0]}
          <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] align-middle" />
        </NavLink>

        {/* Desktop links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href, color }) => (
            <NavLink
              key={href}
              to={href}
              style={({ isActive }) => isActive ? { color } : {}}
              className={({ isActive }) =>
                `font-mono text-xs uppercase tracking-widest transition-colors duration-200 ${
                  isActive ? 'opacity-100' : 'text-muted hover:text-text'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={`block h-px w-6 bg-text transition-transform duration-200 ${open ? 'translate-y-2.5 rotate-45' : ''}`} />
          <span className={`block h-px w-6 bg-text transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-px w-6 bg-text transition-transform duration-200 ${open ? '-translate-y-2.5 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden absolute inset-x-0 top-nav border-b border-border bg-surface/95 backdrop-blur-md"
        >
          <ul className="container-grid flex flex-col py-4 gap-1">
            {NAV_LINKS.map(({ label, href, color }) => (
              <li key={href}>
                <NavLink
                  to={href}
                  style={({ isActive }) => isActive ? { color } : {}}
                  className="block py-3 font-mono text-xs uppercase tracking-widest text-muted hover:text-text transition-colors"
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

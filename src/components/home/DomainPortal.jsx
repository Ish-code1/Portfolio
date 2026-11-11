import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * DomainPortal — a single animated card linking to a domain page.
 * Props:
 *  label, href, color, icon (JSX), description, index (stagger delay)
 */
export default function DomainPortal({ label, href, color, icon, description, index = 0 }) {
  const cardRef = useRef(null)
  const reduced = useReducedMotion()

  /* ── Scroll-reveal stagger ───────────────────────────────────── */
  useEffect(() => {
    if (reduced || !cardRef.current) return
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, [reduced, index])

  /* ── Magnetic hover ──────────────────────────────────────────── */
  useEffect(() => {
    if (reduced || !cardRef.current) return
    const el   = cardRef.current
    const inner = el.querySelector('.portal-inner')

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10
      gsap.to(inner, { x, y, duration: 0.35, ease: 'power2.out' })
    }
    const onLeave = () => gsap.to(inner, { x: 0, y: 0, duration: 0.5, ease: 'expo.out' })

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [reduced])

  return (
    <Link
      to={href}
      ref={cardRef}
      aria-label={`Go to ${label} domain`}
      className="group relative block overflow-hidden rounded border border-border bg-surface/60 backdrop-blur-sm
                 transition-all duration-300 hover:border-[var(--accent)] hover:bg-surface/90
                 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
      style={{ '--accent': color, opacity: reduced ? 1 : 0 }}
    >
      {/* Gradient glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}22 0%, transparent 70%)` }}
        aria-hidden="true"
      />

      <div className="portal-inner relative z-10 p-5 flex flex-col gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded flex items-center justify-center border border-[var(--accent)]/30
                     group-hover:border-[var(--accent)]/70 transition-colors duration-300"
          style={{ color }}
          aria-hidden="true"
        >
          {icon}
        </div>

        {/* Label */}
        <h3
          className="font-display font-semibold text-base text-text group-hover:text-[var(--accent)] transition-colors duration-200"
        >
          {label}
        </h3>

        {/* Description */}
        <p className="font-body text-xs text-muted leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Arrow */}
        <span
          className="mt-1 font-mono text-2xs uppercase tracking-widest text-[var(--accent)]/60
                     group-hover:text-[var(--accent)] transition-colors duration-200 flex items-center gap-1"
          aria-hidden="true"
        >
          Enter
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

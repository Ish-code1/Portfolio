import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * HackathonRow — single animated hackathon entry.
 * Props: placement, name, scope, team, index
 */
export default function HackathonRow({ placement, name, scope, team, index = 0 }) {
  const rowRef  = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !rowRef.current) return
    gsap.fromTo(
      rowRef.current,
      { opacity: 0, x: -32 },
      {
        opacity: 1, x: 0,
        duration: 0.55,
        delay: index * 0.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: rowRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, [reduced, index])

  // Colour based on placement rank
  const color = index === 0
    ? '#00e5ff'
    : index === 3
      ? '#f59e0b'
      : '#a855f7'

  return (
    <li
      ref={rowRef}
      className="group flex items-center gap-4 py-4 border-b border-border last:border-0 transition-colors duration-200 hover:bg-surface/40 rounded px-2 -mx-2"
      style={{ opacity: reduced ? 1 : 0 }}
    >
      {/* Placement badge */}
      <div
        className="flex-shrink-0 w-28 font-display font-bold text-sm leading-tight"
        style={{ color }}
        aria-label={`Placement: ${placement}`}
      >
        {placement}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <span className="font-body text-text font-medium truncate block">{name}</span>
        {(scope || team) && (
          <span className="font-mono text-2xs text-muted mt-0.5 block">
            {[scope, team].filter(Boolean).join(' · ')}
          </span>
        )}
      </div>

      {/* Arrow */}
      <div
        className="flex-shrink-0 text-muted/30 group-hover:text-[var(--color)] transition-colors duration-200"
        style={{ '--color': color }}
        aria-hidden="true"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </li>
  )
}

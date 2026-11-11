import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * ProjectFilterBar — domain-tag filter pill strip for /projects.
 * Props:
 *   tags      — string[] of all unique tags
 *   active    — currently selected tag (or 'All')
 *   onChange  — (tag: string) => void
 *   colors    — { [tag]: hex } lookup
 */
export default function ProjectFilterBar({ tags, active, onChange, colors = {} }) {
  const ref     = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !ref.current) return
    gsap.fromTo(
      [...ref.current.children],
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'expo.out', delay: 0.1 }
    )
  }, [reduced])

  const all = ['All', ...tags]

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Filter projects by domain"
      className="flex flex-wrap gap-2"
    >
      {all.map(tag => {
        const isActive = tag === active
        const color    = colors[tag] ?? '#e2e8f0'
        return (
          <button
            key={tag}
            onClick={() => onChange(tag)}
            aria-pressed={isActive}
            className="chip transition-all duration-200 focus-visible:outline-2"
            style={
              isActive
                ? {
                    borderColor: color,
                    color,
                    background: `${color}18`,
                    boxShadow: `0 0 10px -2px ${color}55`,
                  }
                : {
                    borderColor: 'rgba(255,255,255,0.12)',
                    color: '#94a3b8',
                  }
            }
          >
            {isActive && (
              <span
                className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ background: color }}
                aria-hidden="true"
              />
            )}
            {tag}
          </button>
        )
      })}
    </div>
  )
}

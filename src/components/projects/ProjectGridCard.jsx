import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * ProjectGridCard — card in the filterable project grid.
 * Props:
 *   project  — project object from PROJECTS
 *   index    — stagger order
 *   onOpen   — () => void  (opens detail panel)
 *   isActive — bool (this card is currently open)
 */
export default function ProjectGridCard({ project, index = 0, onOpen, isActive }) {
  const cardRef = useRef(null)
  const reduced = useReducedMotion()

  /* Scroll-triggered reveal */
  useEffect(() => {
    if (reduced || !cardRef.current) return
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 36, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.55,
        delay: (index % 4) * 0.08,
        ease: 'expo.out',
      }
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, project.id])

  /* 3-D tilt on hover */
  useEffect(() => {
    if (reduced || !cardRef.current) return
    const el = cardRef.current
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const rx   = ((e.clientY - rect.top)  / rect.height - 0.5) * -10
      const ry   = ((e.clientX - rect.left) / rect.width  - 0.5) *  10
      gsap.to(el, { rotateX: rx, rotateY: ry, duration: 0.3, ease: 'power2.out', transformPerspective: 900 })
    }
    const onLeave = () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'expo.out' })
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [reduced])

  const { title, subtitle, tags, accent, event } = project
  const color = accent

  return (
    <article
      id={project.id}
      ref={cardRef}
      className={`group relative flex flex-col overflow-hidden rounded border bg-surface/70 backdrop-blur-sm
                  transition-all duration-300 cursor-pointer
                  hover:border-[var(--accent)] hover:shadow-[0_0_28px_-6px_var(--accent)]
                  ${isActive ? 'border-[var(--accent)] shadow-[0_0_28px_-6px_var(--accent)]' : 'border-border'}`}
      style={{ '--accent': color, opacity: reduced ? 1 : 0, transformStyle: 'preserve-3d' }}
      onClick={onOpen}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onOpen()}
      tabIndex={0}
      role="button"
      aria-pressed={isActive}
      aria-label={`${title} — view project details`}
    >
      {/* Top colour bar */}
      <div
        className="h-px w-full flex-shrink-0"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        aria-hidden="true"
      />

      {/* Hover radial glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% -10%, ${color}18 0%, transparent 65%)` }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-3 p-5 flex-1">
        {/* Event badge */}
        {event && (
          <span
            className="inline-block font-mono text-2xs uppercase tracking-widest px-2 py-0.5 rounded-full border w-fit"
            style={{ color, borderColor: `${color}44` }}
          >
            {event}
          </span>
        )}

        <h3 className="font-display font-bold text-xl text-text group-hover:text-[var(--accent)] transition-colors duration-200 leading-snug">
          {title}
        </h3>
        <p className="text-muted text-sm leading-relaxed line-clamp-2">{subtitle}</p>

        {/* Domain tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {tags.map(t => (
            <span key={t} className="chip border-border text-muted text-2xs">{t}</span>
          ))}
        </div>
      </div>

      {/* Footer cue */}
      <div
        className="relative z-10 flex items-center justify-end gap-1 border-t border-border px-5 py-2.5"
        aria-hidden="true"
      >
        <span className="font-mono text-2xs text-[var(--accent)]/60 group-hover:text-[var(--accent)] transition-colors duration-200">
          {isActive ? 'Close ↑' : 'Details ↓'}
        </span>
      </div>
    </article>
  )
}

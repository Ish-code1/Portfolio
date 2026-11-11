import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * ProjectDetailModal — animated slide-down panel showing full project detail.
 * Renders inline below the grid row that contains the selected card.
 *
 * Props:
 *   project  — project object from PROJECTS (or null = closed)
 *   onClose  — () => void
 */
export default function ProjectDetailModal({ project, onClose }) {
  const panelRef   = useRef(null)
  const closeRef   = useRef(null)
  const prevFocus  = useRef(null)
  const reduced    = useReducedMotion()

  /* Animate in */
  useEffect(() => {
    if (!panelRef.current || !project) return
    if (reduced) return
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: -20, scaleY: 0.92 },
      { opacity: 1, y: 0, scaleY: 1, duration: 0.45, ease: 'expo.out', transformOrigin: 'top center' }
    )
  }, [project, reduced])

  /* Focus management: store prev focus, move to close btn, return on close */
  useEffect(() => {
    if (project) {
      prevFocus.current = document.activeElement
      requestAnimationFrame(() => { closeRef.current?.focus() })
    } else {
      prevFocus.current?.focus()
    }
  }, [project])

  /* Close on Escape */
  useEffect(() => {
    if (!project) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [project, onClose])

  if (!project) return null

  const { title, subtitle, description, stack, role, metrics, links, accent, event, tags } = project
  const color = accent

  return (
    <div
      ref={panelRef}
      className="col-span-full rounded border border-[var(--accent)] bg-surface/90 backdrop-blur-sm overflow-hidden"
      style={{ '--accent': color, opacity: reduced ? 1 : 0, transformOrigin: 'top center' }}
      role="region"
      aria-label={`${title} project details`}
    >
      {/* Top accent bar */}
      <div
        className="h-0.5 w-full"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}40, transparent)` }}
        aria-hidden="true"
      />

      <div className="p-6 md:p-8">

        {/* Header row */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-text">{title}</h2>
              {event && (
                <span
                  className="font-mono text-2xs uppercase tracking-widest px-2 py-0.5 rounded-full border"
                  style={{ color, borderColor: `${color}44` }}
                >
                  {event}
                </span>
              )}
            </div>
            <p className="font-body text-muted text-sm">{subtitle}</p>
            {/* Domain tags */}
            <div className="flex flex-wrap gap-1.5">
              {tags.map(t => (
                <span key={t} className="chip border-border text-muted text-2xs">{t}</span>
              ))}
            </div>
          </div>

          {/* Close button */}
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close project details"
            className="flex-shrink-0 h-8 w-8 rounded border border-border text-muted hover:border-[var(--accent)]
                       hover:text-[var(--accent)] transition-all duration-200 flex items-center justify-center font-mono text-sm"
          >
            ✕
          </button>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left col — problem + approach (description) + role */}
          <div className="md:col-span-2 flex flex-col gap-6">

            {/* Problem / What it does */}
            <div className="flex flex-col gap-2">
              <p className="section-label" style={{ color }}>Problem & Approach</p>
              <p className="font-body text-sm text-muted leading-relaxed">{description}</p>
            </div>

            {/* My Role */}
            <div className="flex flex-col gap-2">
              <p className="section-label" style={{ color }}>My Role</p>
              <p className="font-body text-sm text-text leading-relaxed">{role}</p>
            </div>

            {/* Stack */}
            <div className="flex flex-col gap-2">
              <p className="section-label" style={{ color }}>Stack</p>
              <div className="flex flex-wrap gap-2">
                {stack.map(s => (
                  <span
                    key={s}
                    className="font-mono text-xs px-2.5 py-1 rounded border border-border text-muted
                               hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right col — metrics + links */}
          <div className="flex flex-col gap-6 justify-between">

            {/* Results / Metrics */}
            {metrics.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="section-label" style={{ color }}>Results</p>
                <div className="flex flex-wrap gap-6">
                  {metrics.map(m => (
                    <div key={m.label} className="flex flex-col gap-0.5">
                      <span
                        className="font-display font-bold text-3xl"
                        style={{ color }}
                      >
                        {m.value}
                      </span>
                      <span className="font-mono text-2xs text-muted">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-col gap-3">
              <p className="section-label" style={{ color }}>Links</p>
              <div className="flex flex-col gap-2">
                {links.github && (
                  <a
                    href={links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${title} GitHub repository`}
                    className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-[var(--accent)] transition-colors duration-200 group/link"
                  >
                    <span className="h-px w-4 bg-current transition-all duration-200 group-hover/link:w-6" aria-hidden="true" />
                    GitHub ↗
                  </a>
                )}
                {links.demo && (
                  <a
                    href={links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${title} live demo`}
                    className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-[var(--accent)] transition-colors duration-200 group/link"
                  >
                    <span className="h-px w-4 bg-current transition-all duration-200 group-hover/link:w-6" aria-hidden="true" />
                    Demo ↗
                  </a>
                )}
                {links.linkedin && (
                  <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${title} LinkedIn post`}
                    className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-[var(--accent)] transition-colors duration-200 group/link"
                  >
                    <span className="h-px w-4 bg-current transition-all duration-200 group-hover/link:w-6" aria-hidden="true" />
                    LinkedIn ↗
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom fade */}
      <div
        className="h-px w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }}
        aria-hidden="true"
      />
    </div>
  )
}

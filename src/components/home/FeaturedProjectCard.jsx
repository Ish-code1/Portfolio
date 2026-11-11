import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * FeaturedProjectCard — card for the featured-projects strip on Home.
 * Props: project (object from PROJECTS), index (stagger)
 */
export default function FeaturedProjectCard({ project, index = 0 }) {
  const cardRef = useRef(null)
  const reduced = useReducedMotion()

  /* ── Scroll reveal ───────────────────────────────────────────── */
  useEffect(() => {
    if (reduced || !cardRef.current) return
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.65,
        delay: index * 0.12,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, [reduced, index])

  /* ── 3-D card hover tilt ─────────────────────────────────────── */
  useEffect(() => {
    if (reduced || !cardRef.current) return
    const el = cardRef.current

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const rx   = ((e.clientY - rect.top)  / rect.height - 0.5) * -12
      const ry   = ((e.clientX - rect.left) / rect.width  - 0.5) *  12
      gsap.to(el, { rotateX: rx, rotateY: ry, duration: 0.35, ease: 'power2.out', transformPerspective: 900 })
    }
    const onLeave = () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'expo.out' })

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [reduced])

  const { title, subtitle, tags, accent, links, description, event } = project

  return (
    <article
      ref={cardRef}
      className="group relative flex flex-col overflow-hidden rounded border border-border bg-surface/70 backdrop-blur-sm
                 transition-all duration-300 hover:border-[var(--accent)] hover:shadow-[0_0_32px_-8px_var(--accent)]"
      style={{ '--accent': accent, opacity: reduced ? 1 : 0, transformStyle: 'preserve-3d' }}
    >
      {/* Top colour bar */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} aria-hidden="true" />

      {/* Gradient glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% -20%, ${accent}18 0%, transparent 65%)` }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-3 p-5 flex-1">
        {/* Event badge */}
        {event && (
          <span className="inline-block font-mono text-2xs uppercase tracking-widest px-2 py-0.5 rounded-full border w-fit"
            style={{ color: accent, borderColor: `${accent}44` }}>
            {event}
          </span>
        )}

        <h3 className="font-display font-bold text-xl text-text group-hover:text-[var(--accent)] transition-colors duration-200">
          {title}
        </h3>
        <p className="text-muted text-sm leading-relaxed line-clamp-3">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {tags.map(t => (
            <span
              key={t}
              className="chip border-border text-muted text-2xs"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Links footer */}
      <div className="relative z-10 flex items-center gap-3 border-t border-border px-5 py-3">
        {links.github && (
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${title} GitHub repository`}
            className="font-mono text-2xs text-muted hover:text-[var(--accent)] transition-colors duration-200"
          >
            GitHub ↗
          </a>
        )}
        {links.demo && (
          <a
            href={links.demo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${title} demo`}
            className="font-mono text-2xs text-muted hover:text-[var(--accent)] transition-colors duration-200"
          >
            Demo ↗
          </a>
        )}
        <Link
          to={`/projects#${project.id}`}
          aria-label={`See ${title} project details`}
          className="ml-auto font-mono text-2xs text-[var(--accent)]/60 hover:text-[var(--accent)] transition-colors duration-200"
        >
          Details →
        </Link>
      </div>
    </article>
  )
}

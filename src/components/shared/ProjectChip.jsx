import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * ProjectChip — clickable chip linking to /projects with the project
 * pre-selected. Used on all domain pages.
 * Props: project (object from PROJECTS), color (domain accent hex)
 */
export default function ProjectChip({ project, color }) {
  const ref     = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !ref.current) return
    gsap.fromTo(
      ref.current,
      { opacity: 0, x: -12 },
      {
        opacity: 1, x: 0,
        duration: 0.4,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, [reduced])

  return (
    <Link
      ref={ref}
      to={`/projects#${project.id}`}
      aria-label={`View ${project.title} project details`}
      className="chip group border-[var(--color)]/30 text-[var(--color)]/70
                 hover:border-[var(--color)] hover:text-[var(--color)] hover:bg-[var(--color)]/8
                 transition-all duration-200 gap-1.5"
      style={{ '--color': color, opacity: reduced ? 1 : 0 }}
    >
      <span
        className="h-1 w-1 rounded-full flex-shrink-0 group-hover:shadow-[0_0_4px_1px_var(--color)]"
        style={{ background: color }}
        aria-hidden="true"
      />
      {project.title}
      <span aria-hidden="true" className="opacity-50 group-hover:opacity-100 transition-opacity">↗</span>
    </Link>
  )
}

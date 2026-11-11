import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * SkillCard — single skill item with scroll-triggered reveal and hover glow.
 * Props: skill (string), color (hex), index (stagger order)
 */
export default function SkillCard({ skill, color, index = 0 }) {
  const ref     = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !ref.current) return
    gsap.fromTo(
      ref.current,
      { opacity: 0, scale: 0.88, y: 20 },
      {
        opacity: 1, scale: 1, y: 0,
        duration: 0.5,
        delay: (index % 3) * 0.08,          // stagger within each row
        ease: 'back.out(1.6)',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, [reduced, index])

  return (
    <div
      ref={ref}
      className="group relative flex items-center gap-3 rounded border border-border bg-surface/60 px-4 py-3
                 hover:border-[var(--color)] hover:bg-surface/90 transition-all duration-250 cursor-default"
      style={{ '--color': color, opacity: reduced ? 1 : 0 }}
    >
      {/* Dot */}
      <span
        className="flex-shrink-0 h-1.5 w-1.5 rounded-full transition-shadow duration-250 group-hover:shadow-[0_0_6px_2px_var(--color)]"
        style={{ background: color }}
        aria-hidden="true"
      />
      <span className="font-mono text-xs text-muted group-hover:text-text transition-colors duration-200">
        {skill}
      </span>
    </div>
  )
}

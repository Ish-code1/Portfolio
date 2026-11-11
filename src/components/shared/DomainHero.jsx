import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import LazyLoader from '../LazyLoader'

/**
 * DomainHero — reusable hero section for all domain pages.
 * Props:
 *   label     — short section label above heading
 *   heading   — main h1
 *   tagline   — subtitle
 *   color     — domain accent hex
 *   scene     — lazy React component (3D scene), or null
 *   sceneH    — height class for scene container (default 'h-72 md:h-96')
 */
export default function DomainHero({
  label,
  heading,
  tagline,
  color,
  Scene,
  sceneH = 'h-72 md:h-96',
}) {
  const textRef  = useRef(null)
  const reduced  = useReducedMotion()

  useEffect(() => {
    if (reduced || !textRef.current) return
    gsap.fromTo(
      textRef.current.children,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0,
        duration: 0.65,
        stagger: 0.1,
        delay: 0.05,
        ease: 'expo.out',
      }
    )
  }, [reduced])

  return (
    <section
      aria-label={`${heading} hero`}
      className="relative overflow-hidden pt-nav"
      style={{ '--accent': color }}
    >
      {/* 3-D scene */}
      {Scene && (
        <div className={`relative ${sceneH} w-full`} aria-hidden="true">
          <LazyLoader>
            <Scene />
          </LazyLoader>
          {/* Bottom fade */}
          <div
            className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #080b12, transparent)' }}
          />
        </div>
      )}

      {/* Text overlay / below scene */}
      <div className="container-grid py-16 relative z-10">
        <div
          ref={textRef}
          className="max-w-2xl flex flex-col gap-4"
        >
          {/* Label */}
          <p
            className="section-label"
            style={{ color, opacity: reduced ? 1 : 0 }}
          >
            {label}
          </p>

          {/* Heading */}
          <h1
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-text leading-tight"
            style={{ opacity: reduced ? 1 : 0 }}
          >
            {heading}
          </h1>

          {/* Accent bar */}
          <div
            className="h-px w-24 rounded-full"
            style={{ background: `linear-gradient(90deg, ${color}, transparent)`, opacity: reduced ? 1 : 0 }}
            aria-hidden="true"
          />

          {/* Tagline */}
          <p
            className="font-body text-muted text-base sm:text-lg leading-relaxed"
            style={{ opacity: reduced ? 1 : 0 }}
          >
            {tagline}
          </p>
        </div>
      </div>
    </section>
  )
}

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { IDENTITY } from '../../content'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * PhotoFrame — displays photo.jpeg with:
 *  • 3-D tilt on cursor move (desktop)
 *  • Duotone CSS overlay shifting to full-colour on hover
 *  • Glitch clip-path flicker on hover (reduced-motion safe)
 *  • Particle halo (pure CSS animated dots)
 *  • Masked reveal on mount (GSAP clip-path wipe)
 */
export default function PhotoFrame() {
  const wrapRef  = useRef(null)
  const imgRef   = useRef(null)
  const reduced  = useReducedMotion()

  /* ── Mounted reveal ──────────────────────────────────────────── */
  useEffect(() => {
    if (reduced || !wrapRef.current) return
    gsap.fromTo(
      wrapRef.current,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.out', delay: 0.3 }
    )
  }, [reduced])

  /* ── 3-D tilt on mouse move ──────────────────────────────────── */
  useEffect(() => {
    if (reduced || !wrapRef.current) return
    const el = wrapRef.current

    const onMove = (e) => {
      const rect  = el.getBoundingClientRect()
      const cx    = rect.left + rect.width  / 2
      const cy    = rect.top  + rect.height / 2
      const rx    = ((e.clientY - cy) / rect.height) * -14
      const ry    = ((e.clientX - cx) / rect.width)  *  14
      gsap.to(el, { rotateX: rx, rotateY: ry, duration: 0.4, ease: 'power2.out', transformPerspective: 800 })
    }

    const onLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'expo.out' })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [reduced])

  /* ── Glitch hover ────────────────────────────────────────────── */
  useEffect(() => {
    if (reduced || !imgRef.current) return
    const img = imgRef.current
    let tl

    const onEnter = () => {
      tl = gsap.timeline({ repeat: 2 })
        .to(img, { skewX: 2,  x:  3, duration: 0.06, ease: 'none' })
        .to(img, { skewX: -2, x: -3, duration: 0.06, ease: 'none' })
        .to(img, { skewX: 0,  x:  0, duration: 0.08, ease: 'none' })
    }
    const onLeave = () => { tl?.kill(); gsap.set(img, { skewX: 0, x: 0 }) }

    img.addEventListener('mouseenter', onEnter)
    img.addEventListener('mouseleave', onLeave)
    return () => {
      img.removeEventListener('mouseenter', onEnter)
      img.removeEventListener('mouseleave', onLeave)
    }
  }, [reduced])

  return (
    <div className="relative flex items-center justify-center select-none" aria-label={`Photo of ${IDENTITY.fullName}`}>

      {/* Particle halo — 8 orbiting dots */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <span
            key={i}
            className="particle-dot"
            style={{
              '--angle': `${i * 45}deg`,
              '--delay': `${-(i * 0.75)}s`,
              '--r': '148px',
            }}
          />
        ))}
      </div>

      {/* Corner bracket decorations */}
      <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
        <span className="corner top-0 left-0 border-t-2 border-l-2" />
        <span className="corner top-0 right-0 border-t-2 border-r-2" />
        <span className="corner bottom-0 left-0 border-b-2 border-l-2" />
        <span className="corner bottom-0 right-0 border-b-2 border-r-2" />
      </div>

      {/* Photo */}
      <div
        ref={wrapRef}
        className="relative z-20 w-56 h-64 sm:w-64 sm:h-72 md:w-72 md:h-80 overflow-hidden rounded-sm"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {/* Duotone overlay — fades out on hover */}
        <div
          className="photo-duotone absolute inset-0 z-10 mix-blend-color pointer-events-none rounded-sm transition-opacity duration-500"
          aria-hidden="true"
        />

        <img
          ref={imgRef}
          src={IDENTITY.photo}
          alt={`Photo of ${IDENTITY.fullName}`}
          className="w-full h-full object-cover object-top rounded-sm"
          draggable="false"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  )
}

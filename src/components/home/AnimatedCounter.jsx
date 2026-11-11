import { useRef, useEffect, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * AnimatedCounter — counts up to `target` when scrolled into view.
 * Props: target (number), suffix, prefix, duration (seconds)
 */
export default function AnimatedCounter({ target, suffix = '', prefix = '', duration = 1.6 }) {
  const ref     = useRef(null)
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(reduced ? target : 0)

  useEffect(() => {
    if (reduced) { setDisplay(target); return }
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const start     = performance.now()
        const startVal  = 0
        const easeOut   = (t) => 1 - Math.pow(1 - t, 3)

        const tick = (now) => {
          const elapsed = (now - start) / (duration * 1000)
          const progress = Math.min(elapsed, 1)
          setDisplay(Math.round(startVal + (target - startVal) * easeOut(progress)))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration, reduced])

  return (
    <span ref={ref} aria-label={`${prefix}${target}${suffix}`}>
      {prefix}{display}{suffix}
    </span>
  )
}

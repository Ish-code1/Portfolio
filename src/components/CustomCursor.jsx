import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * CustomCursor — renders a dot + ring cursor.
 * Hides on touch devices. Disables on reduced-motion (native cursor shown).
 */
export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    document.documentElement.classList.add('custom-cursor-active')

    const dot  = dotRef.current
    const ring = ringRef.current
    let ringX = 0, ringY = 0
    let mouseX = 0, mouseY = 0
    let raf

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform  = `translate(${mouseX}px, ${mouseY}px)`
    }

    const lerp = (a, b, t) => a + (b - a) * t
    const tick = () => {
      ringX = lerp(ringX, mouseX, 0.12)
      ringY = lerp(ringY, mouseY, 0.12)
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`
      raf = requestAnimationFrame(tick)
    }
    tick()
    window.addEventListener('pointermove', onMove)

    // Expand ring on hoverable elements dynamically
    const onOver = (e) => {
      if (e.target && e.target.closest('a, button, [role="button"], [data-magnetic]')) {
        ring.classList.add('scale-[2.5]', 'opacity-50')
      } else {
        ring.classList.remove('scale-[2.5]', 'opacity-50')
      }
    }
    window.addEventListener('mouseover', onOver)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [reduced])

  if (reduced) return null

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100002] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aiml will-change-transform"
      />
      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100001] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-aiml/60 transition-transform duration-200 will-change-transform"
      />
    </>
  )
}

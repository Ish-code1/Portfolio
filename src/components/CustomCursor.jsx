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

    // Don't activate on primary touch / mobile devices without fine pointer
    const isTouchOnly = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isTouchOnly) return

    document.documentElement.classList.add('custom-cursor-active')

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let ringX = 0, ringY = 0
    let mouseX = 0, mouseY = 0
    let hasMoved = false
    let raf

    // Initially hide until first pointer move so it never sits stuck at (0, 0)
    dot.style.opacity = '0'
    ring.style.opacity = '0'

    const onMove = (e) => {
      // Ignore touch taps
      if (e.pointerType === 'touch') return

      mouseX = e.clientX
      mouseY = e.clientY

      if (!hasMoved) {
        hasMoved = true
        ringX = mouseX
        ringY = mouseY
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }

      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`
    }

    const onLeave = () => {
      if (dot && ring) {
        dot.style.opacity = '0'
        ring.style.opacity = '0'
      }
      hasMoved = false
    }

    const lerp = (a, b, t) => a + (b - a) * t
    const tick = () => {
      if (hasMoved) {
        ringX = lerp(ringX, mouseX, 0.14)
        ringY = lerp(ringY, mouseY, 0.14)
        ring.style.transform = `translate(${ringX}px, ${ringY}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    tick()

    window.addEventListener('pointermove', onMove)
    document.addEventListener('mouseleave', onLeave)

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
      document.removeEventListener('mouseleave', onLeave)
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
        className="custom-cursor-element pointer-events-none fixed left-0 top-0 z-[100002] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aiml will-change-transform opacity-0 transition-opacity duration-150"
      />
      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="custom-cursor-element pointer-events-none fixed left-0 top-0 z-[100001] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-aiml/60 transition-[transform,opacity] duration-150 will-change-transform opacity-0"
      />
    </>
  )
}

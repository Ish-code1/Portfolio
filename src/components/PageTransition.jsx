import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * PageTransition — wraps each page with a GSAP fade-slide in/out.
 * On reduced-motion it simply renders children immediately.
 */
export default function PageTransition({ children }) {
  const ref      = useRef(null)
  const location = useLocation()
  const reduced  = useReducedMotion()

  useEffect(() => {
    if (reduced || !ref.current) return

    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'expo.out', clearProps: 'all' }
      )
    }, el)

    return () => ctx.revert()
  }, [location.pathname, reduced])

  return (
    <div ref={ref} className="will-change-[opacity,transform]">
      {children}
    </div>
  )
}

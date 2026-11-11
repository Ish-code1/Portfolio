import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * SplitText — GSAP character/word stagger reveal.
 * Props:
 *   text      — string to display
 *   tag       — element tag (default 'span')
 *   className — applied to wrapper
 *   delay     — GSAP delay
 *   stagger   — per-char stagger (default 0.03)
 *   mode      — 'chars' | 'words' (default 'chars')
 */
export default function SplitText({
  text,
  tag: Tag = 'span',
  className = '',
  delay = 0,
  stagger = 0.028,
  mode = 'chars',
}) {
  const ref     = useRef(null)
  const reduced = useReducedMotion()

  const units = mode === 'words' ? text.split(' ') : text.split('')

  useEffect(() => {
    if (reduced || !ref.current) return
    const spans = ref.current.querySelectorAll('.split-unit')
    gsap.fromTo(
      spans,
      { opacity: 0, y: 24, skewY: 4 },
      {
        opacity: 1, y: 0, skewY: 0,
        duration: 0.55,
        stagger,
        delay,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, [reduced, delay, stagger])

  return (
    <Tag
      ref={ref}
      className={`inline ${className}`}
      aria-label={text}
    >
      {units.map((unit, i) => (
        <span
          key={i}
          className="split-unit inline-block overflow-hidden"
          style={{ opacity: reduced ? 1 : 0 }}
          aria-hidden="true"
        >
          {unit === ' ' ? '\u00A0' : unit}
          {mode === 'words' && i < units.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  )
}

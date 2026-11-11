import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * SoundwaveBar — CSS animated vertical bar for the decorative soundwave strip.
 * Props: index (number), color (hex)
 */
function SoundwaveBar({ index, color }) {
  const reduced = useReducedMotion()
  const delay   = `${(index * 0.07).toFixed(2)}s`
  const minH    = 6 + (index % 3) * 4   // px
  const maxH    = 20 + (index % 5) * 12  // px

  return (
    <span
      className="inline-block rounded-full"
      style={{
        width: 3,
        minHeight: minH,
        height: maxH,
        background: color,
        opacity: 0.7,
        animationName: reduced ? 'none' : 'soundpulse',
        animationDuration: `${0.6 + (index % 4) * 0.18}s`,
        animationDelay: delay,
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
      }}
      aria-hidden="true"
    />
  )
}

/**
 * SoundwaveStrip — decorative horizontal soundwave bar strip.
 * Props: color (hex), barCount (number)
 */
export function SoundwaveStrip({ color, barCount = 28 }) {
  return (
    <div
      className="flex items-end gap-[3px]"
      aria-hidden="true"
      role="presentation"
    >
      {Array.from({ length: barCount }, (_, i) => (
        <SoundwaveBar key={i} index={i} color={color} />
      ))}
    </div>
  )
}

/**
 * RoleCard — a single leadership/comms role card with scroll-triggered reveal.
 * Props: icon (JSX), title, body, color, index
 */
export function RoleCard({ icon, title, body, color, index = 0 }) {
  const ref     = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !ref.current) return
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0,
        duration: 0.55,
        delay: (index % 3) * 0.08,
        ease: 'expo.out',
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
      className="group relative flex flex-col gap-3 rounded border border-border bg-surface/60 p-5
                 hover:border-[var(--accent)] hover:bg-surface/80 transition-all duration-300"
      style={{ opacity: reduced ? 1 : 0 }}
    >
      {/* Top glow stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-px rounded-t"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        aria-hidden="true"
      />
      {/* Icon */}
      <div
        className="w-9 h-9 rounded flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: `${color}18`, color }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="font-display font-semibold text-sm text-text leading-snug">{title}</h3>
      {body && <p className="font-mono text-xs text-muted leading-relaxed">{body}</p>}
    </div>
  )
}

/**
 * EvalBadge — AI Generalist evaluation dimension badge.
 */
export function EvalBadge({ label, color }) {
  const ref     = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !ref.current) return
    gsap.fromTo(
      ref.current,
      { opacity: 0, scale: 0.85 },
      {
        opacity: 1, scale: 1,
        duration: 0.4,
        ease: 'back.out(1.6)',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, [reduced])

  return (
    <span
      ref={ref}
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs"
      style={{
        borderColor: `${color}50`,
        color,
        background: `${color}10`,
        opacity: reduced ? 1 : 0,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: color }} aria-hidden="true" />
      {label}
    </span>
  )
}

/**
 * HackathonCard — single hackathon result for the warm-palette section.
 */
export function CommHackathonCard({ placement, name, scope, team, index = 0, color }) {
  const ref     = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !ref.current) return
    gsap.fromTo(
      ref.current,
      { opacity: 0, x: -24 },
      {
        opacity: 1, x: 0,
        duration: 0.5,
        delay: index * 0.09,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, [reduced, index])

  return (
    <li
      ref={ref}
      className="group flex items-center gap-4 py-4 border-b border-border last:border-0
                 hover:bg-surface/40 transition-colors duration-200 rounded px-2 -mx-2"
      style={{ opacity: reduced ? 1 : 0 }}
    >
      {/* Placement */}
      <div
        className="flex-shrink-0 w-32 font-display font-bold text-sm leading-tight"
        style={{ color }}
      >
        {placement}
      </div>
      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <span className="font-body text-text font-medium block truncate">{name}</span>
        {(scope || team) && (
          <span className="font-mono text-2xs text-muted mt-0.5 block">
            {[scope, team].filter(Boolean).join(' · ')}
          </span>
        )}
      </div>
      {/* Arrow */}
      <div
        className="flex-shrink-0 text-muted/30 group-hover:text-[var(--c)] transition-colors duration-200"
        style={{ '--c': color }}
        aria-hidden="true"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </li>
  )
}

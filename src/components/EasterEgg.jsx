import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * EasterEgg — gesture / hand-landmark themed overlay.
 *
 * Trigger: type the sequence  g → e → s → t → u → r → e  anywhere on the page
 *          (case-insensitive) while NOT focused in an input / textarea.
 *
 * Shows an SVG hand with 21 animated landmark dots (matching MediaPipe's
 * hand-landmark model from the Gesture Control and LabLens projects).
 *
 * Keyboard: Escape or Enter to dismiss.
 * Reduced-motion: skip GSAP, show static overlay.
 */

/* ── 21 MediaPipe hand landmark positions (normalised 0-1) ────────
   Source: https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker
   Landmarks: WRIST(0), THUMB_CMC(1)…THUMB_TIP(4), INDEX_MCP(5)…INDEX_TIP(8),
              MIDDLE_MCP(9)…MIDDLE_TIP(12), RING_MCP(13)…RING_TIP(16),
              PINKY_MCP(17)…PINKY_TIP(20)
─────────────────────────────────────────────────────────────────── */
const LANDMARKS = [
  /* 0 wrist */       { x: 0.50, y: 0.93 },
  /* 1 thumb_cmc */   { x: 0.35, y: 0.80 },
  /* 2 thumb_mcp */   { x: 0.24, y: 0.68 },
  /* 3 thumb_ip */    { x: 0.16, y: 0.57 },
  /* 4 thumb_tip */   { x: 0.09, y: 0.47 },
  /* 5 index_mcp */   { x: 0.42, y: 0.68 },
  /* 6 index_pip */   { x: 0.39, y: 0.52 },
  /* 7 index_dip */   { x: 0.37, y: 0.40 },
  /* 8 index_tip */   { x: 0.36, y: 0.28 },
  /* 9 mid_mcp */     { x: 0.50, y: 0.66 },
  /* 10 mid_pip */    { x: 0.50, y: 0.49 },
  /* 11 mid_dip */    { x: 0.50, y: 0.37 },
  /* 12 mid_tip */    { x: 0.50, y: 0.24 },
  /* 13 ring_mcp */   { x: 0.58, y: 0.68 },
  /* 14 ring_pip */   { x: 0.60, y: 0.52 },
  /* 15 ring_dip */   { x: 0.62, y: 0.40 },
  /* 16 ring_tip */   { x: 0.63, y: 0.29 },
  /* 17 pinky_mcp */  { x: 0.67, y: 0.72 },
  /* 18 pinky_pip */  { x: 0.72, y: 0.59 },
  /* 19 pinky_dip */  { x: 0.75, y: 0.49 },
  /* 20 pinky_tip */  { x: 0.77, y: 0.39 },
]

/* Connections matching MediaPipe topology */
const CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],           // thumb
  [0,5],[5,6],[6,7],[7,8],           // index
  [0,9],[9,10],[10,11],[11,12],      // middle
  [0,13],[13,14],[14,15],[15,16],    // ring
  [0,17],[17,18],[18,19],[19,20],    // pinky
  [5,9],[9,13],[13,17],              // palm
]

const ACCENT   = '#00e5ff'
const TIP_IDS  = new Set([4, 8, 12, 16, 20])
const SECRET   = 'g'

export default function EasterEgg() {
  const [visible, setVisible] = useState(false)
  const reduced = useReducedMotion()
  const overlayRef = useRef(null)
  const dotRefs    = useRef([])
  const bufferRef  = useRef('')
  const closeRef   = useRef(null)
  const prevFocus  = useRef(null)

  /* ── Keyboard sequence listener ────────────────────────────────── */
  useEffect(() => {
    const onKey = (e) => {
      // Don't trigger inside inputs
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return

      if (e.key === 'Escape') { setVisible(false); return }

      bufferRef.current = (bufferRef.current + e.key.toLowerCase()).slice(-SECRET.length)
      if (bufferRef.current === SECRET) {
        prevFocus.current = document.activeElement
        setVisible(true)
        bufferRef.current = ''
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* ── Focus management: trap focus inside dialog ─────────────────── */
  useEffect(() => {
    if (!visible) {
      // Return focus to the element that was active before opening
      prevFocus.current?.focus()
      return
    }
    // Auto-focus the close button
    requestAnimationFrame(() => { closeRef.current?.focus() })

    // Focus trap — keep Tab / Shift+Tab inside the dialog
    const trapKey = (e) => {
      if (e.key !== 'Tab' || !overlayRef.current) return
      const focusable = [...overlayRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )]
      if (!focusable.length) return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', trapKey)
    return () => window.removeEventListener('keydown', trapKey)
  }, [visible])

  /* ── GSAP entrance / dot stagger ───────────────────────────────── */
  useEffect(() => {
    if (!visible || reduced) return

    const overlay = overlayRef.current
    if (!overlay) return

    const ctx = gsap.context(() => {
      // Fade in backdrop
      gsap.from(overlay, { opacity: 0, duration: 0.4, ease: 'power2.out' })

      // Panel slide + scale
      const panel = overlay.querySelector('[data-panel]')
      if (panel) {
        gsap.from(panel, { scale: 0.88, opacity: 0, duration: 0.55, ease: 'expo.out' })
      }

      // Landmark dots cascade
      const dots = dotRefs.current.filter(Boolean)
      if (dots.length) {
        gsap.from(dots, {
          scale: 0, opacity: 0,
          duration: 0.5, stagger: 0.025,
          ease: 'back.out(1.7)',
          transformOrigin: 'center center',
        })
        // Idle pulse on tips
        const tips = dots.filter((_, i) => TIP_IDS.has(i))
        gsap.to(tips, {
          scale: 1.4, opacity: 0.7,
          duration: 0.9, repeat: -1, yoyo: true,
          ease: 'sine.inOut', stagger: 0.12,
        })
      }
    }, overlay)

    return () => ctx.revert()
  }, [visible, reduced])

  const dismiss = useCallback(() => setVisible(false), [])

  if (!visible) return null

  /* SVG viewBox: landmarks are in 0-1 space, map to 0-200 */
  const W = 200, H = 220

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Easter egg: hand landmark visualiser"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ background: 'rgba(8,11,18,0.88)', backdropFilter: 'blur(8px)', cursor: 'auto' }}
      onClick={e => { if (e.target === e.currentTarget) dismiss() }}
    >
      <div
        data-panel=""
        className="relative w-full max-w-sm sm:max-w-md rounded-sm border border-border bg-surface/95 p-6 sm:p-8 flex flex-col items-center gap-6"
      >
        {/* Close */}
        <button
          ref={closeRef}
          onClick={dismiss}
          aria-label="Close easter egg"
          className="absolute top-4 right-4 text-muted hover:text-text transition-colors focus-visible:outline-2 focus-visible:outline-aiml rounded-sm p-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <p className="font-mono text-xs uppercase tracking-widest text-aiml">
            🖐 You found it
          </p>
          <h2 className="font-display text-xl font-bold text-text">
            21 Hand Landmarks
          </h2>
          <p className="text-muted text-xs leading-relaxed max-w-xs">
            MediaPipe's hand-landmark model — the same skeleton powering{' '}
            <strong className="text-text">LabLens</strong> and the{' '}
            <strong className="text-text">Gesture Controller</strong>.
            ~30–40&nbsp;ms end-to-end.
          </p>
        </div>

        {/* SVG hand skeleton */}
        <div
          className="relative w-full max-w-[220px] select-none"
          aria-hidden="true"
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            style={{ overflow: 'visible' }}
          >
            {/* Connections */}
            {CONNECTIONS.map(([a, b], idx) => {
              const lA = LANDMARKS[a]
              const lB = LANDMARKS[b]
              return (
                <line
                  key={idx}
                  x1={lA.x * W} y1={lA.y * H}
                  x2={lB.x * W} y2={lB.y * H}
                  stroke={ACCENT}
                  strokeWidth="1"
                  strokeOpacity="0.25"
                />
              )
            })}

            {/* Landmark dots */}
            {LANDMARKS.map((pt, i) => {
              const isTip = TIP_IDS.has(i)
              return (
                <g key={i}>
                  {isTip && (
                    <circle
                      cx={pt.x * W} cy={pt.y * H}
                      r="6"
                      fill={ACCENT}
                      fillOpacity="0.12"
                    />
                  )}
                  <circle
                    ref={el => { dotRefs.current[i] = el }}
                    cx={pt.x * W} cy={pt.y * H}
                    r={isTip ? 4 : 2.5}
                    fill={isTip ? ACCENT : '#a855f7'}
                    fillOpacity={isTip ? 0.9 : 0.75}
                  />
                  {/* Landmark index label */}
                  <text
                    x={pt.x * W + (pt.x > 0.5 ? 6 : -6)}
                    y={pt.y * H + 1}
                    textAnchor={pt.x > 0.5 ? 'start' : 'end'}
                    fontSize="5"
                    fill="#4a5568"
                    fontFamily="monospace"
                  >
                    {i}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Stat strip */}
        <div className="flex gap-6 font-mono text-xs text-center">
          <div>
            <p className="text-aiml font-bold text-base">21</p>
            <p className="text-muted uppercase tracking-widest">Landmarks</p>
          </div>
          <div>
            <p className="text-genai font-bold text-base">30–40ms</p>
            <p className="text-muted uppercase tracking-widest">Latency</p>
          </div>
          <div>
            <p className="text-mlops font-bold text-base">2</p>
            <p className="text-muted uppercase tracking-widest">Projects</p>
          </div>
        </div>

        {/* Dismiss hint */}
        <p className="font-mono text-2xs text-slate-400">
          Triggered by pressing <kbd className="border border-border rounded px-1 py-px text-slate-300">G</kbd> anywhere on the page · <kbd className="border border-border rounded px-1 py-px text-slate-300">Esc</kbd> to close
        </p>
      </div>
    </div>
  )
}

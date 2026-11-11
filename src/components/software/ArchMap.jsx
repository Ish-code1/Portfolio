import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * ArchMap — scroll-scrubbed architecture map for the /software page.
 * Shows how the layers of a project stack connect:
 * Client → REST API → Service Layer → DB / Cloud
 * Motion language: staggered fade-in per layer with a vertical
 * connector beam growing downward — mirroring the 3-D scene's tiers.
 * Accent: #f97316 (orange)
 */

const COLOR = '#f97316'

const LAYERS = [
  {
    id:    'client',
    label: 'Client / Interface',
    nodes: ['Telegram Bot API', 'REST Client', 'Web UI'],
    desc:  'Entry points that consume the backend — bots, frontends, CLI tools.',
    icon:  '◎',
  },
  {
    id:    'api',
    label: 'API Layer',
    nodes: ['FastAPI', 'Pydantic Validation', 'REST Endpoints', 'Versioned Routes'],
    desc:  'High-performance async API gateway. Type-safe requests and responses, health checks.',
    icon:  '▲',
  },
  {
    id:    'services',
    label: 'Service / Logic Layer',
    nodes: ['Python', 'C++', 'Business Logic', 'ML Inference', 'Tool Orchestration'],
    desc:  'Core computation — model calls, deterministic engines, data transformations.',
    icon:  '◈',
  },
  {
    id:    'db',
    label: 'Data & Storage',
    nodes: ['MySQL', 'Neo4j', 'Firestore', 'SQL', 'Graph DB'],
    desc:  'Relational, graph-native and document stores — right model for each data shape.',
    icon:  '⬡',
  },
]

export default function ArchMap({ color = COLOR }) {
  const sectionRef = useRef(null)
  const beamRef    = useRef(null)
  const layerRefs  = useRef([])
  const reduced    = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return

    /* Vertical beam grows downward on scroll */
    gsap.fromTo(
      beamRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 55%',
          end:   'bottom 65%',
          scrub: 1.5,
        },
      }
    )

    /* Each layer slides in from the right */
    layerRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.fromTo(
        el,
        { opacity: 0, x: 36 },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start:   'top 86%',
            toggleActions: 'play none none none',
          },
        }
      )
    })

    return () => ScrollTrigger.getAll().forEach(st => st.kill())
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      aria-label="Software architecture map"
      className="py-24 overflow-hidden"
    >
      <div className="container-grid">
        <div className="mb-12 flex flex-col gap-2">
          <p className="section-label">How I architect</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text">
            The backend stack
          </h2>
        </div>

        <div className="relative flex flex-col gap-0 max-w-3xl">
          {/* Vertical beam on the left */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block"
            aria-hidden="true"
          />
          <div
            ref={beamRef}
            className="absolute left-6 top-0 bottom-0 w-px hidden sm:block origin-top"
            style={{
              background: `linear-gradient(180deg, ${color}, ${color}22)`,
              scaleY: reduced ? 1 : 0,
            }}
            aria-hidden="true"
          />

          <ol className="relative flex flex-col gap-0">
            {LAYERS.map((layer, i) => (
              <li
                key={layer.id}
                ref={el => (layerRefs.current[i] = el)}
                className="relative flex items-start gap-6 py-7"
                style={{ opacity: reduced ? 1 : 0 }}
              >
                {/* Node */}
                <div
                  className="relative z-10 flex-shrink-0 flex h-12 w-12 items-center justify-center
                             rounded-full border-2 bg-base text-lg transition-all duration-300"
                  style={{
                    borderColor: color,
                    color,
                    boxShadow: `0 0 20px -6px ${color}80`,
                  }}
                  aria-hidden="true"
                >
                  {layer.icon}
                  <span
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center
                               rounded-full text-[9px] font-mono font-bold"
                    style={{ background: color, color: '#080b12' }}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2.5 pb-2 flex-1">
                  <span className="font-display font-semibold text-sm" style={{ color }}>
                    {layer.label}
                  </span>
                  <p className="font-body text-sm text-muted leading-relaxed">
                    {layer.desc}
                  </p>
                  {/* Technology node chips */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {layer.nodes.map(n => (
                      <span
                        key={n}
                        className="font-mono text-2xs px-2 py-0.5 rounded border text-muted"
                        style={{ borderColor: `${color}40` }}
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

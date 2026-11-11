import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * LlmTimeline — scroll-scrubbed RAG / LLM pipeline for the GenAI page.
 * Shows: Query → Retrieve → Augment → Generate → Ground → Respond
 * Motion language: vertical flow (top→bottom) with glow pulses.
 * Accent: #a855f7 (violet)
 */

const COLOR = '#a855f7'

const STEPS = [
  {
    id:    'query',
    label: 'Query Understanding',
    desc:  'Parse user intent, detect language (English / Hindi / Malayalam), route to the right pipeline.',
    icon:  '◎',
    tech:  ['LLM API', 'Multilingual AI'],
  },
  {
    id:    'retrieve',
    label: 'Knowledge Retrieval',
    desc:  'Semantic search over vector stores + graph traversal in Neo4j to surface relevant context.',
    icon:  '⬡',
    tech:  ['RAG', 'Neo4j', 'LangChain'],
  },
  {
    id:    'augment',
    label: 'Context Augmentation',
    desc:  'Merge retrieved documents, graph triples and conversation memory into a structured prompt.',
    icon:  '◈',
    tech:  ['Knowledge-Graph Retrieval', 'Meko MCP'],
  },
  {
    id:    'generate',
    label: 'LLM Generation',
    desc:  'Tool-calling Gemini agent invokes deterministic engines — the model never invents a number.',
    icon:  '▲',
    tech:  ['Gemini API', 'Tool Calling', 'LangChain'],
  },
  {
    id:    'ground',
    label: 'Grounding & Verification',
    desc:  'Earnings-call quotes verified against transcripts. NCERT knowledge base cuts hallucinations.',
    icon:  '◇',
    tech:  ['Factual Grounding', 'RAG'],
  },
  {
    id:    'respond',
    label: 'Response Delivery',
    desc:  'Voice output (STT/TTS) in multiple languages, model fallbacks, Telegram / web delivery.',
    icon:  '◉',
    tech:  ['Google Cloud STT/TTS', 'Conversational AI'],
  },
]

export default function LlmTimeline({ color = COLOR }) {
  const sectionRef = useRef(null)
  const lineRef    = useRef(null)
  const nodeRefs   = useRef([])
  const reduced    = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return

    /* Vertical progress bar scrub */
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end:   'bottom 60%',
          scrub: 1.4,
        },
      }
    )

    /* Each step fades in from left with stagger */
    nodeRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.fromTo(
        el,
        { opacity: 0, x: -32 },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start:   'top 88%',
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
      aria-label="LLM RAG pipeline timeline"
      className="py-24 overflow-hidden"
    >
      <div className="container-grid">
        <div className="mb-12 flex flex-col gap-2">
          <p className="section-label">How I work</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text">
            The RAG &amp; LLM pipeline
          </h2>
        </div>

        {/* Vertical timeline layout */}
        <div className="relative flex flex-col gap-0 max-w-2xl">

          {/* Vertical track line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block"
            aria-hidden="true"
          />
          {/* Animated fill line */}
          <div
            ref={lineRef}
            className="absolute left-6 top-0 bottom-0 w-px hidden sm:block origin-top"
            style={{
              background: `linear-gradient(180deg, ${color}, ${color}22)`,
              scaleY: reduced ? 1 : 0,
            }}
            aria-hidden="true"
          />

          <ol className="relative flex flex-col gap-0">
            {STEPS.map((step, i) => (
              <li
                key={step.id}
                ref={el => (nodeRefs.current[i] = el)}
                className="relative flex items-start gap-6 py-6"
                style={{ opacity: reduced ? 1 : 0 }}
              >
                {/* Node circle */}
                <div
                  className="relative z-10 flex-shrink-0 flex h-12 w-12 items-center justify-center
                             rounded-full border-2 bg-base text-base transition-all duration-300
                             sm:ml-0 ml-0"
                  style={{
                    borderColor: color,
                    color,
                    boxShadow: `0 0 20px -6px ${color}80`,
                  }}
                  aria-hidden="true"
                >
                  <span className="text-lg">{step.icon}</span>
                  {/* Step number badge */}
                  <span
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center
                               rounded-full text-[9px] font-mono font-bold"
                    style={{ background: color, color: '#080b12' }}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 pb-2">
                  <span
                    className="font-display font-semibold text-sm"
                    style={{ color }}
                  >
                    {step.label}
                  </span>
                  <p className="font-body text-sm text-muted leading-relaxed">
                    {step.desc}
                  </p>
                  {/* Tech pills */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {step.tech.map(t => (
                      <span
                        key={t}
                        className="font-mono text-2xs px-2 py-0.5 rounded border text-muted"
                        style={{ borderColor: `${color}40` }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Connector dot on the track */}
                {i < STEPS.length - 1 && (
                  <div
                    className="absolute left-6 bottom-0 h-px w-px hidden sm:block"
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

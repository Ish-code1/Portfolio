import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * PipelineTimeline — scroll-scrubbed MLOps pipeline for the /mlops page.
 * Stages: Data → Train → Track → Package → Serve → CI/CD
 * Motion language: horizontal left-to-right flow with a progress bar fill,
 * matching the ring-orbit visual metaphor of MlopsScene.
 * Accent: #10b981 (emerald green)
 */

const COLOR = '#10b981'

const STAGES = [
  {
    id:    'data',
    label: 'Data Ingestion',
    desc:  'Version raw datasets, track lineage, detect drift between training and production distributions.',
    icon:  '⬡',
    tech:  ['DVC', 'Pandas', 'SQL'],
  },
  {
    id:    'train',
    label: 'Model Training',
    desc:  'Reproducible training runs with pinned deps, seed control, and configurable hyperparameter sweeps.',
    icon:  '◈',
    tech:  ['PyTorch', 'Scikit-learn', 'Gemini API'],
  },
  {
    id:    'track',
    label: 'Experiment Tracking',
    desc:  'Log metrics, params and artefacts per run. Compare experiments, roll back to any checkpoint.',
    icon:  '◎',
    tech:  ['MLflow', 'Experiment Tracking'],
  },
  {
    id:    'package',
    label: 'Model Packaging',
    desc:  'Containerise the model + its environment. Reproducible image builds; no "works on my machine".',
    icon:  '◇',
    tech:  ['Docker', 'Model Management'],
  },
  {
    id:    'serve',
    label: 'API Serving',
    desc:  'Expose predictions via FastAPI endpoints. Health checks, versioned routes, Pydantic validation.',
    icon:  '▲',
    tech:  ['FastAPI', 'API Model Serving', 'REST'],
  },
  {
    id:    'cicd',
    label: 'CI / CD',
    desc:  'Automated test → build → push → deploy on every merge. Gate on eval metrics before promotion.',
    icon:  '◉',
    tech:  ['CI/CD', 'Docker', 'GitHub Actions'],
  },
]

export default function PipelineTimeline({ color = COLOR }) {
  const sectionRef = useRef(null)
  const lineRef    = useRef(null)
  const nodeRefs   = useRef([])
  const reduced    = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return

    /* Progress line scrub — horizontal fill */
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end:   'bottom 60%',
          scrub: 1.3,
        },
      }
    )

    /* Each stage animates up with stagger */
    nodeRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.fromTo(
        el,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
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
      aria-label="MLOps deployment pipeline"
      className="py-24 overflow-hidden"
    >
      <div className="container-grid">
        <div className="mb-12 flex flex-col gap-2">
          <p className="section-label">How I work</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text">
            The MLOps pipeline
          </h2>
        </div>

        {/* Horizontal timeline */}
        <div className="relative">
          {/* Background track */}
          <div
            className="absolute top-7 left-0 right-0 h-px bg-border hidden md:block"
            aria-hidden="true"
          />
          {/* Animated fill */}
          <div
            ref={lineRef}
            className="absolute top-7 left-0 right-0 h-px hidden md:block origin-left"
            style={{
              background: `linear-gradient(90deg, ${color}, ${color}33)`,
              scaleX: reduced ? 1 : 0,
            }}
            aria-hidden="true"
          />

          <ol className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4">
            {STAGES.map((stage, i) => (
              <li
                key={stage.id}
                ref={el => (nodeRefs.current[i] = el)}
                className="flex flex-col items-center md:items-start gap-3 text-center md:text-left"
                style={{ opacity: reduced ? 1 : 0 }}
              >
                {/* Node */}
                <div
                  className="relative z-10 flex h-14 w-14 items-center justify-center
                             rounded-full border-2 bg-base text-xl transition-all duration-300"
                  style={{
                    borderColor: color,
                    color,
                    boxShadow: `0 0 18px -5px ${color}70`,
                  }}
                  aria-hidden="true"
                >
                  <span className="text-lg">{stage.icon}</span>
                  {/* Badge */}
                  <span
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center
                               rounded-full text-[9px] font-mono font-bold"
                    style={{ background: color, color: '#080b12' }}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Text */}
                <div className="flex flex-col gap-1.5">
                  <span className="font-display font-semibold text-sm" style={{ color }}>
                    {stage.label}
                  </span>
                  <p className="font-body text-xs text-muted leading-relaxed">
                    {stage.desc}
                  </p>
                  {/* Tech pills */}
                  <div className="flex flex-wrap gap-1.5 mt-0.5 justify-center md:justify-start">
                    {stage.tech.map(t => (
                      <span
                        key={t}
                        className="font-mono text-2xs px-1.5 py-0.5 rounded border text-muted"
                        style={{ borderColor: `${color}40` }}
                      >
                        {t}
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

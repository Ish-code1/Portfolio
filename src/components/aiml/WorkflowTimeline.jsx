import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * WorkflowTimeline — horizontal scroll-scrubbed pipeline for the AI/ML page.
 * Shows the standard ML lifecycle: Data → Preprocess → Train → Evaluate → Deploy.
 * The progress line and each node animate as the user scrolls.
 */

const STEPS = [
  {
    id: 'data',
    label: 'Data Collection',
    desc:  'Gather, clean and version raw datasets. Understand distributions, handle missings.',
    icon:  '⬡',
  },
  {
    id: 'preprocess',
    label: 'Preprocessing',
    desc:  'Feature engineering, normalisation, augmentation, train/val/test splits.',
    icon:  '⟳',
  },
  {
    id: 'model',
    label: 'Model Development',
    desc:  'Architecture design, baseline experiments, hyperparameter search, ablations.',
    icon:  '◈',
  },
  {
    id: 'cv',
    label: 'Computer Vision',
    desc:  'OpenCV + MediaPipe pipelines, landmark detection, gesture-intent mapping.',
    icon:  '◉',
  },
  {
    id: 'evaluate',
    label: 'Evaluation',
    desc:  'Metrics, confusion matrices, latency profiling, bias checks.',
    icon:  '◇',
  },
  {
    id: 'predict',
    label: 'Predictive Modelling',
    desc:  'Regression, classification, time-series — from notebook to production API.',
    icon:  '▲',
  },
]

export default function WorkflowTimeline({ color }) {
  const sectionRef  = useRef(null)
  const lineRef     = useRef(null)
  const nodeRefs    = useRef([])
  const reduced     = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return

    /* Progress line scrub */
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
          scrub: 1.2,
        },
      }
    )

    /* Each node fades in staggered */
    nodeRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.fromTo(
        el,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0,
          duration: 0.55,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
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
      aria-label="ML workflow timeline"
      className="py-24 overflow-hidden"
    >
      <div className="container-grid">
        <div className="mb-12 flex flex-col gap-2">
          <p className="section-label">How I work</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text">
            The ML lifecycle
          </h2>
        </div>

        {/* Timeline track */}
        <div className="relative">
          {/* Background track line */}
          <div
            className="absolute top-7 left-0 right-0 h-px bg-border hidden md:block"
            aria-hidden="true"
          />
          {/* Animated fill line */}
          <div
            ref={lineRef}
            className="absolute top-7 left-0 right-0 h-px hidden md:block origin-left"
            style={{
              background: `linear-gradient(90deg, ${color}, ${color}44)`,
              scaleX: reduced ? 1 : 0,
            }}
            aria-hidden="true"
          />

          {/* Steps grid */}
          <ol className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4">
            {STEPS.map((step, i) => (
              <li
                key={step.id}
                ref={el => nodeRefs.current[i] = el}
                className="flex flex-col items-center md:items-start gap-3 text-center md:text-left"
                style={{ opacity: reduced ? 1 : 0 }}
              >
                {/* Node circle */}
                <div
                  className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 bg-base text-xl
                             transition-all duration-300"
                  style={{
                    borderColor: color,
                    color,
                    boxShadow: `0 0 16px -4px ${color}66`,
                  }}
                  aria-hidden="true"
                >
                  {step.icon}
                  {/* Step number */}
                  <span
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-mono font-bold"
                    style={{ background: color, color: '#080b12' }}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Label + description */}
                <div className="flex flex-col gap-1">
                  <span
                    className="font-display font-semibold text-sm"
                    style={{ color }}
                  >
                    {step.label}
                  </span>
                  <p className="font-body text-xs text-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

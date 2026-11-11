import { lazy, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LazyLoader from '../components/LazyLoader'
import PhotoFrame        from '../components/home/PhotoFrame'
import DomainPortal      from '../components/home/DomainPortal'
import FeaturedProjectCard from '../components/home/FeaturedProjectCard'
import HackathonRow      from '../components/home/HackathonRow'
import SplitText         from '../components/home/SplitText'
import AnimatedCounter   from '../components/home/AnimatedCounter'
import {
  IconAiMl, IconGenAi, IconMlops, IconSoftware, IconComms,
} from '../components/home/icons'
import {
  IDENTITY, HOME, DOMAINS, PROJECTS, HACKATHONS, COUNTERS, DOMAIN_COLORS,
} from '../content'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

// Lazy-load the heavy WebGL hero only on desktop / capable devices
const NeuralMesh = lazy(() => import('../components/home/NeuralMesh'))

/* ─── Portal config ───────────────────────────────────────────────── */
const PORTALS = [
  {
    label:       DOMAINS.aiml.label,
    href:        `/${DOMAINS.aiml.slug}`,
    color:       DOMAIN_COLORS.aiml,
    icon:        <IconAiMl />,
    description: DOMAINS.aiml.tagline,
  },
  {
    label:       DOMAINS.genai.label,
    href:        `/${DOMAINS.genai.slug}`,
    color:       DOMAIN_COLORS.genai,
    icon:        <IconGenAi />,
    description: DOMAINS.genai.tagline,
  },
  {
    label:       DOMAINS.mlops.label,
    href:        `/${DOMAINS.mlops.slug}`,
    color:       DOMAIN_COLORS.mlops,
    icon:        <IconMlops />,
    description: DOMAINS.mlops.tagline,
  },
  {
    label:       DOMAINS.software.label,
    href:        `/${DOMAINS.software.slug}`,
    color:       DOMAIN_COLORS.software,
    icon:        <IconSoftware />,
    description: DOMAINS.software.tagline,
  },
  {
    label:       DOMAINS.comms.label,
    href:        `/${DOMAINS.comms.slug}`,
    color:       DOMAIN_COLORS.comms,
    icon:        <IconComms />,
    description: DOMAINS.comms.tagline,
  },
]

/* ─── Detect touch / low-end device for mesh fallback ──────────────── */
const isTouchOrLow =
  typeof window !== 'undefined' &&
  (navigator.maxTouchPoints > 0 || window.innerWidth < 768)

/* ══════════════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const reduced     = useReducedMotion()
  const heroTextRef = useRef(null)
  const ctaRef      = useRef(null)

  /* ── Hero text entrance ─────────────────────────────────────── */
  useEffect(() => {
    if (reduced) return
    gsap.fromTo(
      heroTextRef.current,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.9, delay: 0.15, ease: 'expo.out' }
    )
  }, [reduced])

  /* ── CTA section parallax ───────────────────────────────────── */
  useEffect(() => {
    if (reduced || !ctaRef.current) return
    gsap.fromTo(
      ctaRef.current,
      { opacity: 0, scale: 0.97 },
      {
        opacity: 1, scale: 1,
        duration: 0.7,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, [reduced])

  return (
    <main className="relative min-h-screen overflow-x-hidden">

      {/* ══════ 1. HERO ═══════════════════════════════════════════ */}
      <section
        aria-label="Hero"
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-nav"
      >
        {/* WebGL neural mesh — lazy, mobile fallback is CSS grid */}
        {isTouchOrLow || reduced ? (
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        ) : (
          <LazyLoader>
            <NeuralMesh />
          </LazyLoader>
        )}

        {/* Radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, transparent 40%, #080b12 90%)',
          }}
        />

        {/* Hero content */}
        <div
          ref={heroTextRef}
          className="container-grid relative z-10 flex flex-col items-center gap-8 text-center"
          style={{ opacity: reduced ? 1 : 0 }}
        >
          {/* Photo + identity */}
          <div className="flex flex-col items-center gap-6 md:flex-row md:gap-10 md:text-left">
            <PhotoFrame />

            <div className="flex flex-col items-center gap-4 md:items-start">
              {/* Label */}
              <p className="section-label tracking-[0.25em]">Neural Control Room</p>

              {/* Name */}
              <h1 className="font-display font-bold leading-none text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-text">
                <SplitText text={IDENTITY.name} mode="words" delay={0.2} stagger={0.08} />
              </h1>

              {/* Tagline */}
              <p className="font-mono text-xs sm:text-sm text-muted max-w-xs md:max-w-sm leading-relaxed">
                {IDENTITY.tagline}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 mt-2">
                <Link
                  to="/projects"
                  data-magnetic
                  className="btn-magnetic text-aiml border-aiml/40 hover:bg-aiml/10 font-display text-sm"
                >
                  {HOME.heroCta}
                </Link>
                <a
                  href={IDENTITY.resume}
                  download
                  data-magnetic
                  className="btn-magnetic text-text border-border hover:border-text font-display text-sm"
                >
                  Résumé ↓
                </a>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40" aria-hidden="true">
            <span className="font-mono text-2xs uppercase tracking-widest text-muted">Scroll</span>
            <div className="h-8 w-px bg-gradient-to-b from-aiml to-transparent animate-pulse" />
          </div>
        </div>
      </section>

      {/* ══════ 2. DOMAIN PORTALS ═════════════════════════════════ */}
      <section aria-labelledby="portals-heading" className="relative py-24">
        <div className="container-grid">
          <div className="mb-10 flex flex-col gap-2">
            <p className="section-label">Explore the grid</p>
            <h2 id="portals-heading" className="font-display font-bold text-3xl sm:text-4xl text-text">
              Five domains. One engineer.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PORTALS.map((p, i) => (
              <DomainPortal key={p.href} {...p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ 3. STATS / COUNTERS ═══════════════════════════════ */}
      <section aria-label="Key metrics" className="py-12 border-y border-border bg-surface/30">
        <div className="container-grid">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { label: 'Backend tests (FinSight)',    value: 86,  suffix: '' },
              { label: 'Playwright tests',            value: 13,  suffix: '' },
              { label: 'Gesture latency',             value: 40,  suffix: 'ms', prefix: '~' },
              { label: 'Hackathon placements',        value: 4,   suffix: '' },
            ].map(({ label, value, suffix, prefix }) => (
              <div key={label} className="flex flex-col gap-1">
                <dt className="section-label text-xs">{label}</dt>
                <dd className="font-display font-bold text-4xl sm:text-5xl glow text-aiml">
                  <AnimatedCounter target={value} suffix={suffix} prefix={prefix ?? ''} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ══════ 4. FEATURED PROJECTS ══════════════════════════════ */}
      <section aria-labelledby="projects-heading" className="py-24">
        <div className="container-grid">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="section-label">{HOME.featuredLabel}</p>
              <h2 id="projects-heading" className="font-display font-bold text-3xl sm:text-4xl text-text">
                What I've shipped
              </h2>
            </div>
            <Link
              to="/projects"
              className="font-mono text-xs text-aiml hover:text-text transition-colors duration-200 self-start sm:self-auto"
            >
              All projects →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {PROJECTS.map((p, i) => (
              <FeaturedProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ 5. HACKATHONS ═════════════════════════════════════ */}
      <section aria-labelledby="hackathons-heading" className="py-24 border-t border-border">
        <div className="container-grid">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Left — heading + flavour */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <p className="section-label">{HOME.hackathonsLabel}</p>
                <h2
                  id="hackathons-heading"
                  className="font-display font-bold text-3xl sm:text-4xl text-text"
                >
                  Competitive wins
                </h2>
              </div>

              <p className="text-muted text-sm leading-relaxed max-w-sm">
                Competed across national and global stages—individually and in teams—solving
                real-world problems with AI under tight deadlines.
              </p>

              {/* Visual accent element */}
              <div className="flex flex-col gap-1 mt-4" aria-hidden="true">
                {[DOMAIN_COLORS.aiml, DOMAIN_COLORS.genai, DOMAIN_COLORS.mlops, DOMAIN_COLORS.comms].map((c, i) => (
                  <div
                    key={i}
                    className="h-px rounded-full transition-all duration-700"
                    style={{ width: `${100 - i * 15}%`, background: c, opacity: 0.6 - i * 0.1 }}
                  />
                ))}
              </div>
            </div>

            {/* Right — list */}
            <div>
              <ul role="list" className="divide-y-0">
                {HACKATHONS.map((h, i) => (
                  <HackathonRow
                    key={h.name}
                    placement={h.placement}
                    name={h.name}
                    scope={h.scope}
                    team={h.team}
                    index={i}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ 6. CTA ════════════════════════════════════════════ */}
      <section aria-label="Call to action" className="py-28 border-t border-border">
        <div className="container-grid">
          <div
            ref={ctaRef}
            className="relative overflow-hidden rounded border border-border bg-surface/60 backdrop-blur-sm p-10 sm:p-16 flex flex-col items-center text-center gap-8"
            style={{ opacity: reduced ? 1 : 0 }}
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 100%, rgba(0,229,255,0.07) 0%, transparent 65%)',
              }}
            />

            {/* Corner tick marks */}
            {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r',
              'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((cls) => (
              <span
                key={cls}
                className={`absolute ${cls} border-aiml/30 w-6 h-6`}
                aria-hidden="true"
              />
            ))}

            <p className="section-label relative z-10">Ready to connect</p>

            <h2 className="relative z-10 font-display font-bold text-4xl sm:text-5xl md:text-6xl text-text max-w-2xl leading-tight">
              <SplitText text={HOME.ctaHeading} mode="words" stagger={0.07} />
            </h2>

            <div className="relative z-10 flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                data-magnetic
                className="btn-magnetic text-aiml border-aiml/50 hover:bg-aiml/10 font-display px-8 py-4 text-base"
              >
                {HOME.ctaButton}
              </Link>
              <a
                href={IDENTITY.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
                className="btn-magnetic text-text border-border hover:border-text font-display px-8 py-4 text-base"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

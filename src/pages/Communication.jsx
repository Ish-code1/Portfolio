import { lazy, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DOMAINS, DOMAIN_COLORS, HACKATHONS } from '../content'
import DomainHero from '../components/shared/DomainHero'
import LazyLoader from '../components/LazyLoader'
import {
  SoundwaveStrip,
  RoleCard,
  EvalBadge,
  CommHackathonCard,
} from '../components/communication/CommComponents'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const CommScene = lazy(() => import('../components/communication/CommScene'))

const d     = DOMAINS.comms
const COLOR = DOMAIN_COLORS.comms  // #f59e0b (amber)

// ── Role cards data ──────────────────────────────────────────────
const ROLE_CARDS = [
  {
    icon: '📣',
    title: 'PR Head \u2014 Kriva ML Society',
    body:  'Led public relations strategy, outreach, and communications for the college ML society.',
  },
  {
    icon: '🌐',
    title: 'Campus Ambassador \u2014 KIET',
    body:  'Represented KIET at external events; built inter-campus networks and drove participation.',
  },
  {
    icon: '🏛\uFE0F',
    title: 'Dept of PR & International Relations',
    body:  'Facilitated international liaison work and cross-cultural academic communication.',
  },
  {
    icon: '🎙\uFE0F',
    title: 'Public Speaking & Event Anchoring',
    body:  'Anchored and managed logistics for International Education Awareness Week.',
  },
  {
    icon: '🧑\u200D💻',
    title: 'Technical Presentations',
    body:  'Presenting AI/ML research, project demos, and deep-dive technical walkthroughs to mixed audiences.',
  },
  {
    icon: '🤝',
    title: 'Mentoring',
    body:  'Guiding peers through AI fundamentals, project scoping, and practical ML workflows as an E-Booster Mentor.',
  },
]

// ── Spotlight heading with GSAP reveal ──────────────────────────
function SpotlightHeading({ children, color }) {
  const ref     = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !ref.current) return
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, [reduced])

  return (
    <h2
      ref={ref}
      className="font-display font-bold text-3xl sm:text-4xl text-text"
      style={{ opacity: reduced ? 1 : 0, '--accent': color }}
    >
      {children}
    </h2>
  )
}

// ── Section divider with soundwave ──────────────────────────────
function WaveDivider({ color }) {
  return (
    <div className="flex items-center gap-4 my-2" aria-hidden="true">
      <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${color}40, transparent)` }} />
      <SoundwaveStrip color={color} barCount={18} />
      <div className="h-px flex-1" style={{ background: `linear-gradient(270deg, ${color}40, transparent)` }} />
    </div>
  )
}

export default function Communication() {
  return (
    <main style={{ '--accent': COLOR }}>

      {/* ══════ 1. HERO — stage + soundwave scene ══════════════════ */}
      <DomainHero
        label="Domain / Communication &amp; Leadership"
        heading={d.label}
        tagline={d.tagline}
        color={COLOR}
        Scene={CommScene}
        sceneH="h-72 md:h-96"
      />

      {/* Warm tint overlay stripe — unique to this page */}
      <div
        className="h-px w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${COLOR}80, transparent)` }}
        aria-hidden="true"
      />

      {/* ══════ 2. SOUNDWAVE INTRO STRIP ═══════════════════════════ */}
      <div className="border-t border-border py-10">
        <div className="container-grid">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex flex-col gap-1 flex-1">
              <p className="section-label" style={{ color: COLOR }}>On stage &amp; off</p>
              <p className="font-body text-muted text-sm sm:text-base leading-relaxed max-w-xl">
                From keynote stages to mentorship sessions — bridging technical depth with
                the clarity that makes ideas land.
              </p>
            </div>
            <div className="flex-shrink-0" aria-hidden="true">
              <SoundwaveStrip color={COLOR} barCount={22} />
            </div>
          </div>
        </div>
      </div>

      {/* ══════ 3. AI GENERALIST — MODEL EVALUATION ════════════════ */}
      <section aria-labelledby="ai-generalist-heading" className="py-20 border-t border-border relative overflow-hidden">
        {/* Spotlight cone effect */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, ${COLOR}80, transparent)` }}
          aria-hidden="true"
        />
        <div
          className="absolute top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${COLOR}18 0%, transparent 70%)`,
            filter: 'blur(24px)',
          }}
          aria-hidden="true"
        />

        <div className="container-grid relative z-10">
          <div className="max-w-3xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-3 text-center">
              <p className="section-label" style={{ color: COLOR }}>AI Generalist</p>
              <SpotlightHeading color={COLOR}>{d.aiGeneralist.title}</SpotlightHeading>
              <p className="font-body text-sm sm:text-base leading-relaxed" style={{ color: '#ffffff' }}>
                Evaluating AI model outputs across multiple dimensions — ensuring responses
                are grounded, reasoned and reliable.
              </p>
            </div>

            <WaveDivider color={COLOR} />

            <div className="flex flex-wrap gap-3 justify-center">
              {d.aiGeneralist.areas.map(area => (
                <EvalBadge key={area} label={area} color={COLOR} />
              ))}
            </div>

            {/* Dimension detail cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {[
                {
                  area: 'Response Quality',
                  desc: 'Assessing coherence, completeness, and appropriate tone across diverse prompts.',
                  icon: '✦',
                },
                {
                  area: 'Factual Accuracy',
                  desc: 'Verifying grounding and citation quality; catching hallucinations and errors.',
                  icon: '◎',
                },
                {
                  area: 'Reasoning',
                  desc: 'Evaluating multi-step logic chains, edge-case handling, and chain-of-thought clarity.',
                  icon: '⟡',
                },
                {
                  area: 'Code Outputs',
                  desc: 'Testing correctness, efficiency, edge cases, and adherence to best practices in generated code.',
                  icon: '⌥',
                },
              ].map((item, i) => (
                <RoleCard
                  key={item.area}
                  icon={item.icon}
                  title={item.area}
                  body={item.desc}
                  color={COLOR}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ 4. LEADERSHIP ROLES GRID ═══════════════════════════ */}
      <section aria-labelledby="roles-heading" className="py-20 border-t border-border relative overflow-hidden">
        {/* Warm ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${COLOR}10, transparent 60%)` }}
          aria-hidden="true"
        />

        <div className="container-grid relative z-10">
          <div className="mb-10 flex flex-col gap-3">
            <p className="section-label" style={{ color: COLOR }}>Roles &amp; Responsibilities</p>
            <SpotlightHeading color={COLOR}>Leadership in action</SpotlightHeading>
            <WaveDivider color={COLOR} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROLE_CARDS.map((card, i) => (
              <RoleCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                body={card.body}
                color={COLOR}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ 5. HACKATHONS ══════════════════════════════════════ */}
      <section aria-labelledby="hackathons-heading" className="py-20 border-t border-border relative overflow-hidden">
        {/* Stage floor glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-32 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${COLOR}20, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        <div className="container-grid relative z-10">
          <div className="mb-10 flex flex-col gap-3">
            <p className="section-label" style={{ color: COLOR }}>Competition Record</p>
            <SpotlightHeading color={COLOR}>On the hackathon stage</SpotlightHeading>
            <WaveDivider color={COLOR} />
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-6 mb-10">
            {[
              { value: '4', label: 'Hackathons entered' },
              { value: 'Top 6', label: 'Best placement' },
              { value: 'Top 50', label: "Worldwide (Namespace '26)" },
              { value: '3\u00d7', label: 'Podium / finalist' },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col gap-0.5">
                <span
                  className="font-display font-bold text-2xl sm:text-3xl"
                  style={{ color: COLOR }}
                >
                  {stat.value}
                </span>
                <span className="font-mono text-2xs text-muted">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Hackathon list */}
          <div
            className="rounded border border-border bg-surface/40 backdrop-blur-sm overflow-hidden relative"
          >
            {/* Top accent bar */}
            <div
              className="h-px w-full"
              style={{ background: `linear-gradient(90deg, ${COLOR}, ${COLOR}30, transparent)` }}
              aria-hidden="true"
            />
            {/* Warm inner glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 10% 50%, ${COLOR}08, transparent 55%)` }}
              aria-hidden="true"
            />
            <ul className="relative z-10 px-4 md:px-6" aria-label="Hackathon results">
              {HACKATHONS.map((h, i) => (
                <CommHackathonCard
                  key={h.name}
                  placement={h.placement}
                  name={h.name}
                  scope={h.scope}
                  team={h.team}
                  index={i}
                  color={COLOR}
                />
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══════ 6. BACK / NEXT STRIP ══════════════════════════════ */}
      <div className="border-t border-border py-8">
        <div className="container-grid flex items-center justify-between flex-wrap gap-4">
          <span className="font-mono text-xs text-muted">
            Communication &amp; Leadership &middot;{' '}
            <span style={{ color: COLOR }}>Ishita Saxena</span>
          </span>
          <div className="flex gap-6">
            <a
              href="/software"
              className="font-mono text-xs text-muted hover:text-text transition-colors duration-200"
            >
              ← Software
            </a>
            <a
              href="/projects"
              className="font-mono text-xs text-muted hover:text-text transition-colors duration-200"
            >
              All Projects →
            </a>
          </div>
        </div>
      </div>

    </main>
  )
}

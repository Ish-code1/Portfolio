import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROJECTS, DOMAIN_COLORS } from '../content'
import ProjectFilterBar   from '../components/projects/ProjectFilterBar'
import ProjectGridCard    from '../components/projects/ProjectGridCard'
import ProjectDetailModal from '../components/projects/ProjectDetailModal'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

// ── Tag → accent colour lookup ────────────────────────────────────
const TAG_COLORS = {
  'All':      '#e2e8f0',
  'AI/ML':    DOMAIN_COLORS.aiml,
  'GenAI':    DOMAIN_COLORS.genai,
  'MLOps':    DOMAIN_COLORS.mlops,
  'Software': DOMAIN_COLORS.software,
}

// ── Unique ordered tags (preserving first-appearance order) ───────
const ALL_TAGS = [...new Set(PROJECTS.flatMap(p => p.tags))]

// ── Hero heading with stagger reveal ─────────────────────────────
function HeroText({ reduced }) {
  const ref = useRef(null)
  useEffect(() => {
    if (reduced || !ref.current) return
    gsap.fromTo(
      [...ref.current.children],
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'expo.out', delay: 0.05 }
    )
  }, [reduced])
  return (
    <div ref={ref} className="flex flex-col gap-3">
      <p className="section-label" style={{ opacity: reduced ? 1 : 0 }}>All Work</p>
      <h1
        className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-text leading-tight"
        style={{ opacity: reduced ? 1 : 0 }}
      >
        Projects
      </h1>
      <div
        className="h-px w-24 rounded-full"
        style={{
          background: 'linear-gradient(90deg, #e2e8f0, transparent)',
          opacity: reduced ? 1 : 0,
        }}
        aria-hidden="true"
      />
      <p
        className="font-body text-muted text-base sm:text-lg leading-relaxed max-w-lg"
        style={{ opacity: reduced ? 1 : 0 }}
      >
        Every project built from facts — no inflated numbers, no invented features.
        Filter by domain or click any card for the full story.
      </p>
    </div>
  )
}

export default function Projects() {
  const location = useLocation()
  const reduced  = useReducedMotion()

  const [activeTag,  setActiveTag]  = useState('All')
  const [openId,     setOpenId]     = useState(null)   // id of expanded project

  // ── Deep-link: /projects#finsight opens that project ─────────────
  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (hash) {
      const match = PROJECTS.find(p => p.id === hash)
      if (match) {
        setOpenId(hash)
        // Scroll the card into view after a short delay (let page render)
        setTimeout(() => {
          const el = document.getElementById(hash)
          if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
        }, 300)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash])

  // ── Filter logic ──────────────────────────────────────────────────
  const filtered = useMemo(
    () => activeTag === 'All'
      ? PROJECTS
      : PROJECTS.filter(p => p.tags.includes(activeTag)),
    [activeTag]
  )

  // When filter changes, close any open detail panel
  const handleTagChange = useCallback((tag) => {
    setActiveTag(tag)
    setOpenId(null)
  }, [])

  // Toggle open/close for a card
  const handleOpen = useCallback((id) => {
    setOpenId(prev => (prev === id ? null : id))
  }, [])

  // ── Animate grid container when filter changes ────────────────────
  const gridRef = useRef(null)
  useEffect(() => {
    if (reduced || !gridRef.current) return
    gsap.fromTo(
      [...(gridRef.current.children ?? [])],
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.35, stagger: 0.05, ease: 'expo.out' }
    )
  }, [activeTag, reduced])

  return (
    <main className="min-h-screen" style={{ '--accent': '#e2e8f0' }}>

      {/* ══════ 1. HERO ════════════════════════════════════════════ */}
      <section aria-label="Projects hero" className="relative overflow-hidden pt-nav">
        {/* Subtle grid bg glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.06), transparent 60%)' }}
          aria-hidden="true"
        />

        <div className="container-grid py-16 md:py-24 relative z-10">
          <HeroText reduced={reduced} />
        </div>
      </section>

      {/* ══════ 2. FILTER + GRID ═══════════════════════════════════ */}
      <section aria-labelledby="projects-grid-heading" className="border-t border-border pb-24">
        <div className="container-grid">

          {/* Filter bar — sticky within section */}
          <div className="sticky top-nav z-30 bg-base/90 backdrop-blur-md border-b border-border py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span
                id="projects-grid-heading"
                className="section-label flex-shrink-0"
              >
                {activeTag === 'All'
                  ? `Showing all ${PROJECTS.length} projects`
                  : `${filtered.length} project${filtered.length !== 1 ? 's' : ''} in ${activeTag}`}
              </span>
              <ProjectFilterBar
                tags={ALL_TAGS}
                active={activeTag}
                onChange={handleTagChange}
                colors={TAG_COLORS}
              />
            </div>
          </div>

          {/* Project grid */}
          <div
            ref={gridRef}
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filtered.map((project, i) => (
              <>
                <ProjectGridCard
                  key={project.id}
                  project={project}
                  index={i}
                  onOpen={() => handleOpen(project.id)}
                  isActive={openId === project.id}
                />

                {/* Detail panel spans full grid row — appears after the card */}
                {openId === project.id && (
                  <ProjectDetailModal
                    key={`detail-${project.id}`}
                    project={project}
                    onClose={() => setOpenId(null)}
                  />
                )}
              </>
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="mt-16 flex flex-col items-center gap-3 text-center py-16">
              <span className="font-mono text-xs text-slate-400">No projects match this filter.</span>
            </div>
          )}

        </div>
      </section>

      {/* ══════ 3. BOTTOM STRIP ════════════════════════════════════ */}
      <div className="border-t border-border py-8">
        <div className="container-grid flex items-center justify-between flex-wrap gap-4">
          <span className="font-mono text-xs text-muted">
            All Projects · <span className="text-text">Ishita Saxena</span>
          </span>
          <div className="flex gap-6">
            <a href="/communication" className="font-mono text-xs text-muted hover:text-text transition-colors duration-200">
              ← Communication
            </a>
            <a href="/contact" className="font-mono text-xs text-muted hover:text-text transition-colors duration-200">
              Contact →
            </a>
          </div>
        </div>
      </div>

    </main>
  )
}

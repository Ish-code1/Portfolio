import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { CONTACT, IDENTITY } from '../content'
import { useReducedMotion } from '../hooks/useReducedMotion'

/* ── SVG icons ───────────────────────────────────────────────────── */
function IconGitHub() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function IconEmail() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  )
}

function IconDownload() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
}

/* ── Social card ─────────────────────────────────────────────────── */
function SocialCard({ href, icon, label, handle, accent, external = true }) {
  const cardRef = useRef(null)

  return (
    <a
      ref={cardRef}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={`${label}: ${handle}`}
      className="group relative flex items-center gap-4 rounded-sm border border-border bg-surface/60
                 px-5 py-4 hover:border-current transition-colors duration-300 focus-visible:outline-2
                 min-w-0"
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = accent
        e.currentTarget.style.color = accent
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = ''
        e.currentTarget.style.color = ''
      }}
    >
      {/* Glow blob */}
      <span
        className="pointer-events-none absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 20% 50%, ${accent}1a 0%, transparent 70%)` }}
        aria-hidden="true"
      />
      <span className="relative z-10 flex-shrink-0 text-current">{icon}</span>
      <span className="relative z-10 flex flex-col min-w-0">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">{label}</span>
        <span className="font-display text-sm font-medium text-text group-hover:text-current transition-colors duration-200 truncate">
          {handle}
        </span>
      </span>
    </a>
  )
}

/* ── Main page ───────────────────────────────────────────────────── */
export default function Contact() {
  const reduced   = useReducedMotion()
  const headerRef = useRef(null)
  const cardsRef  = useRef(null)
  const ctaRef    = useRef(null)
  const noteRef   = useRef(null)

  /* GSAP reveal on mount */
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const headerEls = headerRef.current ? [...headerRef.current.children] : []
      if (headerEls.length) {
        gsap.from(headerEls, {
          y: 32, opacity: 0,
          duration: 0.8, stagger: 0.12,
          ease: 'expo.out', delay: 0.1,
        })
      }
      if (cardsRef.current?.children.length) {
        gsap.from([...cardsRef.current.children], {
          y: 24, opacity: 0,
          duration: 0.7, stagger: 0.1,
          ease: 'expo.out', delay: 0.4,
        })
      }
      if (ctaRef.current) {
        gsap.from(ctaRef.current, { y: 20, opacity: 0, duration: 0.7, ease: 'expo.out', delay: 0.9 })
      }
      if (noteRef.current) {
        gsap.from(noteRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out', delay: 1.1 })
      }
    })
    return () => ctx.revert()
  }, [reduced])

  return (
    <main className="min-h-screen pt-nav pb-24 px-4 relative overflow-hidden">

      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Warm accent glow */}
      <div
        className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 w-[500px] h-[260px]
                   rounded-full opacity-10 blur-[80px]"
        style={{ background: 'radial-gradient(ellipse, #00e5ff 0%, #a855f7 100%)' }}
        aria-hidden="true"
      />

      <div className="container-grid relative z-10">

        {/* ── Header ────────────────────────────────────────────── */}
        <div ref={headerRef} className="pt-16 pb-12 flex flex-col items-center text-center gap-4">
          <p className="section-label !text-slate-200 font-semibold tracking-[0.25em]">Get in Touch</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-text leading-tight">
            {CONTACT.heading}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xs sm:max-w-md leading-relaxed">
            {CONTACT.subheading}
          </p>
        </div>

        {/* ── Resume CTA ────────────────────────────────────────── */}
        <div ref={ctaRef} className="flex justify-center mb-12">
          <a
            href={CONTACT.resume}
            download="Ishita_Saxena_Resume.pdf"
            aria-label="Download Résumé PDF"
            className="group relative inline-flex items-center gap-3 rounded-sm border border-aiml/50
                       bg-aiml/5 px-6 py-3 sm:px-7 sm:py-4 font-display font-semibold text-aiml tracking-wide
                       hover:bg-aiml/15 hover:border-aiml transition-all duration-300
                       focus-visible:outline-2 focus-visible:outline-aiml"
          >
            <span
              className="pointer-events-none absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, #00e5ff15 0%, transparent 70%)' }}
              aria-hidden="true"
            />
            <IconDownload />
            <span>{CONTACT.resumeLabel}</span>
            {/* Animated underline bar */}
            <span
              className="absolute bottom-0 left-0 h-px w-0 bg-aiml group-hover:w-full transition-all duration-500"
              style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
              aria-hidden="true"
            />
          </a>
        </div>

        {/* ── Social cards ──────────────────────────────────────── */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto w-full"
        >
          <SocialCard
            href={CONTACT.githubUrl}
            icon={<IconGitHub />}
            label="GitHub"
            handle={`@${IDENTITY.github}`}
            accent="#00e5ff"
          />
          <SocialCard
            href={CONTACT.linkedin}
            icon={<IconLinkedIn />}
            label="LinkedIn"
            handle="Ishita Saxena"
            accent="#a855f7"
          />
          <SocialCard
            href={`mailto:${CONTACT.email}`}
            icon={<IconEmail />}
            label="Email"
            handle={CONTACT.email}
            accent="#f59e0b"
            external={false}
          />
        </div>

        {/* ── Availability note ─────────────────────────────────── */}
        <p ref={noteRef} className="mt-10 text-center font-mono text-xs text-muted">
          <span
            className="inline-block w-2 h-2 rounded-full bg-mlops mr-2 animate-pulse align-middle"
            aria-hidden="true"
          />
          Open to collaborations, internships and research opportunities.
        </p>

      </div>
    </main>
  )
}

import { lazy } from 'react'
import { DOMAINS, DOMAIN_COLORS, PROJECTS } from '../content'
import DomainHero     from '../components/shared/DomainHero'
import SkillCard      from '../components/aiml/SkillCard'
import WorkflowTimeline from '../components/aiml/WorkflowTimeline'
import ProjectChip    from '../components/shared/ProjectChip'

const AiMlScene = lazy(() => import('../components/aiml/AiMlScene'))

const d     = DOMAINS.aiml
const COLOR = DOMAIN_COLORS.aiml   // #00e5ff

/* Projects that belong to this domain */
const domainProjects = PROJECTS.filter(p => d.projects.includes(p.id))

export default function AiMl() {
  return (
    <main style={{ '--accent': COLOR }}>

      {/* ══════ 1. HERO ══════════════════════════════════════════ */}
      <DomainHero
        label="Domain / AI & ML"
        heading={d.label}
        tagline={d.tagline}
        color={COLOR}
        Scene={AiMlScene}
        sceneH="h-72 md:h-96"
      />

      {/* ══════ 2. SKILLS GRID ═══════════════════════════════════ */}
      <section aria-labelledby="skills-heading" className="py-20 border-t border-border">
        <div className="container-grid">
          <div className="mb-10 flex flex-col gap-2">
            <p className="section-label">Capabilities</p>
            <h2
              id="skills-heading"
              className="font-display font-bold text-3xl sm:text-4xl text-text"
            >
              What I bring to the model
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {d.skills.map((skill, i) => (
              <SkillCard key={skill} skill={skill} color={COLOR} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ 3. SCROLL-SCRUBBED TIMELINE ══════════════════════ */}
      <div className="border-t border-border">
        <WorkflowTimeline color={COLOR} />
      </div>

      {/* ══════ 4. PROJECTS IN THIS DOMAIN ════════════════════════ */}
      <section aria-labelledby="domain-projects-heading" className="py-20 border-t border-border">
        <div className="container-grid">
          <div className="mb-10 flex flex-col gap-2">
            <p className="section-label">Applied work</p>
            <h2
              id="domain-projects-heading"
              className="font-display font-bold text-3xl sm:text-4xl text-text"
            >
              Projects in AI & ML
            </h2>
          </div>

          {/* Project detail cards */}
          <div className="flex flex-col gap-6">
            {domainProjects.map((project) => (
              <article
                key={project.id}
                className="group relative rounded border border-border bg-surface/60 backdrop-blur-sm
                           hover:border-[var(--accent)] transition-all duration-300 overflow-hidden"
              >
                {/* Top stripe */}
                <div
                  className="h-px w-full"
                  style={{ background: `linear-gradient(90deg, ${COLOR}, transparent)` }}
                  aria-hidden="true"
                />

                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 0% 50%, ${COLOR}12, transparent 60%)` }}
                  aria-hidden="true"
                />

                <div className="relative z-10 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Left — title + description */}
                  <div className="md:col-span-2 flex flex-col gap-3">
                    <h3
                      className="font-display font-bold text-2xl text-text group-hover:text-[var(--accent)] transition-colors duration-200"
                    >
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">{project.description}</p>

                    {/* Stack pills */}
                    <div className="flex flex-wrap gap-2 mt-1">
                      {project.stack.map(s => (
                        <span
                          key={s}
                          className="font-mono text-2xs px-2 py-0.5 rounded border border-border text-muted"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right — role + links */}
                  <div className="flex flex-col gap-4 justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="section-label text-xs mb-1">My role</span>
                      <p className="font-body text-sm text-text leading-snug">{project.role}</p>
                    </div>

                    {/* Metrics (if any) */}
                    {project.metrics.length > 0 && (
                      <div className="flex flex-wrap gap-4">
                        {project.metrics.map(m => (
                          <div key={m.label} className="flex flex-col gap-0.5">
                            <span
                              className="font-display font-bold text-2xl"
                              style={{ color: COLOR }}
                            >
                              {m.value}
                            </span>
                            <span className="font-mono text-2xs text-muted">{m.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex flex-wrap gap-3">
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} GitHub`}
                          className="font-mono text-xs hover:text-[var(--accent)] text-muted transition-colors duration-200"
                        >
                          GitHub ↗
                        </a>
                      )}
                      {project.links.demo && (
                        <a
                          href={project.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} demo`}
                          className="font-mono text-xs hover:text-[var(--accent)] text-muted transition-colors duration-200"
                        >
                          Demo ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Chip strip (secondary linking) */}
          <div className="mt-10 flex flex-col gap-3">
            <p className="section-label">Quick links</p>
            <div className="flex flex-wrap gap-3">
              {domainProjects.map(p => (
                <ProjectChip key={p.id} project={p} color={COLOR} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ 5. BACK STRIP ════════════════════════════════════ */}
      <div className="border-t border-border py-8">
        <div className="container-grid flex items-center justify-between flex-wrap gap-4">
          <span className="font-mono text-xs text-muted">
            AI & ML Engineering ·{' '}
            <span style={{ color: COLOR }}>Ishita Saxena</span>
          </span>
          <div className="flex gap-6">
            <a href="/genai"
               className="font-mono text-xs text-muted hover:text-text transition-colors duration-200">
              Next: GenAI & LLM Apps →
            </a>
          </div>
        </div>
      </div>

    </main>
  )
}

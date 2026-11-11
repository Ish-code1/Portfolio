import { PROJECTS } from '../content'

export default function Projects() {
  return (
    <main className="min-h-screen pt-nav px-4 container-grid">
      <div className="py-24 flex flex-col items-center gap-6">
        <p className="section-label">All Work</p>
        <h1 className="font-display text-5xl font-bold">Projects</h1>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {PROJECTS.map(p => (
            <div
              key={p.id}
              className="rounded border border-border bg-surface/60 p-5 flex flex-col gap-2 hover:border-[var(--accent)] transition-colors duration-200"
              style={{ '--accent': p.accent }}
            >
              <span className="font-display font-semibold text-lg">{p.title}</span>
              <span className="text-muted text-sm">{p.subtitle}</span>
              <div className="flex flex-wrap gap-1 mt-auto pt-3">
                {p.tags.map(t => (
                  <span key={t} className="chip border-border text-muted">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="font-mono text-xs text-border border border-border rounded px-3 py-1 mt-6">
          Step 5 — filterable grid + detail modals incoming
        </p>
      </div>
    </main>
  )
}

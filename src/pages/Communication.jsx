import { DOMAINS } from '../content'

export default function Communication() {
  const d = DOMAINS.comms
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 pt-nav" style={{ '--accent': d.color }}>
      <p className="section-label">Domain</p>
      <h1 className="font-display text-5xl font-bold" style={{ color: d.color }}>{d.label}</h1>
      <p className="text-muted">{d.tagline}</p>
      <p className="font-mono text-xs text-border border border-border rounded px-3 py-1">Step 4 incoming</p>
    </main>
  )
}

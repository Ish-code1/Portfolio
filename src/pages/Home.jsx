import { HOME } from '../content'

/**
 * Home — stub. Full WebGL hero + content built in /step2-home.
 */
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 pt-nav">
      <h1 className="font-display text-5xl md:text-7xl font-bold text-center glow text-aiml">
        {HOME.heroHeading}
      </h1>
      <p className="font-mono text-muted text-sm uppercase tracking-widest">
        {HOME.heroSubhead}
      </p>
      <span className="mt-4 font-mono text-xs text-border border border-border rounded px-3 py-1">
        Step 2 incoming — WebGL hero scene
      </span>
    </main>
  )
}

import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 pt-nav">
      <span className="font-mono text-7xl font-bold text-aiml/20">404</span>
      <h1 className="font-display text-3xl font-bold">Signal lost.</h1>
      <p className="text-muted">This node doesn't exist in the grid.</p>
      <Link to="/" className="btn-magnetic text-aiml border-aiml/40 hover:bg-aiml/10 mt-4">
        Return home
      </Link>
    </main>
  )
}

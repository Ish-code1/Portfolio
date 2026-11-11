import { Suspense } from 'react'

/**
 * LazyLoader — Suspense wrapper for lazy-loaded routes and 3-D scenes.
 * Shows a minimal spinner; swapped for a skeleton in later steps.
 */
export default function LazyLoader({ children, fallback }) {
  return (
    <Suspense
      fallback={
        fallback ?? (
          <div className="flex h-[60vh] items-center justify-center">
            <span className="sr-only">Loading…</span>
            <div
              aria-hidden="true"
              className="h-8 w-8 rounded-full border-2 border-aiml/30 border-t-aiml animate-spin"
            />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  )
}

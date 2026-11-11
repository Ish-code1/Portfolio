import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useLenis } from './hooks/useLenis'
import { IDENTITY } from './content'
import Nav from './components/Nav'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import PageTransition from './components/PageTransition'
import LazyLoader from './components/LazyLoader'
import EasterEgg from './components/EasterEgg'

// ── Lazy page imports ──────────────────────────────────────────────
const Home          = lazy(() => import('./pages/Home'))
const AiMl          = lazy(() => import('./pages/AiMl'))
const GenAi         = lazy(() => import('./pages/GenAi'))
const Mlops         = lazy(() => import('./pages/Mlops'))
const Software      = lazy(() => import('./pages/Software'))
const Communication = lazy(() => import('./pages/Communication'))
const Projects      = lazy(() => import('./pages/Projects'))
const Contact       = lazy(() => import('./pages/Contact'))
const NotFound      = lazy(() => import('./pages/NotFound'))

export default function App() {
  useLenis()
  const location = useLocation()

  useEffect(() => {
    document.title = `${IDENTITY.fullName} — Neural Control Room`
  }, [])

  return (
    <>
      {/* Global UI chrome */}
      <CustomCursor />
      <Nav />

      {/* Page content */}
      <PageTransition key={location.pathname}>
        <LazyLoader>
          <Routes location={location}>
            <Route path="/"             element={<Home />} />
            <Route path="/ai-ml"        element={<AiMl />} />
            <Route path="/genai"        element={<GenAi />} />
            <Route path="/mlops"        element={<Mlops />} />
            <Route path="/software"     element={<Software />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/projects"     element={<Projects />} />
            <Route path="/contact"      element={<Contact />} />
            <Route path="*"             element={<Navigate to="/" replace />} />
          </Routes>
        </LazyLoader>
      </PageTransition>

      <Footer />
      <EasterEgg />
    </>
  )
}

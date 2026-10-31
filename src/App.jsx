import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import AmbientBackground from './components/AmbientBackground'
import Home from './pages/Home'
import About from './pages/About'
import { useReducedMotion } from './hooks/useReducedMotion'
import { ScrollTrigger } from './lib/gsap'

function getRoute() {
  const hash = window.location.hash.replace(/^#/, '')
  return hash || '/'
}

function useHashRoute() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return route
}

export default function App() {
  const route = useHashRoute()
  const reduced = useReducedMotion()
  const view = route === '/about' ? 'about' : 'home'

  useEffect(() => {
    document.title =
      view === 'about'
        ? 'About — WEBSTAXX'
        : 'WEBSTAXX — Web Developer, Programmer, Thinker'
    window.scrollTo({ top: 0, behavior: 'auto' })

    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => window.cancelAnimationFrame(frame)
  }, [view])

  useEffect(() => {
    if (!document.fonts?.ready) return undefined
    let cancelled = false
    document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh()
    })
    return () => {
      cancelled = true
    }
  }, [])

  const navigate = useCallback((path) => {
    if (getRoute() === path) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }
    window.location.hash = path
  }, [])

  const goToSection = useCallback(
    (id) => {
      const scroll = () => {
        const element = document.getElementById(id)
        if (!element) return
        element.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          block: 'start',
        })
      }

      if (view !== 'home') {
        navigate('/')
        window.setTimeout(scroll, 280)
      } else {
        scroll()
      }
    },
    [navigate, reduced, view],
  )

  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault()
          document.getElementById('main')?.focus()
        }}
      >
        Skip to content
      </a>

      <AmbientBackground />
      <div className="grain" aria-hidden="true" />

      <Header route={route} onNavigate={navigate} onSection={goToSection} />

      <main id="main" tabIndex={-1} className="page" key={view}>
        {view === 'about' ? (
          <About onSection={goToSection} />
        ) : (
          <Home onNavigate={navigate} onSection={goToSection} />
        )}
      </main>

      <Footer onNavigate={navigate} />
    </>
  )
}

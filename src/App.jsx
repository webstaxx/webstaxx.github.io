import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import AmbientBackground from './components/AmbientBackground'
import Home from './pages/Home'
import About from './pages/About'
import { useReducedMotion } from './hooks/useReducedMotion'
import { applySeo } from './lib/seo-client'
import { ScrollTrigger } from './lib/gsap'
import { normalizeRoute } from './seo'

function getRoute() {
  if (typeof window === 'undefined') return '/'
  return normalizeRoute(window.location.pathname)
}

function usePathRoute(initialRoute) {
  const [route, setRoute] = useState(() => initialRoute ?? getRoute())

  useEffect(() => {
    const onPopState = () => setRoute(getRoute())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  return [route, setRoute]
}

export default function App({ initialRoute }) {
  const [route, setRoute] = usePathRoute(initialRoute)
  const reduced = useReducedMotion()
  const view = route === '/about/' ? 'about' : 'home'

  useEffect(() => {
    applySeo(route)
    window.scrollTo({ top: 0, behavior: 'auto' })

    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => window.cancelAnimationFrame(frame)
  }, [route])

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

  const navigate = useCallback(
    (path) => {
      const next = normalizeRoute(path)

      if (getRoute() === next) {
        window.scrollTo({ top: 0, behavior: 'auto' })
        return
      }

      window.history.pushState({}, '', next)
      setRoute(next)
    },
    [setRoute],
  )

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

import { useEffect, useState } from 'react'
import LogoSlot from './LogoSlot'
import { CloseIcon, MenuIcon } from './Icons'

const links = [
  { label: 'Work', action: 'work', href: '/#work' },
  { label: 'About', action: 'about', href: '/about/' },
  { label: 'Contact', action: 'contact', href: '/#contact' },
]

export default function Header({ route, onNavigate, onSection }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [route])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const go = (action) => {
    setMenuOpen(false)
    if (action === 'about') {
      onNavigate('/about/')
      return
    }
    onSection(action)
  }

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="site-header__inner">
          <a
            className="brand"
            href="/"
            aria-label="WEBSTAXX home"
            onClick={(event) => {
              event.preventDefault()
              onNavigate('/')
            }}
          >
            <LogoSlot />
            <span className="brand__name">WEBSTAXX</span>
          </a>

          <nav className="site-nav" aria-label="Primary">
            {links.map((link) => (
              <a
                key={link.label}
                className={`site-nav__link ${link.action === 'about' && route === '/about/' ? 'is-active' : ''}`}
                href={link.href}
                aria-current={link.action === 'about' && route === '/about/' ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  go(link.action)
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="site-header__meta">
            <span className="status-dot" aria-hidden="true" />
            <span>Open for work</span>
          </div>

          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <nav className="mobile-menu__nav" aria-label="Mobile">
          {links.map((link, index) => (
            <a
              key={link.label}
              className="mobile-menu__link"
              href={link.href}
              tabIndex={menuOpen ? 0 : -1}
              aria-current={link.action === 'about' && route === '/about/' ? 'page' : undefined}
              onClick={(event) => {
                event.preventDefault()
                go(link.action)
              }}
            >
              <span className="mobile-menu__index">0{index + 1}</span>
              {link.label}
            </a>
          ))}
        </nav>
        <p className="mobile-menu__note">Web Developer · Programmer · Thinker</p>
      </div>
    </>
  )
}

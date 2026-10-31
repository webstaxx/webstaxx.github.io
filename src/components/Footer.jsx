import LogoSlot from './LogoSlot'
import { ArrowUp } from './Icons'

export default function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="section-shell site-footer__inner">
        <a
          className="site-footer__brand"
          href="/"
          aria-label="WEBSTAXX home"
          onClick={(event) => {
            event.preventDefault()
            onNavigate('/')
          }}
        >
          <LogoSlot />
          <span>WEBSTAXX</span>
        </a>

        <p className="site-footer__line">Web Developer · Programmer · Thinker</p>

        <button
          type="button"
          className="site-footer__top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to top
          <ArrowUp size={15} />
        </button>
      </div>
      <div className="section-shell site-footer__meta">
        <span>© 2026 WEBSTAXX</span>
        <span>Made with code & curiosity</span>
      </div>
    </footer>
  )
}

import { ArrowUpRight } from '../components/Icons'
import '../styles/music.css'

export default function Music({ onNavigate }) {
  return (
    <div className="music-page">
      <section className="music-page__hero">
        <div className="section-shell">
          <p className="eyebrow">
            <span>Music</span>
            Sound & structure
          </p>
          <h1 className="display display--page">
            The music <em>page.</em>
          </h1>
          <p className="lede">
            A place for the sounds I make. I am building this page now.
          </p>
          <a
            className="music-page__back"
            href="/"
            onClick={(event) => {
              if (!onNavigate) return
              event.preventDefault()
              onNavigate('/')
            }}
          >
            Back to the portfolio
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
    </div>
  )
}

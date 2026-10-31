import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { ArrowUpRight } from '../components/Icons'

const entries = [
  {
    index: '01',
    title: 'The short version',
    body: "I'm a self-taught web developer and programmer. I like building things that feel calm, fast, and considered — then taking them apart to understand why.",
  },
  {
    index: '02',
    title: 'How I work',
    body: 'Start with the structure. Remove what is not doing a job. Add motion only when it clarifies something. Test on the smallest screen first.',
  },
  {
    index: '03',
    title: 'Currently',
    body: 'Studying, building professional systems, and spending the rest of the time on physics, astronomy, technology, and music.',
  },
]

export default function About({ onSection }) {
  const rootRef = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return undefined

    const ctx = gsap.context(() => {
      gsap.from('.about-page__hero > *', {
        y: 34,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
      })

      gsap.from('.about-entry', {
        y: 36,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-page__entries',
          start: 'top 78%',
        },
      })

      gsap.fromTo(
        '.about-page__rail-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.about-page__body',
            start: 'top 70%',
            end: 'bottom 70%',
            scrub: 1,
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [reduced])

  return (
    <div ref={rootRef} className="about-page">
      <section className="about-page__hero">
        <div className="section-shell">
          <p className="eyebrow">
            <span>About</span>
            The longer version
          </p>
          <h1 className="display display--page">
            A little
            <br />
            {' '}
            <em>context.</em>
          </h1>
          <p className="lede about-page__intro">
            I make websites and small systems. Most of the work happens between the first
            sketch and the last removed line.
          </p>
        </div>
      </section>

      <section className="about-page__body">
        <div className="section-shell about-page__body-grid">
          <div className="about-page__rail" aria-hidden="true">
            <span className="about-page__rail-line" />
            <span className="about-page__rail-fill" />
          </div>

          <div className="about-page__entries">
            {entries.map((entry) => (
              <article className="about-entry" key={entry.title}>
                <span className="about-entry__index">{entry.index}</span>
                <div>
                  <h2>{entry.title}</h2>
                  <p>{entry.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-page__end">
        <div className="section-shell about-page__end-inner">
          <p className="eyebrow">
            <span>Next</span>
            See the work
          </p>
          <h2 className="display">
            Enough about me.
            <br />
            {' '}
            <em>Let's look at the work.</em>
          </h2>
          <button type="button" className="text-link" onClick={() => onSection('work')}>
            Selected work
            <ArrowUpRight size={16} />
          </button>
        </div>
      </section>
    </div>
  )
}

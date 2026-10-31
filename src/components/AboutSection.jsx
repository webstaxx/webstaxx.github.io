import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { ArrowUpRight } from './Icons'
import RippleCanvas from './RippleCanvas'

export default function AboutSection({ onNavigate }) {
  const rootRef = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const ctx = gsap.context(() => {
      if (reduced) return

      gsap.from('.about__copy > *', {
        y: 38,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: root,
          start: 'top 72%',
        },
      })

      gsap.fromTo(
        '.ripple-frame',
        { y: 70, scale: 0.95, opacity: 0.45 },
        {
          y: -45,
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={rootRef} id="about" className="about section">
      <div className="section-shell about__grid">
        <div className="about__copy">
          <p className="eyebrow">
            <span>01</span>
            About
          </p>
          <h2 className="display">
            Curious by default.
            <br />
            {' '}
            <em>Precise by practice.</em>
          </h2>
          <p className="lede">
            I build clean, considered digital experiences at the intersection of code and
            curiosity.
          </p>
          <p className="body-copy">
            A self-taught programmer and web developer, studying while shipping professional
            systems. I care about the small decisions that make an interface feel inevitable.
          </p>
          <a
            className="text-link"
            href="#/about"
            onClick={(event) => {
              event.preventDefault()
              onNavigate('/about')
            }}
          >
            The longer version
            <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="about__visual">
          <div className="ripple-frame">
            <RippleCanvas />
            <span className="ripple-frame__hint">Move / click</span>
          </div>
          <p className="visual-caption">Interference, in motion.</p>
        </div>
      </div>
    </section>
  )
}

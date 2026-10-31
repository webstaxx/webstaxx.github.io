import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import WireframeTorus from './WireframeTorus'

const technologies = [
  { name: 'HTML', role: 'Structure' },
  { name: 'CSS', role: 'Interface' },
  { name: 'JavaScript', role: 'Behaviour' },
  { name: 'Python', role: 'Systems' },
  { name: 'Java', role: 'Foundations' },
]

export default function TechSection() {
  const rootRef = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const ctx = gsap.context(() => {
      if (reduced) return

      gsap.from('.stack__copy > *', {
        y: 34,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: root,
          start: 'top 72%',
        },
      })

      gsap.from('.tech-list li', {
        x: 24,
        opacity: 0,
        stagger: 0.07,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.tech-list',
          start: 'top 82%',
        },
      })

      gsap.fromTo(
        '.stack__visual',
        { scale: 0.92, opacity: 0.35 },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={rootRef} id="stack" className="stack section" aria-labelledby="stack-title">
      <div className="section-shell stack__grid">
        <div className="stack__copy">
          <p className="eyebrow">
            <span>03</span>
            Technologies
          </p>
          <h2 id="stack-title" className="display">
            Tools, not
            <br />
            {' '}
            <em>trophies.</em>
          </h2>
          <p className="body-copy">
            A small, deliberate toolkit. Chosen for what it lets me build, not for the label it
            carries.
          </p>
          <ol className="tech-list">
            {technologies.map((technology, index) => (
              <li key={technology.name}>
                <span className="tech-list__index">{String(index + 1).padStart(2, '0')}</span>
                <span className="tech-list__name">{technology.name}</span>
                <span className="tech-list__role">{technology.role}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="stack__visual">
          <div className="torus-frame">
            <WireframeTorus />
            <span className="torus-frame__label">ROTATING FRAME / 03</span>
          </div>
        </div>
      </div>
    </section>
  )
}

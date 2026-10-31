import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import LiquidBlob from './LiquidBlob'

const interests = [
  { name: 'Physics', note: 'The rules underneath everything.' },
  { name: 'Astronomy', note: 'The scale above everything.' },
  { name: 'Technology', note: 'The tools in between.' },
  { name: 'Music', note: 'The pattern you can feel.' },
]

export default function InterestsSection() {
  const rootRef = useRef(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return undefined

    const ctx = gsap.context(() => {
      const update = (progress) => {
        const next = Math.min(interests.length - 1, Math.floor(progress * interests.length))
        if (next !== activeRef.current) {
          activeRef.current = next
          setActive(next)
        }
      }

      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => update(self.progress),
        onRefresh: (self) => update(self.progress),
      })
    }, root)

    return () => ctx.revert()
  }, [reduced])

  if (reduced) {
    return (
      <section id="interests" className="interests interests--static section" aria-labelledby="interests-title">
        <div className="section-shell">
          <p className="eyebrow">
            <span>04</span>
            Interests
          </p>
          <h2 id="interests-title" className="display">
            Off-screen
            <br />
            {' '}
            <em>curiosities.</em>
          </h2>
          <div className="interests__static-grid">
            <div className="interests__static-visual">
              <LiquidBlob active={0} />
            </div>
            <ul className="interest-static-list">
              {interests.map((interest, index) => (
                <li key={interest.name}>
                  <span className="interest-static-list__index">0{index + 1}</span>
                  <div>
                    <h3>{interest.name}</h3>
                    <p>{interest.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={rootRef} id="interests" className="interests section" aria-labelledby="interests-title">
      <div className="interests__sticky">
        <div className="section-shell interests__grid">
          <div className="interests__copy">
            <p className="eyebrow">
              <span>04</span>
              Interests
            </p>
            <h2 id="interests-title" className="display">
              Off-screen
              <br />
              {' '}
              <em>curiosities.</em>
            </h2>

            <div className="interest-active" key={active}>
              <span className="interest-active__index">0{active + 1}</span>
              <span className="interest-active__name">{interests[active].name}</span>
              <p className="interest-active__note">{interests[active].note}</p>
            </div>

            <ul className="interest-index">
              {interests.map((interest, index) => (
                <li className={index === active ? 'is-active' : ''} key={interest.name}>
                  <span>0{index + 1}</span>
                  {interest.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="interests__visual">
            <LiquidBlob active={active} />
            <p className="visual-caption">A shape for every curiosity.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

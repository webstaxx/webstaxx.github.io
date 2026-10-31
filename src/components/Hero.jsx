import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { ArrowDown } from './Icons'

const letters = 'webstaxx'.split('')

export default function Hero({ onSection }) {
  const rootRef = useRef(null)
  const displacementRef = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const ctx = gsap.context(() => {
      const titleLetters = root.querySelectorAll('.hero__letter')
      const tagline = root.querySelectorAll('.hero__tagline > *')
      const foot = root.querySelectorAll('.hero__foot > *')
      const displacement = displacementRef.current

      if (reduced) {
        gsap.set(titleLetters, { clearProps: 'all' })
        gsap.set([tagline, foot], { clearProps: 'all' })
        if (displacement) displacement.setAttribute('scale', '0')
        return
      }

      if (displacement) {
        gsap.fromTo(
          displacement,
          { attr: { scale: 70 } },
          { attr: { scale: 0 }, duration: 2.4, ease: 'power3.inOut' },
        )
      }

      const timeline = gsap.timeline({ defaults: { ease: 'expo.out' } })
      timeline
        .from(titleLetters, {
          yPercent: 118,
          opacity: 0,
          rotateX: -78,
          filter: 'blur(14px)',
          transformOrigin: '50% 100%',
          stagger: 0.055,
          duration: 1.45,
          clearProps: 'filter',
        })
        .from(
          tagline,
          {
            y: 24,
            opacity: 0,
            stagger: 0.12,
            duration: 0.9,
          },
          '-=0.8',
        )
        .from(
          foot,
          {
            opacity: 0,
            y: 12,
            stagger: 0.08,
            duration: 0.7,
          },
          '-=0.6',
        )
    }, root)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={rootRef} className="hero" aria-labelledby="hero-title">
      <svg className="hero__filter-defs" aria-hidden="true" focusable="false">
        <defs>
          <filter id="hero-liquid" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.028" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="hero__center">
        <h1 id="hero-title" className="hero__title" aria-label="webstaxx">
          <span className="hero__word" aria-hidden="true">
            {letters.map((letter, index) => (
              <span className="hero__letter" key={`${letter}-${index}`}>
                {letter}
              </span>
            ))}
          </span>
        </h1>
        <p className="hero__tagline">
          <span>Building for the web.</span>
          <span className="hero__tagline-accent">Exploring beyond it.</span>
        </p>
      </div>

      <div className="hero__foot">
        <p className="hero__descriptor">Web Developer · Programmer · Thinker</p>
        <button type="button" className="scroll-cue" onClick={() => onSection('about')}>
          <span>Scroll to explore</span>
          <ArrowDown size={15} />
        </button>
      </div>
    </section>
  )
}

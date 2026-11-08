import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { ArrowUpRight } from './Icons'
import MagneticFieldCanvas from './MagneticFieldCanvas'

const AXES = ['rx', 'ry', 'tx', 'ty', 'tz']

export default function AboutSection({ onNavigate }) {
  const rootRef = useRef(null)
  const tileRef = useRef(null)
  const reduced = useReducedMotion()

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const ctx = gsap.context(() => {
      if (reduced) return

      gsap.from('.about__inner', {
        y: 44,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: root,
          start: 'top 78%',
        },
      })

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
    }, root)

    return () => ctx.revert()
  }, [reduced])

  useEffect(() => {
    const root = rootRef.current
    const tile = tileRef.current
    if (!root || !tile || reduced) return undefined

    const state = { rx: 0, ry: 0, tx: 0, ty: 0, tz: 0 }
    const target = { rx: 0, ry: 0, tx: 0, ty: 0, tz: 0 }
    const pull = { dx: 0, dy: 0 }
    let frame = 0
    let previous = performance.now()
    let lastPointer = null
    let boost = 0

    const applyTarget = () => {
      const lift = 1 + boost
      target.rx = -pull.dy * 6 * lift
      target.ry = pull.dx * 6 * lift
      target.tx = pull.dx * 12 * lift
      target.ty = pull.dy * 10 * lift
      target.tz = boost * 26
    }

    const setPull = (clientX, clientY) => {
      const rect = root.getBoundingClientRect()
      const halfW = rect.width / 2
      const halfH = rect.height / 2
      pull.dx = Math.max(-1, Math.min(1, (clientX - (rect.left + halfW)) / halfW))
      pull.dy = Math.max(-1, Math.min(1, (clientY - (rect.top + halfH)) / halfH))

      const tileRect = tile.getBoundingClientRect()
      const mx = Math.max(0, Math.min(100, ((clientX - tileRect.left) / tileRect.width) * 100))
      const my = Math.max(0, Math.min(100, ((clientY - tileRect.top) / tileRect.height) * 100))
      tile.style.setProperty('--mx', `${mx}%`)
      tile.style.setProperty('--my', `${my}%`)

      applyTarget()
    }

    const onPointerMove = (event) => {
      lastPointer = { x: event.clientX, y: event.clientY }
      setPull(event.clientX, event.clientY)
    }

    const onPointerDown = (event) => {
      lastPointer = { x: event.clientX, y: event.clientY }
      boost = 1.6
      setPull(event.clientX, event.clientY)
    }

    const onPointerLeave = () => {
      lastPointer = null
      target.rx = 0
      target.ry = 0
      target.tx = 0
      target.ty = 0
      target.tz = 0
    }

    const loop = (time) => {
      const dt = Math.min(48, time - previous)
      previous = time
      boost *= Math.exp(-dt / 420)
      if (lastPointer) applyTarget()

      const ease = 1 - Math.exp(-dt / 140)
      for (const axis of AXES) {
        state[axis] += (target[axis] - state[axis]) * ease
      }

      tile.style.transform = `perspective(1400px) rotateX(${state.rx.toFixed(2)}deg) rotateY(${state.ry.toFixed(2)}deg) translate3d(${state.tx.toFixed(2)}px, ${state.ty.toFixed(2)}px, ${state.tz.toFixed(2)}px)`
      frame = window.requestAnimationFrame(loop)
    }

    root.addEventListener('pointermove', onPointerMove)
    root.addEventListener('pointerdown', onPointerDown)
    root.addEventListener('pointerleave', onPointerLeave)
    frame = window.requestAnimationFrame(loop)

    return () => {
      window.cancelAnimationFrame(frame)
      root.removeEventListener('pointermove', onPointerMove)
      root.removeEventListener('pointerdown', onPointerDown)
      root.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [reduced])

  return (
    <section ref={rootRef} id="about" className="about section" aria-labelledby="about-title">
      <MagneticFieldCanvas targetRef={rootRef} />

      <div className="section-shell about__inner">
        <div ref={tileRef} className="about__tile">
          <div className="about__copy">
            <p className="eyebrow">
              <span>01</span>
              About
            </p>
            <h2 id="about-title" className="display">
              Curious by nature.
              <br />
              {' '}
              <em>Driven to understand.</em>
            </h2>
            <p className="lede">
              I'm a student, self-taught programmer and web developer with a habit of turning
              curiosity into projects.
            </p>
            <p className="body-copy">
              I enjoy building things with code, from websites and software systems to experiments
              with programming languages. But my interests don't stop at the screen. Physics and
              astronomy keep me asking bigger questions, while music and writing give me different
              ways to explore ideas. I'm still learning, still building, and rarely short of
              something to investigate.
            </p>
            <a
              className="text-link"
              href="/about/"
              onClick={(event) => {
                event.preventDefault()
                onNavigate('/about/')
              }}
            >
              The longer version
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

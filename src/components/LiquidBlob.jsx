import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '../hooks/useReducedMotion'

const CENTER = 300
const POINTS = 10

function smoothClosedPath(points) {
  const length = points.length
  let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`

  for (let index = 0; index < length; index += 1) {
    const p0 = points[(index - 1 + length) % length]
    const p1 = points[index]
    const p2 = points[(index + 1) % length]
    const p3 = points[(index + 2) % length]

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`
  }

  return `${d} Z`
}

function makeBlob(phase, wobble, radius) {
  const points = Array.from({ length: POINTS }, (_, index) => {
    const angle = (index / POINTS) * Math.PI * 2
    const distance =
      radius +
      Math.sin(angle * 3 + phase) * wobble +
      Math.cos(angle * 5 - phase * 0.7) * wobble * 0.32
    return [CENTER + Math.cos(angle) * distance, CENTER + Math.sin(angle) * distance]
  })

  return smoothClosedPath(points)
}

const BLOB_PATHS = [
  makeBlob(0.4, 30, 208),
  makeBlob(1.9, 39, 201),
  makeBlob(3.4, 27, 214),
  makeBlob(4.8, 35, 205),
]

export default function LiquidBlob({ active }) {
  const pathRef = useRef(null)
  const groupRef = useRef(null)
  const reduced = useReducedMotion()

  useIsomorphicLayoutEffect(() => {
    const path = pathRef.current
    if (!path) return undefined

    if (reduced) {
      path.setAttribute('d', BLOB_PATHS[active])
      return undefined
    }

    const tween = gsap.to(path, {
      morphSVG: `#blob-target-${active}`,
      duration: 1.15,
      ease: 'power2.inOut',
    })

    return () => tween.kill()
  }, [active, reduced])

  useIsomorphicLayoutEffect(() => {
    if (reduced || !groupRef.current) return undefined

    const ctx = gsap.context(() => {
      gsap.to('.blob-drop--1', {
        x: 24,
        y: -18,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to('.blob-drop--2', {
        x: -20,
        y: 22,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to('.blob-drop--3', {
        x: 14,
        y: 26,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }, groupRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <svg className="liquid-blob" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="blob-fill" cx="42%" cy="36%" r="70%">
          <stop offset="0%" stopColor="#15515e" />
          <stop offset="62%" stopColor="#0a2934" />
          <stop offset="100%" stopColor="#06151e" />
        </radialGradient>
        <radialGradient id="blob-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(73, 196, 214, 0.2)" />
          <stop offset="55%" stopColor="rgba(30, 107, 122, 0.06)" />
          <stop offset="100%" stopColor="rgba(3, 10, 16, 0)" />
        </radialGradient>
        <filter id="liquid-goo" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
            result="goo"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.007 0.013"
            numOctaves="2"
            seed="8"
            result="noise"
          />
          <feDisplacementMap
            in="goo"
            in2="noise"
            scale="13"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        {BLOB_PATHS.map((path, index) => (
          <path id={`blob-target-${index}`} key={path} d={path} />
        ))}
      </defs>

      <circle cx="300" cy="300" r="282" fill="url(#blob-glow)" />
      <g ref={groupRef} filter="url(#liquid-goo)">
        <path
          ref={pathRef}
          d={BLOB_PATHS[0]}
          fill="url(#blob-fill)"
          stroke="rgba(94, 222, 238, 0.42)"
          strokeWidth="1.4"
        />
        <circle className="blob-drop blob-drop--1" cx="112" cy="214" r="18" fill="#0b303b" />
        <circle className="blob-drop blob-drop--2" cx="492" cy="382" r="14" fill="#0a2934" />
        <circle className="blob-drop blob-drop--3" cx="356" cy="512" r="10" fill="#0a2934" />
      </g>
    </svg>
  )
}

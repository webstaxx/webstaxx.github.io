import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

export default function AmbientBackground() {
  const canvasRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let stars = []

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(170, Math.max(60, Math.floor((width * height) / 15000)))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.15 + 0.25,
        alpha: Math.random() * 0.42 + 0.08,
        phase: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.12 + 0.03,
        pearl: Math.random() > 0.84,
      }))
    }

    const blob = (x, y, radius, color) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, color)
      gradient.addColorStop(0.55, color.replace(/[\d.]+\)$/, '0.08)'))
      gradient.addColorStop(1, 'rgba(3, 7, 16, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    const draw = (time = 0) => {
      ctx.clearRect(0, 0, width, height)

      const t = time * 0.000045
      const size = Math.max(width, height)

      ctx.globalCompositeOperation = 'lighter'
      blob(
        width * 0.2 + Math.sin(t) * width * 0.05,
        height * 0.3 + Math.cos(t * 0.8) * height * 0.05,
        size * 0.56,
        'rgba(10, 24, 48, 0.46)',
      )
      blob(
        width * 0.82 + Math.cos(t * 0.72) * width * 0.04,
        height * 0.66 + Math.sin(t * 0.9) * height * 0.05,
        size * 0.5,
        'rgba(7, 18, 40, 0.52)',
      )
      blob(
        width * 0.54 + Math.sin(t * 1.2) * width * 0.03,
        height * 0.1 + Math.cos(t * 0.6) * height * 0.03,
        size * 0.42,
        'rgba(24, 52, 88, 0.2)',
      )
      ctx.globalCompositeOperation = 'source-over'

      for (const star of stars) {
        const shimmer = reduced ? 1 : 0.7 + Math.sin(time * 0.0006 * star.drift * 10 + star.phase) * 0.3
        ctx.fillStyle = star.pearl
          ? `rgba(180, 208, 238, ${star.alpha * shimmer})`
          : `rgba(200, 216, 235, ${star.alpha * shimmer})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = (time) => {
      draw(time)
      frame = window.requestAnimationFrame(loop)
    }

    resize()
    if (reduced) {
      draw(0)
    } else {
      frame = window.requestAnimationFrame(loop)
    }

    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(frame)
    }
  }, [reduced])

  return <canvas ref={canvasRef} className="ambient" aria-hidden="true" />
}

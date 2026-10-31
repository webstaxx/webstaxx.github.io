import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const RINGS = 30
const SEGMENTS = 54
const MAJOR = 1.55
const MINOR = 0.52

function rotate(point, rx, ry, rz) {
  let { x, y, z } = point

  const cosX = Math.cos(rx)
  const sinX = Math.sin(rx)
  const y1 = y * cosX - z * sinX
  const z1 = y * sinX + z * cosX
  y = y1
  z = z1

  const cosY = Math.cos(ry)
  const sinY = Math.sin(ry)
  const x1 = x * cosY + z * sinY
  const z2 = -x * sinY + z * cosY
  x = x1
  z = z2

  const cosZ = Math.cos(rz)
  const sinZ = Math.sin(rz)
  const x2 = x * cosZ - y * sinZ
  const y2 = x * sinZ + y * cosZ

  return { x: x2, y: y2, z }
}

export default function WireframeTorus() {
  const canvasRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const view = { width: 0, height: 0, dpr: 1 }
    let frame = 0
    let scrollProgress = 0
    let observer

    const nodes = Array.from({ length: 5 }, (_, index) => {
      const u = (index / 5) * Math.PI * 2 + 0.4
      return {
        x: (MAJOR + MINOR * Math.cos(0.7)) * Math.cos(u),
        y: MINOR * Math.sin(0.7),
        z: (MAJOR + MINOR * Math.cos(0.7)) * Math.sin(u),
      }
    })

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      view.width = Math.max(1, rect.width)
      view.height = Math.max(1, rect.height)
      view.dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(view.width * view.dpr)
      canvas.height = Math.floor(view.height * view.dpr)
      ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0)
    }

    const updateScroll = () => {
      const rect = canvas.getBoundingClientRect()
      const raw = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      scrollProgress = Math.min(1, Math.max(0, raw))
    }

    const draw = (time = 0) => {
      const width = view.width
      const height = view.height
      const t = time * 0.001
      ctx.clearRect(0, 0, width, height)

      const rx = -0.36 + Math.sin(t * 0.23) * 0.1 + scrollProgress * 0.36
      const ry = t * 0.12 + scrollProgress * 1.9
      const rz = Math.sin(t * 0.17) * 0.08

      const projected = []

      for (let i = 0; i < RINGS; i += 1) {
        const u = (i / RINGS) * Math.PI * 2
        const ring = []
        for (let j = 0; j < SEGMENTS; j += 1) {
          const v = (j / SEGMENTS) * Math.PI * 2
          const point = {
            x: (MAJOR + MINOR * Math.cos(v)) * Math.cos(u),
            y: MINOR * Math.sin(v),
            z: (MAJOR + MINOR * Math.cos(v)) * Math.sin(u),
          }
          const rotated = rotate(point, rx, ry, rz)
          const perspective = 4.8
          const depth = rotated.z + perspective
          const scale = (Math.min(width, height) * 0.13 * perspective) / depth
          ring.push({
            x: width / 2 + rotated.x * scale,
            y: height / 2 + rotated.y * scale,
            depth: rotated.z,
          })
        }
        projected.push(ring)
      }

      const drawLine = (points, alpha) => {
        ctx.beginPath()
        points.forEach((point, index) => {
          if (index === 0) ctx.moveTo(point.x, point.y)
          else ctx.lineTo(point.x, point.y)
        })
        ctx.strokeStyle = `rgba(89, 218, 235, ${alpha})`
        ctx.lineWidth = 0.65
        ctx.stroke()
      }

      for (let i = 0; i < RINGS; i += 1) {
        const ring = projected[i]
        const avg = ring.reduce((sum, point) => sum + point.depth, 0) / ring.length
        const alpha = 0.045 + Math.max(0, (avg + MINOR + 0.4) / 2.4) * 0.2
        drawLine([...ring, ring[0]], alpha)
      }

      for (let j = 0; j < SEGMENTS; j += 2) {
        const points = projected.map((ring) => ring[j])
        const avg = points.reduce((sum, point) => sum + point.depth, 0) / points.length
        const alpha = 0.035 + Math.max(0, (avg + MINOR + 0.4) / 2.4) * 0.16
        drawLine(points, alpha)
      }

      nodes.forEach((node, index) => {
        const rotated = rotate(node, rx, ry, rz)
        const perspective = 4.8
        const depth = rotated.z + perspective
        const scale = (Math.min(width, height) * 0.13 * perspective) / depth
        const x = width / 2 + rotated.x * scale
        const y = height / 2 + rotated.y * scale
        const front = Math.max(0, (rotated.z + 0.8) / 1.6)
        const alpha = 0.35 + front * 0.55
        const radius = 2.2 + front * 1.8

        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 8)
        glow.addColorStop(0, `rgba(91, 219, 235, ${alpha * 0.32})`)
        glow.addColorStop(1, 'rgba(91, 219, 235, 0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(x, y, radius * 8, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(175, 244, 250, ${alpha})`
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(175, 244, 250, ${alpha * 0.65})`
        ctx.font = '9px "IBM Plex Mono", monospace'
        ctx.fillText(String(index + 1).padStart(2, '0'), x + 9, y - 8)
      })
    }

    const loop = (time) => {
      updateScroll()
      draw(time)
      frame = window.requestAnimationFrame(loop)
    }

    observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    if (reduced) {
      updateScroll()
      draw(0)
    } else {
      frame = window.requestAnimationFrame(loop)
    }

    window.addEventListener('resize', resize)
    return () => {
      observer?.disconnect()
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  return <canvas ref={canvasRef} className="torus-canvas" aria-hidden="true" />
}

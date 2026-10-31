import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const GRID = 64

export default function RippleCanvas() {
  const canvasRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const size = { width: 0, height: 0, dpr: 1 }
    let a = new Float32Array(GRID * GRID)
    let b = new Float32Array(GRID * GRID)
    let frame = 0
    let lastDrop = 0
    let lastPointer = null
    let observer

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      size.width = Math.max(1, rect.width)
      size.height = Math.max(1, rect.height)
      size.dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(size.width * size.dpr)
      canvas.height = Math.floor(size.height * size.dpr)
      ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0)
      draw()
    }

    const drop = (x, y, strength = 1) => {
      const gx = Math.round((x / size.width) * (GRID - 1))
      const gy = Math.round((y / size.height) * (GRID - 1))
      const radius = 2
      for (let oy = -radius; oy <= radius; oy += 1) {
        for (let ox = -radius; ox <= radius; ox += 1) {
          const px = gx + ox
          const py = gy + oy
          if (px < 1 || px >= GRID - 1 || py < 1 || py >= GRID - 1) continue
          const distance = Math.hypot(ox, oy)
          if (distance > radius) continue
          const index = py * GRID + px
          const falloff = 1 - distance / (radius + 1)
          a[index] += strength * falloff
          b[index] += strength * falloff
        }
      }
    }

    const step = () => {
      for (let y = 1; y < GRID - 1; y += 1) {
        for (let x = 1; x < GRID - 1; x += 1) {
          const index = y * GRID + x
          const next =
            (a[index - 1] + a[index + 1] + a[index - GRID] + a[index + GRID]) * 0.5 - b[index]
          b[index] = next * 0.982
        }
      }
      const swap = a
      a = b
      b = swap
    }

    const draw = () => {
      const width = size.width
      const height = size.height
      ctx.clearRect(0, 0, width, height)

      const cellW = width / (GRID - 1)
      const cellH = height / (GRID - 1)
      const amplitude = Math.min(width, height) * 0.055

      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'

      for (let y = 1; y < GRID - 1; y += 1) {
        let rowEnergy = 0
        for (let x = 1; x < GRID - 1; x += 1) {
          rowEnergy += Math.abs(a[y * GRID + x])
        }
        const energy = Math.min(1, rowEnergy / (GRID * 0.55))
        ctx.beginPath()
        for (let x = 0; x < GRID; x += 1) {
          const value = a[y * GRID + x]
          const px = x * cellW
          const py = y * cellH + value * amplitude
          if (x === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.strokeStyle = `rgba(91, 219, 235, ${0.07 + energy * 0.46})`
        ctx.lineWidth = 0.65 + energy * 0.45
        ctx.stroke()
      }

      const glow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.48,
        0,
        width * 0.5,
        height * 0.48,
        width * 0.52,
      )
      glow.addColorStop(0, 'rgba(40, 140, 155, 0.1)')
      glow.addColorStop(1, 'rgba(4, 10, 18, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)
    }

    const loop = (time) => {
      step()
      if (time - lastDrop > 2600) {
        lastDrop = time
        drop(
          size.width * (0.25 + Math.random() * 0.5),
          size.height * (0.25 + Math.random() * 0.5),
          0.85,
        )
      }
      draw()
      frame = window.requestAnimationFrame(loop)
    }

    const onPointerMove = (event) => {
      if (reduced) return
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      if (!lastPointer || Math.hypot(x - lastPointer.x, y - lastPointer.y) > 8) {
        drop(x, y, 0.38)
        lastPointer = { x, y }
      }
    }

    const onPointerLeave = () => {
      lastPointer = null
    }

    const onClick = (event) => {
      if (reduced) return
      const rect = canvas.getBoundingClientRect()
      drop(event.clientX - rect.left, event.clientY - rect.top, 1.5)
    }

    observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    if (reduced) {
      drop(size.width * 0.36, size.height * 0.42, 1.6)
      drop(size.width * 0.62, size.height * 0.57, 1.1)
      for (let i = 0; i < 110; i += 1) step()
      draw()
    } else {
      canvas.addEventListener('pointermove', onPointerMove)
      canvas.addEventListener('pointerleave', onPointerLeave)
      canvas.addEventListener('click', onClick)
      frame = window.requestAnimationFrame(loop)
    }

    return () => {
      observer?.disconnect()
      window.cancelAnimationFrame(frame)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('click', onClick)
    }
  }, [reduced])

  return <canvas ref={canvasRef} className="ripple-canvas" aria-hidden="true" />
}

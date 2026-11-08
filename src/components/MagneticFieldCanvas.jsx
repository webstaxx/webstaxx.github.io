import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const TAU = Math.PI * 2
const LINES = 20

export default function MagneticFieldCanvas({ targetRef }) {
  const canvasRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const target = targetRef?.current ?? canvas?.parentElement
    if (!canvas || !target) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const size = { width: 0, height: 0, dpr: 1 }
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false }
    let axis = -0.5
    let axisTarget = -0.5
    let energy = 0.2
    let energyTarget = 0.2
    let flash = 0
    let frame = 0
    let previous = 0
    let observer

    const defaultPointer = () => {
      pointer.tx = size.width * 0.64
      pointer.ty = size.height * 0.4
      if (!pointer.active) {
        pointer.x = pointer.tx
        pointer.y = pointer.ty
      }
    }

    const draw = (time) => {
      const width = size.width
      const height = size.height
      ctx.clearRect(0, 0, width, height)
      if (width < 2 || height < 2) return

      const baseX = width * 0.5
      const baseY = height * 0.52
      const cx = baseX + (pointer.x - baseX) * 0.08
      const cy = baseY + (pointer.y - baseY) * 0.08
      const cosA = Math.cos(axis)
      const sinA = Math.sin(axis)
      const maxR = Math.hypot(width, height) * 0.64
      const drift = time * 0.00025

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.52)
      glow.addColorStop(0, `rgba(91, 219, 235, ${0.06 + energy * 0.1})`)
      glow.addColorStop(0.42, `rgba(43, 127, 140, ${0.03 + energy * 0.05})`)
      glow.addColorStop(1, 'rgba(4, 10, 18, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      for (let i = 0; i < LINES; i += 1) {
        const norm = i / (LINES - 1)
        const length = maxR * (0.12 + 0.88 * Math.pow(norm, 1.15)) * (1 + energy * 0.06)
        const wobble = 0.035 + energy * 0.02
        const alpha = 0.05 + energy * 0.14 + norm * 0.06
        const steps = 96

        ctx.beginPath()
        for (let s = 0; s <= steps; s += 1) {
          const theta = 0.035 + (Math.PI - 0.07) * (s / steps)
          const radius =
            length *
            Math.sin(theta) ** 2 *
            (1 + Math.sin(theta * 5 + drift * 6 + i * 0.8) * wobble)
          const u = radius * Math.cos(theta)
          const v = radius * Math.sin(theta)
          const x = cx + u * cosA - v * sinA
          const y = cy + u * sinA + v * cosA
          if (s === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }

        ctx.strokeStyle = `rgba(91, 219, 235, ${alpha})`
        ctx.lineWidth = 0.6 + energy * 0.5 + norm * 0.25
        ctx.stroke()
      }

      ctx.beginPath()
      ctx.arc(cx, cy, 1.6 + energy * 1.8, 0, TAU)
      ctx.fillStyle = `rgba(214, 244, 247, ${0.22 + energy * 0.4})`
      ctx.fill()
    }

    const update = (time) => {
      const dt = Math.min(48, time - previous)
      previous = time
      const ease = 1 - Math.exp(-dt / 150)

      pointer.x += (pointer.tx - pointer.x) * ease
      pointer.y += (pointer.ty - pointer.y) * ease

      flash *= Math.exp(-dt / 190)
      energyTarget = (pointer.active ? 0.4 : 0.24) + flash * 0.9
      energy += (energyTarget - energy) * (1 - Math.exp(-dt / 220))

      if (pointer.active) {
        axisTarget = Math.atan2(
          pointer.y - size.height * 0.52,
          pointer.x - size.width * 0.5,
        )
      }
      axis += (axisTarget - axis) * (1 - Math.exp(-dt / 260))
    }

    const loop = (time) => {
      update(time)
      draw(time)
      frame = window.requestAnimationFrame(loop)
    }

    const pointFromEvent = (event) => {
      const rect = canvas.getBoundingClientRect()
      pointer.tx = event.clientX - rect.left
      pointer.ty = event.clientY - rect.top
      pointer.active = true
    }

    const onPointerMove = (event) => {
      pointFromEvent(event)
    }

    const onPointerDown = (event) => {
      pointFromEvent(event)
      flash = 1
    }

    const onPointerLeave = () => {
      pointer.active = false
      defaultPointer()
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      size.width = Math.max(1, rect.width)
      size.height = Math.max(1, rect.height)
      size.dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(size.width * size.dpr)
      canvas.height = Math.floor(size.height * size.dpr)
      ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0)
      defaultPointer()
      draw(performance.now())
    }

    observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    if (reduced) {
      axis = -0.5
      energy = 0.26
      draw(performance.now())
    } else {
      previous = performance.now()
      target.addEventListener('pointermove', onPointerMove)
      target.addEventListener('pointerdown', onPointerDown)
      target.addEventListener('pointerleave', onPointerLeave)
      frame = window.requestAnimationFrame(loop)
    }

    return () => {
      observer?.disconnect()
      window.cancelAnimationFrame(frame)
      target.removeEventListener('pointermove', onPointerMove)
      target.removeEventListener('pointerdown', onPointerDown)
      target.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [reduced, targetRef])

  return <canvas ref={canvasRef} className="about__field" aria-hidden="true" />
}

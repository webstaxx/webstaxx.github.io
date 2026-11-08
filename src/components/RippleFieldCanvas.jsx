import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const TAU = Math.PI * 2
const SPAWN_MS = 240
const MAX_RINGS = 40
const BASE_SPEED = 118
const MAX_RADIUS = 0.47

export default function RippleFieldCanvas({ targetRef }) {
  const canvasRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const target = targetRef?.current ?? canvas?.parentElement
    if (!canvas || !target) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const size = { width: 0, height: 0, dpr: 1 }
    const center = { x: 0, y: 0 }
    const pointer = { tx: 0, ty: 0, active: false }
    const rings = []
    let spawnClock = 0
    let surge = 0
    let flash = 0
    let frame = 0
    let previous = 0
    let observer

    const restPoint = () => ({ x: size.width * 0.5, y: size.height * 0.5 })

    const spawnRing = (strength = 1, x = center.x, y = center.y, age = 0) => {
      if (rings.length >= MAX_RINGS) rings.shift()
      rings.push({
        x,
        y,
        age,
        strength,
        phase: Math.random() * TAU,
        wobble: 0.012 + Math.random() * 0.014,
        speed: 0.88 + Math.random() * 0.24,
        freq: 3 + Math.floor(Math.random() * 3),
      })
    }

    const seed = () => {
      rings.length = 0
      const rest = restPoint()
      const maxRadius = Math.hypot(size.width, size.height) * MAX_RADIUS
      const span = maxRadius / (BASE_SPEED * 0.9)
      for (let i = 0; i < 8; i += 1) {
        spawnRing(0.85, rest.x, rest.y, (i / 8) * span)
      }
    }

    const drawRing = (ring, time, maxRadius) => {
      const radius = ring.age * BASE_SPEED * ring.speed
      if (radius < 1) return

      const spread = Math.min(1, radius / maxRadius)
      const fadeIn = Math.min(1, ring.age / 0.24)
      const fadeOut = Math.pow(1 - spread, 0.75)
      const alpha = ring.strength * fadeIn * fadeOut * (0.15 + surge * 0.18)
      if (alpha < 0.002) return

      const amp = ring.wobble * (1 + surge * 0.85)
      const steps = 128

      ctx.beginPath()
      for (let s = 0; s <= steps; s += 1) {
        const a = (s / steps) * TAU
        const wobble =
          Math.sin(a * ring.freq + ring.phase + time * 0.00055) * amp +
          Math.sin(a * (ring.freq + 2) - ring.phase * 0.6 + time * 0.00085) * amp * 0.45
        const r = radius * (1 + wobble)
        const x = ring.x + Math.cos(a) * r
        const y = ring.y + Math.sin(a) * r
        if (s === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()

      ctx.strokeStyle = `rgba(91, 219, 235, ${alpha})`
      ctx.lineWidth = (0.7 + surge * 0.85) * (0.7 + ring.strength * 0.5)
      ctx.stroke()

      if (ring.strength > 0.9 || surge > 0.3) {
        ctx.strokeStyle = `rgba(214, 244, 247, ${alpha * 0.35})`
        ctx.lineWidth = Math.max(0.4, (0.35 + surge * 0.5) * ring.strength)
        ctx.stroke()
      }
    }

    const draw = (time) => {
      const { width, height } = size
      ctx.clearRect(0, 0, width, height)
      if (width < 2 || height < 2) return

      const glowRadius = Math.hypot(width, height) * 0.34
      const glowAlpha = 0.065 + surge * 0.09 + flash * 0.05
      const glow = ctx.createRadialGradient(
        center.x,
        center.y,
        0,
        center.x,
        center.y,
        glowRadius,
      )
      glow.addColorStop(0, `rgba(91, 219, 235, ${glowAlpha})`)
      glow.addColorStop(0.45, `rgba(43, 127, 140, ${glowAlpha * 0.5})`)
      glow.addColorStop(1, 'rgba(4, 10, 18, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)

      ctx.globalCompositeOperation = 'lighter'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      const maxRadius = Math.hypot(width, height) * MAX_RADIUS
      for (const ring of rings) drawRing(ring, time, maxRadius)
      ctx.globalCompositeOperation = 'source-over'

      const dotRadius = 1.5 + surge * 2.2 + flash * 1.6
      ctx.beginPath()
      ctx.arc(center.x, center.y, dotRadius, 0, TAU)
      ctx.fillStyle = `rgba(214, 244, 247, ${0.19 + surge * 0.28 + flash * 0.2})`
      ctx.fill()
    }

    const drawStatic = () => {
      const { width, height } = size
      ctx.clearRect(0, 0, width, height)
      if (width < 2 || height < 2) return

      const rest = restPoint()
      const base = Math.min(width, height)
      const radii = [0.16, 0.26, 0.36, 0.46, 0.56].map((n) => n * base)

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (let i = 0; i < radii.length; i += 1) {
        const radius = radii[i]
        const alpha = 0.14 * (1 - i / (radii.length + 1))
        ctx.beginPath()
        const steps = 128
        for (let s = 0; s <= steps; s += 1) {
          const a = (s / steps) * TAU
          const wobble =
            Math.sin(a * 3 + i * 1.7) * 0.02 + Math.sin(a * 5 - i * 0.9) * 0.008
          const r = radius * (1 + wobble)
          const x = rest.x + Math.cos(a) * r
          const y = rest.y + Math.sin(a) * r
          if (s === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.strokeStyle = `rgba(91, 219, 235, ${alpha})`
        ctx.lineWidth = 0.9
        ctx.stroke()
      }
    }

    const update = (time) => {
      const dt = Math.min(48, time - previous)
      previous = time
      const seconds = dt / 1000

      const ease = 1 - Math.exp(-dt / 280)
      center.x += (pointer.tx - center.x) * ease
      center.y += (pointer.ty - center.y) * ease

      surge *= Math.exp(-dt / 1100)
      flash *= Math.exp(-dt / 240)

      spawnClock += dt
      const interval = SPAWN_MS / (1 + surge * 1.4)
      while (spawnClock >= interval) {
        spawnClock -= interval
        spawnRing(0.85 + surge * 0.7)
      }

      const maxRadius = Math.hypot(size.width, size.height) * MAX_RADIUS
      for (let i = rings.length - 1; i >= 0; i -= 1) {
        rings[i].age += seconds * (1 + surge * 1.5)
        if (rings[i].age * BASE_SPEED * rings[i].speed >= maxRadius) rings.splice(i, 1)
      }
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
      surge = Math.min(1.6, surge + 1.15)
      flash = 1
      spawnRing(1.5)
      spawnRing(1.15)
      spawnRing(0.85)
    }

    const onPointerLeave = () => {
      const rest = restPoint()
      pointer.tx = rest.x
      pointer.ty = rest.y
      pointer.active = false
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      size.width = Math.max(1, rect.width)
      size.height = Math.max(1, rect.height)
      size.dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(size.width * size.dpr)
      canvas.height = Math.floor(size.height * size.dpr)
      ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0)

      const rest = restPoint()
      center.x = rest.x
      center.y = rest.y
      pointer.tx = rest.x
      pointer.ty = rest.y
      pointer.active = false
      spawnClock = 0
      surge = 0
      flash = 0

      if (reduced) {
        drawStatic()
      } else {
        seed()
        draw(performance.now())
      }
    }

    observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    if (!reduced) {
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

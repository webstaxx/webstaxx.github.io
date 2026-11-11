import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '../hooks/useReducedMotion'
import InterestArtwork from './InterestArtwork'
import { ArrowUpRight } from './Icons'
import { interests } from '../data/site.js'
// To swap the music: replace src/assets/interests-loop.wav (same name). Or change this import.
import loopUrl from '../assets/interests-loop.wav'
import '../styles/interests.css'

const MUSIC_INDEX = 2
const SCENES = [
  { key: 'prism', accent: '#7fe9ff' },
  { key: 'galaxy', accent: '#b79bff' },
  { key: 'ribbons', accent: '#f5c451' },
]

const clamp01 = (v) => Math.min(1, Math.max(0, v))

function MusicLink({ onNavigate, className = '' }) {
  return (
    <a
      className={`ix__link ${className}`.trim()}
      href="/music/"
      onClick={(event) => {
        if (!onNavigate) return
        event.preventDefault()
        onNavigate('/music/')
      }}
    >
      Listen to my music
      <ArrowUpRight size={14} />
    </a>
  )
}

export default function InterestsSection({ onNavigate }) {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const triggerRef = useRef(null)
  const activeRef = useRef(0)
  const audioRef = useRef(null)
  const ctxRef = useRef(null)
  const analyserRef = useRef(null)
  const rafRef = useRef(0)
  const mutedRef = useRef(false)

  const [active, setActive] = useState(0)
  const [sound, setSound] = useState(false)
  const [inView, setInView] = useState(false)
  const reduced = useReducedMotion()
  const count = interests.length

  /* ---------------- scroll: pinned section → active scene + CSS vars ---------------- */
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return undefined

    const ctx = gsap.context(() => {
      const update = (progress) => {
        const idx = Math.min(count - 1, Math.floor(progress * count))
        root.style.setProperty('--p', progress.toFixed(4))
        root.style.setProperty('--sp', clamp01(progress * count - idx).toFixed(4))
        if (idx !== activeRef.current) {
          activeRef.current = idx
          setActive(idx)
        }
      }

      triggerRef.current = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => update(self.progress),
        onRefresh: (self) => {
          update(self.progress)
          setInView(self.isActive)
        },
        // Scrolled out of the pinned section (either direction): music stops.
        onToggle: (self) => {
          setInView(self.isActive)
          if (!self.isActive) setSound(false)
        },
      })
    }, root)

    return () => {
      triggerRef.current = null
      ctx.revert()
    }
  }, [reduced, count])

  /* ---------------- audio: starts with the Music scene, mute persists ---------------- */
  const stopLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
    stageRef.current?.style.setProperty('--level', '0')
    rootRef.current?.style.setProperty('--level', '0')
  }, [])

  const startLoop = useCallback(() => {
    const analyser = analyserRef.current
    const root = rootRef.current
    if (!analyser || !root) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    let lo = 255
    let hi = 0
    let level = 0

    const tick = () => {
      analyser.getByteFrequencyData(data)
      let sum = 0
      for (let i = 1; i < 12; i += 1) sum += data[i]
      const avg = sum / 11
      // adaptive range so a steady pad still produces a visible pulse
      hi = Math.max(avg, hi * 0.997 + avg * 0.003)
      lo = Math.min(avg, lo * 0.997 + avg * 0.003)
      const target = hi - lo < 2 ? 0.35 : clamp01((avg - lo) / (hi - lo))
      level += (target - level) * 0.22
      root.style.setProperty('--level', level.toFixed(3))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current
    const audio = new Audio(loopUrl)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0.7
    audioRef.current = audio
    try {
      const AC = window.AudioContext || window.webkitAudioContext
      const ctx = new AC()
      const source = ctx.createMediaElementSource(audio)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      source.connect(analyser)
      analyser.connect(ctx.destination)
      ctxRef.current = ctx
      analyserRef.current = analyser
    } catch {
      /* analyser unavailable: audio still plays, ribbons keep their idle pulse */
    }
    return audio
  }, [])

  const startSound = useCallback(() => {
    const audio = ensureAudio()
    ctxRef.current?.resume?.()
    audio
      .play()
      .then(() => setSound(true))
      .catch(() => setSound(false))
  }, [ensureAudio])

  const toggleSound = useCallback(() => {
    if (sound) {
      mutedRef.current = true
      setSound(false)
      return
    }
    mutedRef.current = false
    startSound()
  }, [sound, startSound])

  useEffect(() => {
    if (!inView || active !== MUSIC_INDEX) {
      setSound(false)
      return
    }
    if (!mutedRef.current) startSound()
  }, [active, inView, startSound])

  useEffect(() => {
    if (sound && active !== MUSIC_INDEX) {
      setSound(false)
      return
    }
    if (sound) {
      startLoop()
    } else {
      audioRef.current?.pause()
      stopLoop()
    }
  }, [sound, active, startLoop, stopLoop])

  // Tab hidden → pause.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) setSound(false)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current)
      audioRef.current?.pause()
      audioRef.current = null
      ctxRef.current?.close?.()
      ctxRef.current = null
    },
    [],
  )

  /* ---------------- click a tab → scroll to that scene ---------------- */
  const goTo = (index) => {
    const st = triggerRef.current
    if (!st) return
    if (index === MUSIC_INDEX && !mutedRef.current && !sound) startSound()
    const y = st.start + ((index + 0.5) / count) * (st.end - st.start)
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  /* ---------------- reduced motion: static list, no audio ---------------- */
  if (reduced) {
    return (
      <section id="interests" className="ix ix--static" data-scene="prism" aria-labelledby="interests-title">
        <div className="ix__grid" style={{ display: 'block', height: 'auto', padding: 0 }}>
          <p className="eyebrow">
            <span>04</span>
            Interests
          </p>
          <h2 id="interests-title" className="ix__title">
            Beyond the <em>Screen.</em>
          </h2>
          <ul className="ix__static-list">
            {interests.map((interest, index) => (
              <li key={interest.name} className="ix__static-item" data-scene={SCENES[index].key}>
                <InterestArtwork active={index} single />
                <div>
                  <div className="ix__name-row">
                    <span className="ix__num" style={{ color: SCENES[index].accent }}>0{index + 1}</span>
                    <h3 className="ix__name">{interest.name}</h3>
                  </div>
                  <p className="ix__note">{interest.note}</p>
                  {index === MUSIC_INDEX && <MusicLink onNavigate={onNavigate} />}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }

  const scene = SCENES[active]
  const relation = (i) => (i === active ? 'is-current' : (i - active + count) % count === 1 ? 'is-next' : 'is-prev')

  return (
    <section
      ref={rootRef}
      id="interests"
      className={`ix${sound ? ' ix--live' : ''}`}
      data-scene={scene.key}
      aria-labelledby="interests-title"
    >
      <div className="ix__sticky">
        <div className="ix__glow" aria-hidden="true" />
        <div className="ix__glow ix__glow--deep" aria-hidden="true" />

        <div className="ix__grid">
          <header className="ix__head">
            <p className="eyebrow">
              <span>04</span>
              Interests
            </p>
            <h2 id="interests-title" className="ix__title">
              Beyond
              <br />
              the <em>Screen.</em>
            </h2>
          </header>

          <div className="ix__stage" ref={stageRef}>
            <InterestArtwork active={active} />
          </div>

          <div className="ix__info">
            <div className="ix__texts" aria-live="polite">
              {interests.map((interest, i) => (
                <div className={`ix__text ${relation(i)}`} key={interest.name} aria-hidden={i !== active}>
                  <div className="ix__name-row">
                    <span className="ix__num" style={{ color: SCENES[i].accent }}>0{i + 1}</span>
                    <h3 className="ix__name">{interest.name}</h3>
                  </div>
                  <p className="ix__note">{interest.note}</p>
                  {i === MUSIC_INDEX && <MusicLink onNavigate={onNavigate} />}
                </div>
              ))}
            </div>

            <div className="ix__controls">
              <div className="ix__tabs">
                {interests.map((interest, i) => (
                  <button
                    key={interest.name}
                    type="button"
                    className="ix__tab"
                    aria-current={i === active}
                    aria-label={`Show ${interest.name}`}
                    style={{ '--tab-accent': SCENES[i].accent }}
                    onClick={() => goTo(i)}
                  >
                    <span className="ix__rail">
                      <span
                        className="ix__fill"
                        style={{ width: i < active ? '100%' : i > active ? '0%' : 'calc(var(--sp) * 100%)' }}
                      />
                    </span>
                    <span className="ix__tab-label">{interest.name}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className={`ix__sound${active === MUSIC_INDEX ? ' is-shown' : ''}${sound ? ' is-on' : ''}`}
                aria-pressed={sound}
                aria-label={sound ? 'Mute music' : 'Play music'}
                title={sound ? 'Mute music' : 'Play music'}
                tabIndex={active === MUSIC_INDEX ? 0 : -1}
                onClick={toggleSound}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path className="ix__sound-body" d="M4 9h4l5-4v14l-5-4H4z" />
                  {sound ? (
                    <>
                      <path className="ix__sound-wave" d="M16 8.5a5 5 0 0 1 0 7" />
                      <path className="ix__sound-wave" d="M18.5 6a8.5 8.5 0 0 1 0 12" />
                    </>
                  ) : (
                    <path className="ix__sound-slash" d="M16 9l5 6M21 9l-5 6" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

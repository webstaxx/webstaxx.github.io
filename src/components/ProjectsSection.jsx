import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import { projects } from '../data/site.js'

export default function ProjectsSection() {
  const rootRef = useRef(null)

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const ctx = gsap.context(() => {
      const media = gsap.matchMedia()

      media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const track = root.querySelector('.work__track')
        const progress = root.querySelector('.work__progress-bar')
        const count = root.querySelector('.work__count')
        if (!track) return undefined

        const distance = () => Math.max(0, track.scrollWidth - root.clientWidth + 72)

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: () => `+=${distance() + window.innerHeight * 0.7}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progress) progress.style.transform = `scaleX(${self.progress})`
              if (count) {
                const active = Math.min(projects.length, Math.floor(self.progress * projects.length) + 1)
                count.textContent = String(active).padStart(2, '0')
              }
            },
          },
        })

        return () => {
          tween.scrollTrigger?.kill()
          tween.kill()
          gsap.set(track, { clearProps: 'transform' })
        }
      })

      media.add('(max-width: 899px)', () => {
        const cards = gsap.utils.toArray('.work-card')
        const tweens = cards.map((card) =>
          gsap.from(card, {
            y: 45,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
          }),
        )
        return () => tweens.forEach((tween) => tween.kill())
      })

      return () => media.revert()
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="work" className="work section" aria-labelledby="work-title">
      <div className="work__pin">
        <div className="section-shell work__top">
          <h2 id="work-title" className="eyebrow">
            <span>02</span>
            Selected work
          </h2>
          <p className="work__hint">Scroll to traverse</p>
        </div>

        <div className="work__viewport">
          <ol className="work__track">
            {projects.map((project) => (
              <li className="work-card" key={project.title}>
                <article className="work-card__inner">
                  <div className="work-card__top">
                    <span className="work-card__index">{project.index}</span>
                    <span className="work-card__year">{project.year}</span>
                  </div>
                  <div className="work-card__body">
                    <h3 className="work-card__title">{project.title}</h3>
                    <p className="work-card__subtitle">{project.subtitle}</p>
                    <p className="work-card__note">{project.note}</p>
                  </div>
                  <ul className="tag-list" aria-label={`${project.title} categories`}>
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
        </div>

        <div className="section-shell work__bottom">
          <div className="work__progress" aria-hidden="true">
            <span className="work__progress-bar" />
          </div>
          <p className="work__counter">
            <span className="work__count">01</span>
            <span>/ 04</span>
          </p>
        </div>
      </div>
    </section>
  )
}

import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { ArrowUpRight, DiscordIcon, GithubIcon, InstagramIcon, MailIcon } from './Icons'
import { socials } from '../data/site.js'

const socialIcons = {
  github: GithubIcon,
  discord: DiscordIcon,
  mail: MailIcon,
  instagram: InstagramIcon,
}

export default function ContactSection() {
  const rootRef = useRef(null)
  const reduced = useReducedMotion()

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return undefined

    const ctx = gsap.context(() => {
      gsap.from('.contact__copy > *', {
        y: 34,
        opacity: 0,
        stagger: 0.09,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: root,
          start: 'top 70%',
        },
      })

      gsap.from('.contact__link', {
        y: 18,
        opacity: 0,
        stagger: 0.06,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.contact__links',
          start: 'top 82%',
        },
      })
    }, root)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={rootRef} id="contact" className="contact section" aria-labelledby="contact-title">
      <div className="section-shell">
        <div className="contact__signal" aria-hidden="true">
          <span className="contact__signal-line" />
          <span className="contact__signal-pulse" />
        </div>

        <div className="contact__grid">
          <div className="contact__copy">
            <p className="eyebrow">
              <span>05</span>
              Contact
            </p>
            <h2 id="contact-title" className="display">
              Have something
              <br />
              {' '}
              <em>in mind?</em>
            </h2>
            <a className="contact__email" href="mailto:ngweb500@gmail.com">
              <span>ngweb500@gmail.com</span>
              <ArrowUpRight size={22} />
            </a>
            <p className="contact__note">Based on Earth, for now. Replies when the stars align.</p>
          </div>

          <div className="contact__links">
            <p className="contact__links-label">Find me elsewhere</p>
            {socials.map((social) => {
              const Icon = socialIcons[social.icon]

              return (
                <a
                  className="contact__link"
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  <span className="contact__link-icon">
                    <Icon size={17} />
                  </span>
                  <span className="contact__link-text">
                    <span>{social.label}</span>
                    <strong>{social.handle}</strong>
                  </span>
                  <ArrowUpRight size={15} />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

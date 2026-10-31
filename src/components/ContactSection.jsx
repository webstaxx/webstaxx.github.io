import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { ArrowUpRight, DiscordIcon, GithubIcon, InstagramIcon, MailIcon } from './Icons'

const socials = [
  {
    label: 'GitHub',
    handle: '@WebStacks05',
    href: 'https://github.com/WebStacks05',
    Icon: GithubIcon,
  },
  {
    label: 'Discord',
    handle: 'webstaxx',
    href: 'https://discord.com/',
    Icon: DiscordIcon,
  },
  {
    label: 'Email',
    handle: 'ngweb500@gmail.com',
    href: 'mailto:ngweb500@gmail.com',
    Icon: MailIcon,
  },
  {
    label: 'Instagram',
    handle: '@web_nexgen',
    href: 'https://www.instagram.com/web_nexgen/',
    Icon: InstagramIcon,
  },
]

export default function ContactSection() {
  const rootRef = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
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
            {socials.map(({ label, handle, href, Icon }) => (
              <a
                className="contact__link"
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
              >
                <span className="contact__link-icon">
                  <Icon size={17} />
                </span>
                <span className="contact__link-text">
                  <span>{label}</span>
                  <strong>{handle}</strong>
                </span>
                <ArrowUpRight size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

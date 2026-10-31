const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function ArrowUpRight({ size = 18, ...props }) {
  return (
    <svg {...base} width={size} height={size} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  )
}

export function ArrowDown({ size = 18, ...props }) {
  return (
    <svg {...base} width={size} height={size} {...props}>
      <path d="M12 4v16" />
      <path d="m6 14 6 6 6-6" />
    </svg>
  )
}

export function ArrowUp({ size = 18, ...props }) {
  return (
    <svg {...base} width={size} height={size} {...props}>
      <path d="M12 20V4" />
      <path d="m6 10 6-6 6 6" />
    </svg>
  )
}

export function ArrowRight({ size = 18, ...props }) {
  return (
    <svg {...base} width={size} height={size} {...props}>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </svg>
  )
}

export function GithubIcon({ size = 18, ...props }) {
  return (
    <svg {...base} width={size} height={size} {...props}>
      <path d="M9 19c-4.5 1.4-4.5-2.2-6.3-2.8" />
      <path d="M15 21v-3.2a2.8 2.8 0 0 0-.8-2.2c2.7-.3 5.5-1.3 5.5-6a4.7 4.7 0 0 0-1.3-3.2 4.4 4.4 0 0 0-.1-3.3s-1-.3-3.4 1.3a11.7 11.7 0 0 0-6.2 0C6.3 2.8 5.3 3.1 5.3 3.1a4.4 4.4 0 0 0-.1 3.3A4.7 4.7 0 0 0 3.9 9.6c0 4.7 2.8 5.7 5.5 6a2.8 2.8 0 0 0-.8 2.2V21" />
    </svg>
  )
}

export function DiscordIcon({ size = 18, ...props }) {
  return (
    <svg {...base} width={size} height={size} {...props}>
      <path d="M8.5 17.5c-3.3-1-5.2-3.5-4.7-8 .3-2.4 1.4-4 1.4-4a14 14 0 0 1 3.6-1.2l.5 1a13 13 0 0 1 5.4 0l.5-1a14 14 0 0 1 3.6 1.2s1.1 1.6 1.4 4c.5 4.5-1.4 7-4.7 8" />
      <path d="M9 14.5c-1.2 0-2.2-1.2-2.2-2.6s1-2.6 2.2-2.6 2.2 1.2 2.2 2.6-.9 2.6-2.2 2.6Z" />
      <path d="M15 14.5c-1.2 0-2.2-1.2-2.2-2.6s1-2.6 2.2-2.6 2.2 1.2 2.2 2.6-1 2.6-2.2 2.6Z" />
    </svg>
  )
}

export function MailIcon({ size = 18, ...props }) {
  return (
    <svg {...base} width={size} height={size} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

export function InstagramIcon({ size = 18, ...props }) {
  return (
    <svg {...base} width={size} height={size} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r=".6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function MenuIcon({ size = 20, ...props }) {
  return (
    <svg {...base} width={size} height={size} {...props}>
      <path d="M4 8h16M4 16h16" />
    </svg>
  )
}

export function CloseIcon({ size = 20, ...props }) {
  return (
    <svg {...base} width={size} height={size} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

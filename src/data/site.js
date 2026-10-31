export const profile = {
  name: 'WEBSTAXX',
  descriptor: 'Web Developer · Programmer · Thinker',
  tagline: 'Building for the web. Exploring beyond it.',
  email: 'ngweb500@gmail.com',
  github: 'https://github.com/WebStacks05',
  instagram: 'https://www.instagram.com/web_nexgen/',
}

export const projects = [
  {
    index: '01',
    title: 'Noelle AI',
    subtitle: 'for Theorly.edu',
    year: '2025',
    note: 'A learning companion built for a quieter, more personal way of studying.',
    tags: ['AI', 'Web', 'Product'],
  },
  {
    index: '02',
    title: 'Election Management System',
    subtitle: 'Civic infrastructure',
    year: '2024',
    note: 'A system for organising, running, and reading elections with clarity.',
    tags: ['Systems', 'Python', 'Data'],
  },
  {
    index: '03',
    title: 'Tallyne',
    subtitle: 'An experimental esoteric programming language',
    year: '2024',
    note: 'A language experiment asking what computation could look like if the grammar changed.',
    tags: ['Language', 'Parser', 'Tooling'],
  },
  {
    index: '04',
    title: 'Multiple Websites',
    subtitle: 'Freelance / independent',
    year: '2023 — now',
    note: 'A growing collection of independent builds, each shaped around its own purpose.',
    tags: ['Web', 'Design', 'Build'],
  },
]

export const technologies = [
  { name: 'HTML', role: 'Structure' },
  { name: 'CSS', role: 'Interface' },
  { name: 'JavaScript', role: 'Behaviour' },
  { name: 'Python', role: 'Systems' },
  { name: 'Java', role: 'Foundations' },
]

export const interests = [
  { name: 'Physics', note: 'The rules underneath everything.' },
  { name: 'Astronomy', note: 'The scale above everything.' },
  { name: 'Technology', note: 'The tools in between.' },
  { name: 'Music', note: 'The pattern you can feel.' },
]

export const socials = [
  {
    label: 'GitHub',
    handle: '@WebStacks05',
    href: profile.github,
    icon: 'github',
  },
  {
    label: 'Discord',
    handle: 'webstaxx',
    href: 'https://discord.com/',
    icon: 'discord',
  },
  {
    label: 'Email',
    handle: profile.email,
    href: `mailto:${profile.email}`,
    icon: 'mail',
  },
  {
    label: 'Instagram',
    handle: '@web_nexgen',
    href: profile.instagram,
    icon: 'instagram',
  },
]

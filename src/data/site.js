export const profile = {
  name: 'WEBSTAXX',
  descriptor: 'Web Developer · Programmer · Thinker',
  tagline: 'Building for the web. Exploring beyond it.',
  email: 'ngweb500@gmail.com',
  github: 'https://github.com/webstaxx',
  instagram: 'https://www.instagram.com/webstaxxx/',
}

export const projects = [
  {
    index: '01',
    title: 'Theorly',
    subtitle: 'Educational technology · Theorly.in',
    year: '2026',
    note: 'An educational platform bringing cybersecurity and technology courses to school students. Developed collaboratively, with me leading backend development and independently building Noelle, its educational AI tutor.',
    tags: ['Education', 'Backend', 'AI'],
  },
  {
    index: '02',
    title: 'Election Management System',
    subtitle: 'School election infrastructure',
    year: '2025',
    note: 'A digital election management system for school student councils, featuring an administrative panel, category management, and dedicated student and teacher portals.',
    tags: ['Systems', 'Python', 'Data'],
  },
  {
    index: '03',
    title: 'Tallyne',
    subtitle: 'Experimental esoteric programming language',
    year: '2025',
    note: 'An exploration of programming language design through unconventional syntax and a custom language interpreter. Primitive V1 completed.',
    tags: ['Language', 'Parser', 'Tooling'],
  },
  {
    index: '04',
    title: 'Independent Websites',
    subtitle: 'Freelance · Web Development',
    year: '2023 — now',
    note: 'A collection of websites and reusable templates developed through freelance work, each built around the needs and identity of its intended purpose.',
    tags: ['Web', 'Design', 'Freelance'],
  },
]

export const technologies = [
  { name: 'HTML', role: 'Markup' },
  { name: 'CSS', role: 'Styling' },
  { name: 'JavaScript', role: 'Frontend development' },
  { name: 'Python', role: 'Programming' },
  { name: 'Java', role: 'Software development' },
]

export const interests = [
  { name: 'Physics', note: 'I work to understand the Universe at its depths.' },
  { name: 'Astronomy', note: 'I look up to the Sky, and yearn for the Stars.' },
  { name: 'Music', note: 'I make music to feel the Symphonies.' },
]

export const socials = [
  {
    label: 'GitHub',
    handle: '@webstaxx',
    href: profile.github,
    icon: 'github',
  },
  {
    label: 'Discord',
    handle: 'webstacks',
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
    handle: '@webstaxxx',
    href: profile.instagram,
    icon: 'instagram',
  },
]

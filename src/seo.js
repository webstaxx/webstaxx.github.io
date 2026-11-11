import { interests, profile, projects, technologies } from './data/site.js'

export const SITE_URL = 'https://webstaxx.github.io'

export const ROUTES = ['/', '/about/', '/music/']

export function normalizeRoute(pathname = '/') {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/about') return '/about/'
  if (path === '/music') return '/music/'
  return '/'
}

const personId = `${SITE_URL}/#person`
const websiteId = `${SITE_URL}/#website`

const pageSeo = {
  '/': {
    title: 'WEBSTAXX — Web Developer, Programmer, Thinker',
    description:
      'WEBSTAXX is a self-taught web developer and programmer building clean, considered digital experiences at the intersection of code and curiosity.',
    canonical: `${SITE_URL}/`,
    ogType: 'website',
  },
  '/about/': {
    title: 'About — WEBSTAXX',
    description:
      'About WEBSTAXX — a self-taught web developer and programmer. How I work, what I am studying, and what I am building.',
    canonical: `${SITE_URL}/about/`,
    ogType: 'profile',
  },
  '/music/': {
    title: 'Music — WEBSTAXX',
    description: 'Music by WEBSTAXX — a place for the sounds I make.',
    canonical: `${SITE_URL}/music/`,
    ogType: 'website',
  },
}

export function getSeo(route) {
  const path = normalizeRoute(route)
  return {
    ...pageSeo[path],
    path,
    siteName: profile.name,
    locale: 'en_US',
  }
}

function getPerson() {
  return {
    '@type': 'Person',
    '@id': personId,
    name: profile.name,
    url: `${SITE_URL}/`,
    description: profile.tagline,
    email: profile.email,
    sameAs: [profile.github, profile.instagram],
    knowsAbout: [
      ...technologies.map((technology) => technology.name),
      ...interests.map((interest) => interest.name),
    ],
  }
}

function getWebsite() {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    url: `${SITE_URL}/`,
    name: profile.name,
    description: pageSeo['/'].description,
    inLanguage: 'en',
    publisher: { '@id': personId },
  }
}

function getProjects() {
  return projects.map((project) => ({
    '@type': 'CreativeWork',
    '@id': `${SITE_URL}/#project-${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
    name: project.title,
    description: project.note,
    keywords: project.tags.join(', '),
    creator: { '@id': personId },
    isPartOf: { '@id': websiteId },
  }))
}

export function getJsonLd(route) {
  const path = normalizeRoute(route)
  const graph = [getPerson(), getWebsite()]

  if (path === '/') {
    graph.push(...getProjects())
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

export function getSitemap() {
  const urls = ROUTES.map((route) => {
    const seo = getSeo(route)
    return [
      '  <url>',
      `    <loc>${seo.canonical}</loc>`,
      '    <changefreq>monthly</changefreq>',
      `    <priority>${route === '/' ? '1.0' : '0.8'}</priority>`,
      '  </url>',
    ].join('\n')
  }).join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n')
}

export function getRobots() {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    '# Search engines',
    'User-agent: Googlebot',
    'Allow: /',
    '',
    'User-agent: Bingbot',
    'Allow: /',
    '',
    '# AI crawlers and assistants',
    'User-agent: GPTBot',
    'Allow: /',
    '',
    'User-agent: ChatGPT-User',
    'Allow: /',
    '',
    'User-agent: OAI-SearchBot',
    'Allow: /',
    '',
    'User-agent: ClaudeBot',
    'Allow: /',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    '',
    'User-agent: Google-Extended',
    'Allow: /',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n')
}

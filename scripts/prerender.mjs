import fs from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'
import { getJsonLd, getRobots, getSeo, getSitemap, ROUTES } from '../src/seo.js'

const root = process.cwd()
const distDir = path.join(root, 'dist')
const templatePath = path.join(distDir, 'index.html')

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderHead(seo) {
  const jsonLd = JSON.stringify(getJsonLd(seo.path)).replaceAll('<', '\\u003c')

  return [
    `    <meta name="description" content="${escapeHtml(seo.description)}" />`,
    '    <meta name="robots" content="index,follow,max-image-preview:large" />',
    `    <link rel="canonical" href="${escapeHtml(seo.canonical)}" />`,
    `    <meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `    <meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    `    <meta property="og:type" content="${escapeHtml(seo.ogType)}" />`,
    `    <meta property="og:url" content="${escapeHtml(seo.canonical)}" />`,
    `    <meta property="og:site_name" content="${escapeHtml(seo.siteName)}" />`,
    `    <meta property="og:locale" content="${escapeHtml(seo.locale)}" />`,
    '    <meta name="twitter:card" content="summary" />',
    `    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `    <meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    `    <script type="application/ld+json" data-seo="true">${jsonLd}</script>`,
  ].join('\n')
}

function renderDocument(template, appHtml, seo) {
  return template
    .replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`)
    .replace(/<title>.*?<\/title>/, () => `<title>${escapeHtml(seo.title)}</title>`)
    .replace('</head>', () => `${renderHead(seo)}\n  </head>`)
}

const template = fs.readFileSync(templatePath, 'utf8')
const vite = await createServer({
  root,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
})

try {
  const { render } = await vite.ssrLoadModule('/src/entry-server.jsx')

  for (const route of ROUTES) {
    const seo = getSeo(route)
    const appHtml = render(route)
    const html = renderDocument(template, appHtml, seo)
    const routeDir = route === '/' ? '' : route.replace(/^\/|\/$/g, '')
    const outputPath = path.join(distDir, routeDir, 'index.html')

    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, html)
    console.log(`Prerendered ${route} -> ${path.relative(root, outputPath)}`)
  }

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), getSitemap())
  fs.writeFileSync(path.join(distDir, 'robots.txt'), getRobots())
  console.log('Generated dist/sitemap.xml and dist/robots.txt')
} finally {
  await vite.close()
}

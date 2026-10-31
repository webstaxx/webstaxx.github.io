import { getJsonLd, getSeo } from '../seo.js'

function upsertMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    element.setAttribute('data-seo', 'true')
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function upsertCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]')

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    element.setAttribute('data-seo', 'true')
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
}

function upsertJsonLd(data) {
  let element = document.head.querySelector('script[type="application/ld+json"][data-seo="true"]')

  if (!element) {
    element = document.createElement('script')
    element.setAttribute('type', 'application/ld+json')
    element.setAttribute('data-seo', 'true')
    document.head.appendChild(element)
  }

  element.textContent = JSON.stringify(data)
}

export function applySeo(route) {
  const seo = getSeo(route)

  document.title = seo.title
  upsertMeta('name', 'description', seo.description)
  upsertMeta('name', 'robots', 'index,follow,max-image-preview:large')
  upsertMeta('property', 'og:title', seo.title)
  upsertMeta('property', 'og:description', seo.description)
  upsertMeta('property', 'og:type', seo.ogType)
  upsertMeta('property', 'og:url', seo.canonical)
  upsertMeta('property', 'og:site_name', seo.siteName)
  upsertMeta('property', 'og:locale', seo.locale)
  upsertMeta('name', 'twitter:card', 'summary')
  upsertMeta('name', 'twitter:title', seo.title)
  upsertMeta('name', 'twitter:description', seo.description)
  upsertCanonical(seo.canonical)
  upsertJsonLd(getJsonLd(seo.path))
}

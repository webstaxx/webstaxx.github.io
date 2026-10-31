import { renderToString } from 'react-dom/server'
import App from './App'
import { normalizeRoute } from './seo.js'

export function render(url) {
  return renderToString(<App initialRoute={normalizeRoute(url)} />)
}

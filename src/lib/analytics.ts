// Lightweight, opt-in GA4 wrapper for the public site (/, /audit, /quiz).
// Does nothing — no script loads, no event is sent, no network call is made —
// unless VITE_GOOGLE_ANALYTICS_ID is set at build time (see .env.example,
// previously an unused placeholder — this is what actually wires it up). This
// exists so the landing page and quiz can actually be measured (visits, CTA
// clicks, quiz drop-off, completions) instead of guessed at; see README.

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID as string | undefined

let scriptLoaded = false

function ensureLoaded() {
  if (!MEASUREMENT_ID || scriptLoaded) return
  scriptLoaded = true
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID)
}

/** Fire a custom GA4 event. A no-op when analytics isn't configured. */
export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (!MEASUREMENT_ID) return
  ensureLoaded()
  window.gtag?.('event', name, params)
}

/** Record a virtual pageview for an SPA route change. A no-op when analytics isn't configured. */
export function trackPageview(path: string) {
  if (!MEASUREMENT_ID) return
  ensureLoaded()
  window.gtag?.('config', MEASUREMENT_ID, { page_path: path })
}

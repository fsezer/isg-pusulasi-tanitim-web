import { GA_MEASUREMENT_ID, SITE_ORIGIN } from './site-config.js'

/** Firebase GA4 (isg-pusulasi) — admin panel ile aynı measurementId */
export function initAnalytics() {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return
  if (window.__isgGaInit) return
  window.__isgGaInit = true

  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments)
  }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
    page_location: window.location.href,
    page_path: window.location.pathname,
    cookie_domain: 'isgatlasi.com',
    linker: { domains: ['isgatlasi.com', 'www.isgatlasi.com'] },
  })

  // Tanıtım sitesi stream ayırımı (Firebase konsolunda web stream eklenebilir)
  if (window.location.hostname.endsWith('isgatlasi.com')) {
    window.gtag('set', { site_origin: SITE_ORIGIN })
  }
}

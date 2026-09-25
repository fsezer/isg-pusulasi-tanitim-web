import { t, detectLocale } from './i18n.js'

export const CONSENT_KEY = 'isg_cookie_consent'

export function hasCookieConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'accepted'
  } catch {
    return false
  }
}

function markConsented() {
  document.documentElement.classList.add('has-cookie-consent')
}

function acceptConsent(banner, onAccept) {
  try {
    localStorage.setItem(CONSENT_KEY, 'accepted')
  } catch {
    /* ignore */
  }
  markConsented()
  banner?.remove()
  onAccept?.()
}

function fillBannerText(banner, locale) {
  const text = banner.querySelector('[data-cookie-text]')
  const policy = banner.querySelector('[data-cookie-policy]')
  const accept = banner.querySelector('[data-cookie-accept]')
  if (text) text.textContent = t(locale, 'cookie.text')
  if (policy) policy.textContent = t(locale, 'cookie.policy')
  if (accept) accept.textContent = t(locale, 'cookie.accept')
}

/**
 * İstiklal Yazılım kalıbı: altta şerit → Kabul Ediyorum.
 * GA / Tawk gibi 3. parti ancak kabul sonrası yüklenir.
 */
export function initCookieConsent({ onAccept } = {}) {
  if (typeof document === 'undefined') return

  if (hasCookieConsent()) {
    markConsented()
    onAccept?.()
    return
  }

  const show = () => {
    if (document.querySelector('.cookie-consent-banner')) return

    const locale = detectLocale()
    const banner = document.createElement('div')
    banner.className = 'cookie-consent-banner'
    banner.setAttribute('role', 'dialog')
    banner.setAttribute('aria-live', 'polite')
    banner.innerHTML = `
      <div class="cookie-consent-inner">
        <p class="cookie-consent-text" data-cookie-text></p>
        <div class="cookie-consent-actions">
          <a class="cookie-consent-link" href="/cerez-politikasi.html" data-cookie-policy></a>
          <button type="button" class="cookie-consent-accept" data-cookie-accept></button>
        </div>
      </div>
    `
    fillBannerText(banner, locale)
    document.body.appendChild(banner)

    banner.querySelector('[data-cookie-accept]')?.addEventListener('click', () => {
      acceptConsent(banner, onAccept)
    })

    document.addEventListener('isg:locale', (event) => {
      const next = event.detail?.locale || detectLocale()
      if (document.body.contains(banner)) fillBannerText(banner, next)
    })
  }

  window.setTimeout(show, 1000)
}

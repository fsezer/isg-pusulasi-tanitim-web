import { LOCALES } from './i18n.js'
import {
  COMPANY_NAME,
  COMPANY_URL,
  COMPANY_PHONE,
  COMPANY_PHONE_DISPLAY,
  COMPANY_ADDRESS_LINE,
  SUPPORT_EMAIL,
  SUPPORT_EMAIL_ALT,
  SITE_NAME,
} from './site-config.js'

const PAGES = [
  { id: 'home', href: '/index.html', key: 'nav.home' },
  { id: 'features', href: '/ozellikler.html', key: 'nav.features' },
  { id: 'windows', href: '/windows.html', key: 'nav.windows' },
  { id: 'mobile', href: '/mobil.html', key: 'nav.mobile' },
  { id: 'download', href: '/indir.html', key: 'nav.download' },
  { id: 'pricing', href: '/fiyatlar.html', key: 'nav.pricing' },
  { id: 'faq', href: '/sss.html', key: 'nav.faq' },
  { id: 'contact', href: '/iletisim.html', key: 'nav.contact' },
]

function langOptionsHtml() {
  return LOCALE_CODES_SAFE()
    .map(
      (code) => {
        const L = LOCALES[code]
        return `<button type="button" class="lang-option" data-set-lang="${code}" aria-label="${L.label}">
          <span class="lang-flag" aria-hidden="true">${L.flag}</span>
          <span class="lang-label">${L.label}</span>
          <span class="lang-code">${L.region}</span>
        </button>`
      },
    )
    .join('')
}

function LOCALE_CODES_SAFE() {
  return Object.keys(LOCALES)
}

function navLinks(page, className = 'nav-link') {
  return PAGES.map((p) => {
    const active = p.id === page ? ' is-active' : ''
    return `<a class="${className}${active}" href="${p.href}" data-i18n="${p.key}"></a>`
  }).join('')
}

export function mountChrome() {
  const page = document.body?.dataset?.page || 'home'
  const root = document.querySelector('[data-site-chrome]')
  if (!root) return

  root.innerHTML = `
    <div class="site-intro" data-site-intro aria-hidden="true">
      <div class="site-intro-haze" aria-hidden="true"></div>
      <div class="site-intro-stage">
        <img class="site-intro-logo" src="/img/app_logo.png" width="148" height="148" alt="" />
        <div class="site-intro-title-wrap" data-intro-title>
          <p class="site-intro-title" aria-label="İSG Atlası">
            <span data-intro-typed></span><span class="intro-caret" data-intro-caret aria-hidden="true"></span>
          </p>
          <span class="site-intro-rule" aria-hidden="true"></span>
          <p class="site-intro-eyebrow" data-intro-eyebrow></p>
        </div>
      </div>
    </div>

    <div class="nav-backdrop" data-nav-backdrop></div>

    <header class="site-header" data-site-header>
      <div class="site-header-bar">
        <a href="/index.html" class="brand-mark" aria-label="İSG Atlası">
          <img src="/img/app_logo.png" alt="" width="40" height="40" class="h-10 w-10 object-contain" />
          <span class="brand-text" data-i18n="common.brand">İSG Atlası</span>
        </a>

        <nav class="site-header-nav" data-i18n-aria="nav.menu" aria-label="Ana menü">
          ${navLinks(page)}
        </nav>

        <div class="site-header-actions">
          <a href="/basvuru.html" class="btn-amber site-header-cta" data-i18n="common.ctaApply">Üyelik Başvurusu</a>
          <button type="button" class="lang-trigger" data-lang-trigger aria-haspopup="dialog" data-i18n-aria="nav.lang">
            <span data-lang-current-flag aria-hidden="true">🇹🇷</span>
            <span data-lang-current-code>TR</span>
          </button>
          <button type="button" class="icon-btn site-header-menu-btn" data-nav-toggle aria-expanded="false" aria-controls="site-nav" data-i18n-aria="nav.menuOpen">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" stroke-width="1.5"/></svg>
          </button>
        </div>
      </div>
    </header>

    <nav id="site-nav" class="nav-drawer" data-nav-panel data-i18n-aria="nav.menu" aria-label="Ana menü">
      <div class="flex items-center justify-between">
        <span class="text-sm font-bold tracking-wide text-navy" data-i18n="nav.menu">Menü</span>
        <button type="button" class="icon-btn" data-nav-close data-i18n-aria="nav.menuClose">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.5"/></svg>
        </button>
      </div>
      <div class="nav-drawer-links">${navLinks(page)}</div>
      <a href="/basvuru.html" class="btn-amber mt-2 text-center text-sm" data-i18n="common.ctaApply">Üyelik Başvurusu</a>
    </nav>

    <div class="lang-modal" data-lang-modal hidden>
      <div class="lang-modal-card" role="dialog" aria-modal="true" aria-labelledby="lang-modal-title">
        <div class="lang-modal-head">
          <h2 id="lang-modal-title" class="lang-modal-title" data-i18n="nav.chooseLang">Dil Seçin</h2>
          <button type="button" class="icon-btn text-white" data-lang-close data-i18n-aria="nav.close" style="border-color:rgba(255,255,255,.2)">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.5"/></svg>
          </button>
        </div>
        <div class="lang-grid">${langOptionsHtml()}</div>
      </div>
    </div>
  `

  const footer = document.querySelector('[data-site-footer]')
  if (footer) {
    footer.innerHTML = `
      <div class="site-footer-inner">
        <div class="site-footer-rule" aria-hidden="true"></div>
        <div class="site-footer-grid">
          <div class="site-footer-brand">
            <a href="/index.html" class="site-footer-product" aria-label="${SITE_NAME}">
              <img src="/img/app_logo.png" alt="" width="48" height="48" class="site-footer-product-logo" loading="lazy" />
              <span class="site-footer-product-name" data-i18n="common.brand">${SITE_NAME}</span>
            </a>
            <p class="site-footer-tagline" data-i18n="footer.tag">Türkiye'nin İSG yazılımı</p>
            <p class="site-footer-blurb">Windows Agent + Android mobil — saha denetimi, şablon motoru ve bulut sync tek platformda.</p>
          </div>

          <div class="site-footer-col">
            <h3 class="site-footer-heading" data-i18n="footer.explore">Keşfet</h3>
            <div class="site-footer-links">
              <a href="/ozellikler.html" data-i18n="nav.features">Özellikler</a>
              <a href="/windows.html" data-i18n="nav.windows">Windows</a>
              <a href="/mobil.html" data-i18n="nav.mobile">Mobil</a>
              <a href="/indir.html" data-i18n="nav.download">İndir</a>
              <a href="/fiyatlar.html" data-i18n="nav.pricing">Fiyatlar</a>
              <a href="/sss.html" data-i18n="nav.faq">SSS</a>
              <a href="/basvuru.html" data-i18n="nav.apply">Başvuru</a>
              <a href="/iletisim.html" data-i18n="nav.contact">İletişim</a>
            </div>
          </div>

          <div class="site-footer-col site-footer-contact">
            <h3 class="site-footer-heading" data-i18n="nav.contact">İletişim</h3>
            <ul class="site-footer-contact-list">
              <li>
                <span class="site-footer-ico" aria-hidden="true">📍</span>
                <span>${COMPANY_ADDRESS_LINE}</span>
              </li>
              <li>
                <span class="site-footer-ico" aria-hidden="true">📞</span>
                <a href="tel:${COMPANY_PHONE}">${COMPANY_PHONE_DISPLAY}</a>
              </li>
              <li>
                <span class="site-footer-ico" aria-hidden="true">✉️</span>
                <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>
              </li>
              <li>
                <span class="site-footer-ico" aria-hidden="true">🛟</span>
                <a href="mailto:${SUPPORT_EMAIL_ALT}">${SUPPORT_EMAIL_ALT}</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="site-footer-bottom">
          <p>
            © <span data-year></span> ${SITE_NAME}
            · <a href="${COMPANY_URL}" target="_blank" rel="noopener noreferrer">${COMPANY_NAME}</a>
            · <span data-i18n="footer.rights">Tüm hakları saklıdır.</span>
          </p>
        </div>
      </div>
    `
  }
}

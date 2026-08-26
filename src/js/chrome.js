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
  WHATSAPP_URL,
  INSTAGRAM_URL,
  TWITTER_URL,
  SOCIAL_HANDLE,
} from './site-config.js'

const PAGES = [
  { id: 'home', href: '/index.html', key: 'nav.home' },
  { id: 'features', href: '/ozellikler.html', key: 'nav.features' },
  { id: 'windows', href: '/windows.html', key: 'nav.windows' },
  { id: 'mobile', href: '/mobil.html', key: 'nav.mobile' },
  { id: 'download', href: '/indir.html', key: 'nav.download' },
  { id: 'pricing', href: '/fiyatlar.html', key: 'nav.pricing' },
  { id: 'faq', href: '/sss.html', key: 'nav.faq' },
  { id: 'about', href: '/hakkimizda.html', key: 'nav.about' },
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

const SOCIAL_SVG = {
  instagram: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.75"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.75"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
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
          <a href="/basvuru.html" class="btn-buy site-header-cta" data-i18n="common.ctaApply">Satın Al</a>
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
      <a href="/basvuru.html" class="btn-buy mt-2 text-center text-sm" data-i18n="common.ctaApply">Satın Al</a>
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

    <a class="wa-fab" href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
      ${SOCIAL_SVG.whatsapp}
      <span class="wa-fab-label">WhatsApp</span>
    </a>
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
            <div class="site-footer-social" aria-label="@isgatlasi">
              <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" class="site-footer-social-chip site-footer-social-chip--ig" aria-label="Instagram ${SOCIAL_HANDLE}">
                <span class="site-footer-social-ico" aria-hidden="true">${SOCIAL_SVG.instagram}</span>
                <span class="site-footer-social-meta">
                  <span class="site-footer-social-name">Instagram</span>
                  <span class="site-footer-social-handle">${SOCIAL_HANDLE}</span>
                </span>
              </a>
              <a href="${TWITTER_URL}" target="_blank" rel="noopener noreferrer" class="site-footer-social-chip site-footer-social-chip--x" aria-label="X / Twitter ${SOCIAL_HANDLE}">
                <span class="site-footer-social-ico" aria-hidden="true">${SOCIAL_SVG.twitter}</span>
                <span class="site-footer-social-meta">
                  <span class="site-footer-social-name">X / Twitter</span>
                  <span class="site-footer-social-handle">${SOCIAL_HANDLE}</span>
                </span>
              </a>
              <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="site-footer-social-chip site-footer-social-chip--wa" aria-label="WhatsApp">
                <span class="site-footer-social-ico" aria-hidden="true">${SOCIAL_SVG.whatsapp}</span>
                <span class="site-footer-social-meta">
                  <span class="site-footer-social-name">WhatsApp</span>
                  <span class="site-footer-social-handle">${COMPANY_PHONE_DISPLAY}</span>
                </span>
              </a>
            </div>
          </div>

          <div class="site-footer-col">
            <h3 class="site-footer-heading" data-i18n="footer.explore">Keşfet</h3>
            <div class="site-footer-links">
              <a href="/ozellikler.html" data-i18n="nav.features">Özellikler</a>
              <a href="/windows.html" data-i18n="nav.windows">Windows</a>
              <a href="/mobil.html" data-i18n="nav.mobile">Mobil</a>
              <a href="/indir.html" data-i18n="nav.download">İndir</a>
              <a href="/fiyatlar.html" data-i18n="nav.pricing">Paketler</a>
              <a href="/sss.html" data-i18n="nav.faq">SSS</a>
              <a href="/hakkimizda.html" data-i18n="nav.about">Hakkımızda</a>
              <a href="/basvuru.html" data-i18n="nav.apply">Satın Al</a>
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

        <nav class="site-footer-legal" aria-label="Yasal sayfalar">
          <a href="/gizlilik.html" data-i18n="footer.legalPrivacy">Gizlilik Politikası</a>
          <a href="/teslimat-ve-iade.html" data-i18n="footer.legalReturn">İptal, İade ve Teslimat</a>
          <a href="/mesafeli-satis-sozlesmesi.html" data-i18n="footer.legalDistance">Mesafeli Satış Sözleşmesi</a>
          <a href="/cerez-politikasi.html" data-i18n="footer.legalCookies">Çerez Kullanımı</a>
          <a href="/kvkk.html" data-i18n="footer.legalKvkk">KVKK</a>
          <a href="/banka-ve-firma-bilgileri.html" data-i18n="footer.legalBank">Banka ve Firma Bilgileri</a>
        </nav>

        <div class="site-footer-bottom">
          <p class="site-footer-copy">
            © <span data-year></span>
            <a href="${COMPANY_URL}" target="_blank" rel="noopener noreferrer">${COMPANY_NAME}</a>
            · ${SITE_NAME}
            · <span data-i18n="footer.rights">Tüm hakları saklıdır.</span>
          </p>
          <img
            class="site-footer-payments"
            src="/img/payments/logo_band_white.svg"
            alt="iyzico ile Öde, Visa, Mastercard, American Express, Troy"
            width="420"
            height="40"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    `
  }
}

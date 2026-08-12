import { LOCALES } from './i18n.js'

const PAGES = [
  { id: 'home', href: '/index.html', key: 'nav.home' },
  { id: 'features', href: '/ozellikler.html', key: 'nav.features' },
  { id: 'windows', href: '/windows.html', key: 'nav.windows' },
  { id: 'mobile', href: '/mobil.html', key: 'nav.mobile' },
  { id: 'download', href: '/indir.html', key: 'nav.download' },
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
        <img class="site-intro-logo" src="/img/app_logo.png" width="96" height="96" alt="" />
        <div class="site-intro-title-wrap" data-intro-title>
          <p class="site-intro-title" aria-label="İSG Pusulası">
            <span data-intro-typed></span><span class="intro-caret" data-intro-caret aria-hidden="true"></span>
          </p>
          <span class="site-intro-rule" aria-hidden="true"></span>
        </div>
      </div>
    </div>

    <div class="nav-backdrop" data-nav-backdrop></div>

    <header class="site-header" data-site-header>
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/index.html" class="brand-mark" aria-label="İSG Pusulası">
          <img src="/img/app_logo.png" alt="" width="36" height="36" class="h-9 w-9 rounded-lg object-contain" />
          <span class="brand-text" data-i18n="common.brand">İSG Pusulası</span>
        </a>
        <div class="flex items-center gap-3">
          <nav class="hidden items-center gap-5 lg:flex" data-i18n-aria="nav.menu" aria-label="Ana menü">
            ${navLinks(page)}
          </nav>
          <button type="button" class="lang-trigger" data-lang-trigger aria-haspopup="dialog" data-i18n-aria="nav.lang">
            <span data-lang-current-flag aria-hidden="true">🇹🇷</span>
            <span data-lang-current-code>TR</span>
          </button>
          <a href="/basvuru.html" class="btn-amber hidden px-3.5 py-2 text-sm sm:inline-flex" data-i18n="common.ctaApply">Üyelik Başvurusu</a>
          <button type="button" class="icon-btn lg:hidden" data-nav-toggle aria-expanded="false" aria-controls="site-nav" data-i18n-aria="nav.menuOpen">
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
      <div class="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-8">
        <div class="flex items-start gap-4">
          <a class="footer-brand" href="https://istiklalyazilim.com" target="_blank" rel="noopener noreferrer" aria-label="İstiklal Yazılım">
            <picture>
              <source srcset="/img/istiklal.webp" type="image/webp" />
              <img src="/img/istiklal_logo.png" alt="İstiklal Yazılım" width="72" height="72" class="footer-brand-logo" />
            </picture>
          </a>
          <div>
            <a class="font-display text-lg font-bold text-navy hover:text-sky" href="https://istiklalyazilim.com" target="_blank" rel="noopener noreferrer" data-i18n="common.company">İstiklal Yazılım</a>
            <p class="mt-1 text-sm text-muted" data-i18n="footer.tag">Türkiye'nin İSG yazılımı</p>
            <p class="mt-2 text-sm text-muted">© <span data-year></span> <span data-i18n="common.brand">İSG Pusulası</span> · <span data-i18n="footer.rights">Tüm hakları saklıdır.</span></p>
            <a class="mt-2 inline-flex text-sm font-semibold text-sky hover:underline" href="https://istiklalyazilim.com" target="_blank" rel="noopener noreferrer">istiklalyazilim.com</a>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-x-10 gap-y-2 text-sm font-semibold text-muted sm:grid-cols-3">
          <a class="hover:text-navy" href="/ozellikler.html" data-i18n="nav.features">Özellikler</a>
          <a class="hover:text-navy" href="/windows.html" data-i18n="nav.windows">Windows</a>
          <a class="hover:text-navy" href="/mobil.html" data-i18n="nav.mobile">Mobil</a>
          <a class="hover:text-navy" href="/indir.html" data-i18n="nav.download">İndir</a>
          <a class="hover:text-navy" href="/sss.html" data-i18n="nav.faq">SSS</a>
          <a class="hover:text-navy" href="/basvuru.html" data-i18n="nav.apply">Başvuru</a>
          <a class="hover:text-navy" href="/iletisim.html" data-i18n="nav.contact">İletişim</a>
          <a class="hover:text-navy" href="/kvkk.html" data-i18n="footer.kvkk">KVKK Aydınlatma</a>
          <a class="hover:text-navy" href="https://istiklalyazilim.com" target="_blank" rel="noopener noreferrer" data-i18n="contact.web">Kurumsal</a>
          <a class="hover:text-navy" href="mailto:info@istiklalyazilim.com">info@istiklalyazilim.com</a>
        </div>
      </div>
    `
  }
}

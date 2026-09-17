/**
 * İSG Atlası — fiyatlandırma
 * Tek bireysel paket: Max (Pro fiyatı). Kurumsal: 5+ kullanıcı × birim fiyat.
 */

import {
  SHOW_MONTHLY_PRICE as SHOW_MONTHLY_PRICE_DEFAULT,
  COMPANY_PHONE,
  COMPANY_PHONE_DISPLAY,
  SUPPORT_EMAIL,
  API_BASE,
} from './site-config.js'

let showMonthlyPrice = SHOW_MONTHLY_PRICE_DEFAULT

const ICONS = {
  max: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="16" stroke="currentColor" stroke-width="2"/><path d="M16 24h16M24 16v16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  'ai-chat': `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H9l-4 4V6z" stroke="currentColor" stroke-width="1.75"/><path d="M8 9h8M8 12h5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  'ai-visual': `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.75"/><circle cx="9" cy="10" r="2" stroke="currentColor" stroke-width="1.5"/><path d="M21 15l-5-5-4 4-2-2-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  voice: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" stroke-width="1.75"/><path d="M6 11a6 6 0 0012 0M12 17v4M8 21h8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  windows: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.75"/><path d="M8 20h8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  mobile: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" stroke-width="1.75"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg>`,
  modules: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.75"/><rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.75"/><rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.75"/><rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.75"/></svg>`,
  backup: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M5 15v2a2 2 0 002 2h10a2 2 0 002-2v-2" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  overflow: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 9v4m0 4h.01M10.3 4.5h3.4l7.3 12.6a2 2 0 01-1.7 3H4.7a2 2 0 01-1.7-3L10.3 4.5z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/></svg>`,
  scope: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.75"/><path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
}

/** Max paket — özellik seti Max; fiyat Pro (27.000 TL KDV dahil). */
export const DEFAULT_PACKAGES = {
  max: {
    key: 'max',
    title: 'Max',
    subtitle: 'Tam erişim — Windows + Mobil',
    priceIncVat: 27000,
    priceExVat: 22500,
    monthlyIncVat: 2250,
    tag: 'Tek Paket',
    featured: true,
    accent: 'violet',
    scope: 'Tek kullanıcı — sınırsız AI, tüm modüller',
    enabled: true,
  },
  deneme: {
    key: 'deneme',
    title: 'Deneme',
    subtitle: 'Geçici ödeme testi — 10 TL',
    priceIncVat: 10,
    priceExVat: 10,
    monthlyIncVat: 10,
    tag: 'Test',
    featured: false,
    accent: 'sky',
    scope: 'Sadece iyzico test',
    enabled: false,
  },
}

/** Kurumsal birim fiyat (admin’den gelir). Min 5 kullanıcı × 14.000 TL. */
export const DEFAULT_CORPORATE = {
  unitPriceIncVat: 14000,
  unitPriceExVat: 11667,
  minSeats: 5,
}

const FEATURES = [
  {
    key: 'scope',
    label: 'Kapsam',
    icon: 'scope',
    value: 'Tam erişim — Windows Agent + Mobil (Android)',
    teaser: 'Ofis + saha tek lisans',
    body: 'Tek kullanıcı lisansı Windows Agent ve mobil uygulamayı (Android) birlikte kapsar. Aynı hesap, aynı veri, 3 PC kurulum hakkı standarttır.',
  },
  {
    key: 'ai-chat',
    label: 'AI Sohbet',
    icon: 'ai-chat',
    value: 'Sınırsız (adil kullanım)',
    teaser: '6331 mevzuatına dayalı metin asistanı',
    body: 'Mobil ve Windows’ta İSG sorularınızı doğal dilde sorarsınız; risk değerlendirme, mevzuat yorumu ve saha önerileri alırsınız. Adil kullanım kapsamında sınırsızdır.',
  },
  {
    key: 'ai-visual',
    label: 'AI Görsel Analiz',
    icon: 'ai-visual',
    value: 'Sınırsız (adil kullanım)',
    teaser: 'Saha fotoğrafından risk & KKD tespiti',
    body: 'Denetim ekranından çekilen fotoğraf yapay zekâ ile incelenir; baret, emniyet kemeri, düzensizlik gibi bulgular metne dökülür.',
  },
  {
    key: 'voice',
    label: 'Sesli Giriş (Dikte)',
    icon: 'voice',
    value: 'Var',
    teaser: 'Klavyesiz saha kaydı',
    body: 'Mobilde mikrofonla konuşarak denetim notu, bulgu ve form alanı doldurursunuz. Elleriniz doluyken bile kayıt akar.',
  },
  {
    key: 'windows',
    label: 'Windows Agent Araçları',
    icon: 'windows',
    value: 'Hepsi',
    teaser: 'Ofiste şablon, firma, evrak motoru',
    body: 'Tag’li Word/Excel şablonları, e-Devlet Excel aktarımı, toplu sertifika basımı, arşiv ve tüm profesyonel araç seti dahildir.',
  },
  {
    key: 'mobile',
    label: 'Mobil Depolama',
    icon: 'mobile',
    value: '10 GB başlangıç',
    teaser: 'Saha foto & video bulutu',
    body: 'Telefondan sync edilen medya ve denetim ekleri. Kota dolunca otomatik genişleme (adil kullanım) uygulanır.',
  },
  {
    key: 'modules',
    label: 'Modül Erişimi',
    icon: 'modules',
    value: 'Hepsi',
    teaser: 'Ajanda, dashboard, haber akışı',
    body: 'Ajanda, not, operasyon dashboard’u, sektör haberleri ve diğer tüm uygulama içi modüller açıktır.',
  },
  {
    key: 'overflow',
    label: 'Depolama Aşımı',
    icon: 'overflow',
    value: 'Otomatik genişleme',
    teaser: 'Kota dolunca ne olur?',
    body: 'Nadiren limit aşılır; aşılırsa otomatik genişletme uygulanır. Olağandışı kullanımda ekibimiz bilgilendirir.',
  },
  {
    key: 'backup',
    label: 'Yedekleme / Dışa Aktarma',
    icon: 'backup',
    value: 'Otomatik',
    teaser: 'Verinizi dışarı alma',
    body: 'Planlı otomatik yedekleme ve dışa aktarma. Firma ve personel verileriniz size aittir.',
  },
]

const PRICING_FAQ = [
  {
    cat: 'paket',
    q: 'Tek paket mi var?',
    a: 'Evet. Bireysel lisans tek Max pakettir — Windows Agent + Mobil, sınırsız AI ve tüm modüller. Kurumsal ekipler için 5 ve üzeri kullanıcıda kişi başı birim fiyat uygulanır.',
  },
  {
    cat: 'paket',
    q: 'Kurumsal fiyat nasıl hesaplanır?',
    a: 'Minimum 5 kullanıcı. Her koltuk için admin paneldeki kurumsal birim fiyat (varsayılan 14.000 TL KDV dahil) çarpılır. Örnek: 5 × 14.000 = 70.000 TL / yıl.',
  },
  {
    cat: 'paket',
    q: 'Tek kullanıcı lisansı ne demek?',
    a: 'Lisans bir İSG uzmanına aittir; Windows Agent + Mobil (Android) aynı hesapta çalışır. Ek uzman için ek lisans veya kurumsal koltuk gerekir. Windows kurulumu için 3 PC slot hakkı standarttır.',
  },
  {
    cat: 'odeme',
    q: 'Fiyatlar KDV dahil mi?',
    a: 'Kartlarda gösterilen yıllık tutar KDV dahil listedir. Fatura için KDV hariç satır ayrıca belirtilir (ör. 22.500 TL + KDV = 27.000 TL).',
  },
  {
    cat: 'odeme',
    q: 'Taksit var mı?',
    a: 'Evet. Kredi kartına 12 aya kadar taksit imkânı sunulur (banka kampanyasına göre). Peşin veya faturalı ödeme de mümkündür.',
  },
  {
    cat: 'odeme',
    q: 'Ödeme ve yenileme nasıl?',
    a: 'Yıllık peşin, taksitli veya fatura ile ödeme. Yenileme bitiş tarihinden önce hatırlatılır; ödeme yapılmazsa 1 gün tolerans sonrası erişim kapanır.',
  },
  {
    cat: 'teknik',
    q: 'Windows’ta Microsoft Office şart mı?',
    a: 'Evet. Tag’li Word/Excel çıktıları için Office 2016+ veya Microsoft 365 gerekir. Mobil tarafta Office gerekmez.',
  },
  {
    cat: 'teknik',
    q: 'Depolama veya AI kotası aşılırsa?',
    a: 'Max pakette adil kullanım geçerlidir; depolamada otomatik genişleme, AI’da adil kullanım politikası uygulanır. Olağandışı kullanımda bilgilendirilirsiniz.',
  },
  {
    cat: 'teknik',
    q: 'Deneme veya demo var mı?',
    a: 'Başvuru formundan demo talep edebilirsiniz. Admin onaylı deneme hesabı 7–14 gün açılabilir.',
  },
]

const CORP_BENEFITS = [
  {
    icon: 'seat',
    title: '5+ Kullanıcı',
    text: 'Minimum 5 koltuk. Her ek kullanıcı kurumsal birim fiyatla eklenir — tek fatura, merkezi yönetim.',
  },
  {
    icon: 'admin',
    title: 'Merkezi Yönetim',
    text: 'Tüm uzman hesapları tek kurumsal sözleşme altında. Aktif/pasif ve kota yönetimi admin panelden.',
  },
  {
    icon: 'sync',
    title: 'Aynı Ekosistem',
    text: 'Windows Agent + Mobil (Android) + bulut sync. Kurumsal ekipte de bireysel deneyim aynı kalır.',
  },
  {
    icon: 'shield',
    title: 'KVKK & Veri Sahipliği',
    text: 'Firma verileri size ait. Yedekleme, dışa aktarma ve hesap yönetimi kurumsal sözleşmeye göre yapılandırılır.',
  },
]

const CORP_ICONS = {
  enterprise: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.75"/><path d="M7 8h3v3H7zM14 8h3v3h-3zM7 14h3v3H7zM14 14h3v3h-3z" stroke="currentColor" stroke-width="1.25"/></svg>`,
  seat: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 18v-5a4 4 0 014-4h8a4 4 0 014 4v5" stroke="currentColor" stroke-width="1.75"/><path d="M8 18v2M16 18v2M4 14h16" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  admin: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.75"/><path d="M9 9h6M9 13h6M9 17h4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  sync: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 0113.5-5.7M20 12a8 8 0 01-13.5 5.7" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M16 4h4v4M8 20H4v-4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4v6c0 4.4-3.4 7.4-8 9-4.6-1.6-8-4.6-8-9V7l8-4z" stroke="currentColor" stroke-width="1.75"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
}

const fmtMoneyInt = (n) =>
  new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(n)

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function mergePackages(raw) {
  const keys = ['max', 'deneme']
  return keys
    .map((key) => {
      const base = { ...DEFAULT_PACKAGES[key], key }
      const over = raw?.packages?.[key] || raw?.[key] || {}
      const pkg = { ...base }

      if (over.priceIncVat != null && Number(over.priceIncVat) > 0) {
        let inc = Number(over.priceIncVat)
        // Eski Max (35k / 37.2k) → güncel Max
        if (pkg.key === 'max' && (inc === 37200 || inc === 35000)) inc = 27000
        pkg.priceIncVat = inc
        pkg.priceExVat =
          over.priceExVat != null && Number(over.priceExVat) > 0 && inc !== 27000
            ? Number(over.priceExVat)
            : Math.round(pkg.priceIncVat / 1.2)
        pkg.monthlyIncVat = Math.round(pkg.priceIncVat / 12)
      }

      if (typeof over.enabled === 'boolean') pkg.enabled = over.enabled
      if (typeof over.title === 'string' && over.title.trim()) pkg.title = over.title.trim()
      // Eski Max alt başlıklarını yenile
      if (pkg.key === 'max') {
        pkg.subtitle = 'Tam erişim — Windows + Mobil'
        pkg.tag = 'Tek Paket'
        pkg.scope = 'Tek kullanıcı — sınırsız AI, tüm modüller'
      } else {
        if (typeof over.subtitle === 'string') pkg.subtitle = over.subtitle
        if (typeof over.scope === 'string') pkg.scope = over.scope
      }

      return pkg
    })
    .filter((p) => p.enabled !== false)
}

function mergeCorporate(raw) {
  const corp = { ...DEFAULT_CORPORATE }
  const over = raw?.corporate || raw?.kurumsal || {}
  if (over.unitPriceIncVat != null && Number(over.unitPriceIncVat) > 0) {
    let unit = Number(over.unitPriceIncVat)
    // Eski kayıt Pro/Max fiyatını birim sanıyorsa düzelt
    if (unit === 27000 || unit === 37200 || unit === 35000) unit = 14000
    corp.unitPriceIncVat = unit
    corp.unitPriceExVat =
      over.unitPriceExVat != null && Number(over.unitPriceExVat) > 0 && unit !== 14000
        ? Number(over.unitPriceExVat)
        : Math.round(corp.unitPriceIncVat / 1.2)
  }
  if (over.minSeats != null && Number(over.minSeats) >= 2) {
    corp.minSeats = Number(over.minSeats)
  }
  return corp
}

function renderPackageCard(pkg) {
  const featured = pkg.featured ? ' is-featured' : ''
  const accent = pkg.accent || 'violet'
  const tag = pkg.tag ? `<span class="pkg-tag">${esc(pkg.tag)}</span>` : ''
  const monthLine = showMonthlyPrice
    ? `<div class="pkg-price-month">≈ ${fmtMoneyInt(pkg.monthlyIncVat)} TL/ay (KDV dahil)</div>`
    : ''
  const ctaLabel = pkg.key === 'deneme' ? '10 TL Test Öde' : 'Max İle Başla'
  const priceUnit = pkg.key === 'deneme' ? 'TL' : 'TL/yıl'
  const priceEx =
    pkg.key === 'deneme'
      ? `<div class="pkg-price-ex">Geçici iyzico test paketi</div>`
      : `<div class="pkg-price-ex">${fmtMoneyInt(pkg.priceExVat)} TL + KDV</div>`

  return `
    <article class="package-card is-static package-card--v2 package-card--${esc(pkg.key)}${featured}" data-pkg="${esc(pkg.key)}">
      <div class="pkg-card-glow" aria-hidden="true"></div>
      ${tag}
      <div class="pkg-icon-orbit-wrap">
        <div class="pkg-icon-orbit pkg-icon-orbit--outer" aria-hidden="true"></div>
        <div class="pkg-icon-orbit pkg-icon-orbit--inner" aria-hidden="true"></div>
        <div class="pkg-icon-badge pkg-icon-badge--logo pkg-icon-badge--${esc(accent)}">
          <img src="/img/app_logo.png" alt="" width="48" height="48" />
        </div>
      </div>
      <div class="pkg-header pkg-header--v2">
        <div class="pkg-title${featured ? ' pkg-title-amber' : ''}">${esc(pkg.title)}</div>
        <div class="pkg-subtitle">${esc(pkg.subtitle)}</div>
      </div>
      <div class="pkg-price-box">
        <div class="pkg-price${featured ? ' pkg-price-amber' : ''}">${fmtMoneyInt(pkg.priceIncVat)} <small>${priceUnit}</small></div>
        ${priceEx}
        ${monthLine}
      </div>
      <p class="pkg-scope-line">${esc(pkg.scope)}</p>
      <a href="/basvuru.html?paket=${encodeURIComponent(pkg.key)}" class="pkg-cta${featured ? ' pkg-cta--featured' : ''}">${esc(ctaLabel)}</a>
    </article>
  `
}

function renderFeaturesList() {
  return `
    <div class="pricing-features-list">
      ${FEATURES.map(
        (f) => `
        <article class="pricing-feature-card" id="feat-${esc(f.key)}" data-feat-item="${esc(f.key)}">
          <div class="pricing-feature-head">
            <span class="pricing-feat-icon">${ICONS[f.icon] || ''}</span>
            <div>
              <h3>${esc(f.label)}</h3>
              <p class="pricing-feature-value">${esc(f.value)}</p>
            </div>
          </div>
          <p class="pricing-feature-teaser">${esc(f.teaser)}</p>
          <p class="pricing-feature-body">${esc(f.body)}</p>
        </article>`,
      ).join('')}
    </div>
  `
}

function renderGlossaryChips() {
  return FEATURES.map(
    (g) =>
      `<button type="button" class="pricing-glossary-chip" data-feat="${esc(g.key)}">${ICONS[g.icon] || ''}<span>${esc(g.label)}</span></button>`,
  ).join('')
}

function renderGlossaryList() {
  return FEATURES.map(
    (g) => `
    <details class="faq-item pricing-glossary-item" id="feat-detail-${esc(g.key)}" data-feat-item="${esc(g.key)}">
      <summary>
        <span class="pricing-glossary-summary-inner">
          <span class="pricing-glossary-summary-icon">${ICONS[g.icon] || ''}</span>
          <span>
            <strong>${esc(g.label)} Nedir?</strong>
            <span class="pricing-glossary-teaser">${esc(g.teaser)}</span>
          </span>
        </span>
      </summary>
      <p>${esc(g.body)}</p>
    </details>`,
  ).join('')
}

function renderInstallmentCard() {
  return `
    <article class="installment-card" data-reveal>
      <div class="installment-card-glow" aria-hidden="true"></div>
      <div class="installment-card-ico" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2.5" stroke="currentColor" stroke-width="1.75"/><path d="M2 10h20M6 14h4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>
      </div>
      <div class="installment-card-copy">
        <p class="installment-eyebrow">Ödeme Kolaylığı</p>
        <h3 class="installment-title">Kredi Kartına 12 Aya Kadar Taksit</h3>
        <p class="installment-text">Max ve kurumsal lisanslarda kredi kartı ile 12 aya varan taksit. Peşin veya faturalı ödeme de mümkün — banka kampanyasına göre oranlar değişebilir.</p>
      </div>
      <ul class="installment-pills" aria-label="Taksit özeti">
        <li>12 ay</li>
        <li>Kredi kartı</li>
        <li>Güvenli ödeme</li>
      </ul>
    </article>
  `
}

function renderPricingFaq() {
  const cats = [
    { id: 'paket', label: 'Paket', ico: 'scope' },
    { id: 'odeme', label: 'Ödeme', ico: 'backup' },
    { id: 'teknik', label: 'Teknik', ico: 'modules' },
  ]
  const nav = cats
    .map(
      (c, i) =>
        `<a class="faq-cat${i === 0 ? ' is-active' : ''}" href="#pfq-${c.id}"><span class="ico">${ICONS[c.ico] || ''}</span>${esc(c.label)}</a>`,
    )
    .join('')

  const groups = cats
    .map((c) => {
      const items = PRICING_FAQ.filter((f) => f.cat === c.id)
      const cards = items
        .map(
          (item, idx) => `
        <details class="faq-card" data-reveal>
          <summary><span class="faq-num">${String(idx + 1).padStart(2, '0')}</span><span>${esc(item.q)}</span></summary>
          <p>${esc(item.a)}</p>
        </details>`,
        )
        .join('')
      return `<div class="faq-group" id="pfq-${c.id}"><h2 class="faq-group-title">${esc(c.label)}</h2>${cards}</div>`
    })
    .join('')

  return `<div class="faq-layout"><aside class="faq-cats" aria-label="Fiyat SSS">${nav}</aside><div>${groups}</div></div>`
}

function openFeatureExplain(key) {
  const el = document.getElementById(`feat-detail-${key}`) || document.getElementById(`feat-${key}`)
  if (!el) return
  if (el.tagName === 'DETAILS') el.open = true
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el.classList.add('is-flash')
  window.setTimeout(() => el.classList.remove('is-flash'), 1200)
}

function bindFeatureLinks(root) {
  root?.querySelectorAll('[data-feat]').forEach((btn) => {
    btn.addEventListener('click', () => openFeatureExplain(btn.dataset.feat))
  })
}

let corporateState = { ...DEFAULT_CORPORATE }

function revealInjected(root = document) {
  root.querySelectorAll?.('[data-reveal]')?.forEach((el) => el.classList.add('is-visible'))
  if (root instanceof Element && root.matches?.('[data-reveal]')) {
    root.classList.add('is-visible')
  }
}

function renderCorpHero(corp) {
  return `
    <div class="corp-hero" data-reveal>
      <div class="corp-hero-visual" aria-hidden="true">
        <div class="corp-hero-orbit"></div>
        <div class="corp-hero-icon">${CORP_ICONS.enterprise}</div>
      </div>
      <div class="corp-hero-copy">
        <p class="corp-hero-eyebrow">OSGB & Kurumsal Ekipler</p>
        <h2 class="corp-hero-title">5 ve Üzeri — Tek Birim Fiyat</h2>
        <p class="corp-hero-lead">Minimum ${corp.minSeats} kullanıcı. Her koltuk için ${fmtMoneyInt(corp.unitPriceIncVat)} TL / yıl (KDV dahil). Aynı Max özellik seti; ekip büyüdükçe birim fiyat eklenir.</p>
      </div>
    </div>
  `
}

function renderCorpCalculator(corp) {
  const min = corp.minSeats
  return `
    <div class="pricing-panel corp-calc-panel" data-reveal>
      <div class="pricing-panel-head">
        <h2 class="pricing-panel-title">Kurumsal Hesap</h2>
        <span class="pricing-panel-meta">Min. ${min} kullanıcı</span>
      </div>
      <div class="corp-calc">
        <label class="corp-calc-field">
          <span>Kullanıcı sayısı</span>
          <input type="number" min="${min}" step="1" value="${min}" data-corp-seats />
        </label>
        <div class="corp-calc-unit">
          <span>Birim fiyat</span>
          <strong>${fmtMoneyInt(corp.unitPriceIncVat)} TL / yıl</strong>
          <small>${fmtMoneyInt(corp.unitPriceExVat)} TL + KDV</small>
        </div>
        <div class="corp-calc-total">
          <span>Yıllık toplam</span>
          <strong data-corp-total>${fmtMoneyInt(corp.unitPriceIncVat * min)} TL</strong>
          <small data-corp-total-ex>${fmtMoneyInt(corp.unitPriceExVat * min)} TL + KDV</small>
        </div>
        <a class="pkg-cta pkg-cta--featured" data-corp-cta href="/basvuru.html?paket=kurumsal&seats=${min}">Kurumsal Satın Al</a>
      </div>
      <p class="corp-tiers-foot">Birim fiyat admin panelden güncellenir. Satın alma formunda kullanıcı sayısını değiştirebilirsiniz.</p>
    </div>
  `
}

function renderCorpBenefits() {
  const items = CORP_BENEFITS.map(
    (b) => `
    <div class="corp-benefit">
      <div class="corp-benefit-icon">${CORP_ICONS[b.icon] || ''}</div>
      <h3>${esc(b.title)}</h3>
      <p>${esc(b.text)}</p>
    </div>`,
  ).join('')

  return `
    <div data-reveal>
      <div class="pricing-section-head">
        <h2 class="pricing-section-title">Kurumsal Modelde Neler Var?</h2>
        <p class="pricing-section-sub">OSGB ve çok uzmanlı yapılar için — Max özellik seti, kişi başı faturalama</p>
      </div>
      <div class="corp-benefits-grid">${items}</div>
    </div>
  `
}

function renderCorpCta() {
  const mailSubject = encodeURIComponent('İSG Atlası — Kurumsal Teklif Talebi')
  const mailBody = encodeURIComponent(
    'Merhaba,\n\nKurumsal / OSGB teklifi almak istiyorum.\n\nFirma/OSGB adı:\nTahmini kullanıcı sayısı (min 5):\nİletişim telefonu:\n\nTeşekkürler.',
  )
  return `
    <div class="corp-cta-band" data-reveal>
      <div class="corp-cta-glow" aria-hidden="true"></div>
      <div class="corp-cta-inner">
        <div class="corp-cta-copy">
          <h2 class="corp-cta-title">Sorunuz mu Var?</h2>
          <p class="corp-cta-text">Ekip büyüklüğünüzü paylaşın — kurumsal birim fiyat ve sözleşme için yardımcı olalım.</p>
        </div>
        <div class="corp-cta-actions">
          <a href="tel:${COMPANY_PHONE}" class="btn-amber corp-cta-btn">
            Firmayı Ara · ${esc(COMPANY_PHONE_DISPLAY)}
          </a>
          <a href="mailto:${SUPPORT_EMAIL}?subject=${mailSubject}&body=${mailBody}" class="corp-cta-btn corp-cta-btn--ghost">
            ${esc(SUPPORT_EMAIL)}
          </a>
        </div>
      </div>
    </div>
  `
}

function bindCorpCalculator(root, corp) {
  const input = root?.querySelector('[data-corp-seats]')
  const totalEl = root?.querySelector('[data-corp-total]')
  const totalEx = root?.querySelector('[data-corp-total-ex]')
  const cta = root?.querySelector('[data-corp-cta]')
  if (!input) return

  const sync = () => {
    let n = parseInt(input.value, 10)
    if (!Number.isFinite(n) || n < corp.minSeats) n = corp.minSeats
    input.value = String(n)
    if (totalEl) totalEl.textContent = `${fmtMoneyInt(corp.unitPriceIncVat * n)} TL`
    if (totalEx) totalEx.textContent = `${fmtMoneyInt(corp.unitPriceExVat * n)} TL + KDV`
    if (cta) cta.href = `/basvuru.html?paket=kurumsal&seats=${n}`
  }
  input.addEventListener('input', sync)
  input.addEventListener('change', sync)
  sync()
}

function renderCorporatePanel(corp) {
  corporateState = corp
  const hero = document.getElementById('pricing-corp-hero')
  const tiers = document.getElementById('pricing-corp-tiers')
  const benefits = document.getElementById('pricing-corp-benefits')
  const cta = document.getElementById('pricing-corp-cta')
  if (hero) hero.innerHTML = renderCorpHero(corp)
  if (tiers) {
    tiers.innerHTML = renderCorpCalculator(corp)
    bindCorpCalculator(tiers, corp)
  }
  if (benefits) benefits.innerHTML = renderCorpBenefits()
  if (cta) cta.innerHTML = renderCorpCta()
  ;[hero, tiers, benefits, cta].forEach((el) => revealInjected(el))
}

async function loadPricingPackages() {
  const grid = document.getElementById('pricing-packages-grid')
  const compare = document.getElementById('pricing-compare-wrap')
  const chips = document.getElementById('pricing-glossary-chips')
  const glossary = document.getElementById('pricing-glossary-list')
  const faq = document.getElementById('pricing-faq-list')
  if (!grid) return

  let packages = mergePackages(null)
  let corp = mergeCorporate(null)
  try {
    const res = await fetch(`${API_BASE}/v1/site-settings/fiyatlandirma_paketleri`)
    if (res.ok) {
      const data = await res.json()
      if (data && typeof data === 'object' && Object.keys(data).length) {
        if (typeof data.showMonthlyPrice === 'boolean') {
          showMonthlyPrice = data.showMonthlyPrice
        }
        packages = mergePackages(data)
        corp = mergeCorporate(data)
        // Eski admin: pro fiyatı varsa Max’e uygula (tek paket geçişi)
        if (!data.packages?.max?.priceIncVat && data.packages?.pro?.priceIncVat) {
          const pro = data.packages.pro
          packages = packages.map((p) => {
            if (p.key !== 'max') return p
            return {
              ...p,
              priceIncVat: Number(pro.priceIncVat),
              priceExVat: Number(pro.priceExVat) || Math.round(Number(pro.priceIncVat) / 1.2),
              monthlyIncVat: Math.round(Number(pro.priceIncVat) / 12),
            }
          })
          if (!data.corporate && !data.kurumsal) {
            corp.unitPriceIncVat = 14000
            corp.unitPriceExVat = 11667
          }
        }
      }
    }
  } catch (err) {
    console.warn('fiyatlandirma_paketleri okunamadı, yerel varsayılan', err)
  }

  grid.innerHTML = packages.map(renderPackageCard).join('')
  grid.classList.add('packages-grid--single')

  const installmentHost = document.getElementById('pricing-installment')
  if (installmentHost) installmentHost.innerHTML = renderInstallmentCard()

  if (compare) {
    compare.innerHTML = renderFeaturesList()
    const title = compare.closest('.pricing-panel')?.querySelector('.pricing-panel-title')
    const meta = compare.closest('.pricing-panel')?.querySelector('.pricing-panel-meta')
    if (title) title.textContent = 'Özellikler'
    if (meta) meta.textContent = 'Max paket kapsamı'
  }
  if (chips) chips.innerHTML = renderGlossaryChips()
  if (glossary) glossary.innerHTML = renderGlossaryList()
  if (faq) {
    faq.innerHTML = renderPricingFaq()
    faq.querySelectorAll('.faq-cat').forEach((a) => {
      a.addEventListener('click', () => {
        faq.querySelectorAll('.faq-cat').forEach((x) => x.classList.remove('is-active'))
        a.classList.add('is-active')
      })
    })
  }

  bindFeatureLinks(document.getElementById('pricing-page'))
  renderCorporatePanel(corp)
  revealInjected(document.getElementById('pricing-page'))

  if (location.hash.startsWith('#feat-')) {
    openFeatureExplain(location.hash.replace('#feat-', ''))
  }
}

function setPricingTab(tab) {
  const isCorp = tab === 'kurumsal'
  document.querySelectorAll('[data-pricing-tab]').forEach((btn) => {
    const active = btn.dataset.pricingTab === tab
    btn.classList.toggle('is-active', active)
    btn.setAttribute('aria-selected', active ? 'true' : 'false')
  })
  const bireysel = document.getElementById('pricing-panel-bireysel')
  const kurumsal = document.getElementById('pricing-panel-kurumsal')
  if (bireysel) {
    bireysel.classList.toggle('is-active', !isCorp)
    bireysel.hidden = isCorp
  }
  if (kurumsal) {
    kurumsal.classList.toggle('is-active', isCorp)
    kurumsal.hidden = !isCorp
    if (isCorp) revealInjected(kurumsal)
  }
  try {
    history.replaceState(null, '', isCorp ? '#kurumsal' : '#bireysel')
  } catch {
    /* ignore */
  }
}

function bindPricingTabs() {
  document.querySelectorAll('[data-pricing-tab]').forEach((btn) => {
    btn.addEventListener('click', () => setPricingTab(btn.dataset.pricingTab))
  })
  const hash = location.hash.replace('#', '')
  if (hash === 'kurumsal') setPricingTab('kurumsal')
  else setPricingTab('bireysel')
}

function bindPricingPage() {
  if (!document.body?.dataset?.page?.includes('pricing') && !document.getElementById('pricing-page')) return
  bindPricingTabs()
  void loadPricingPackages()
}

bindPricingPage()

export { corporateState, mergeCorporate, mergePackages }

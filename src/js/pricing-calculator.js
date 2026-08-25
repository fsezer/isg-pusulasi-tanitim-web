/**
 * İSG Atlası — fiyatlandırma sayfası v2
 * Kaynak: isg_atlasi_fiyatlandirma.xlsx (varsayılan) + API site_settings override
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
  normal: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="8" y="14" width="32" height="24" rx="4" stroke="currentColor" stroke-width="2"/><path d="M16 14V11a8 8 0 0116 0v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="26" r="3" fill="currentColor"/></svg>`,
  pro: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 6l4.5 9.5L39 17l-7.5 7.5L33 39 24 33.5 15 39l1.5-14.5L9 17l10.5-1.5L24 6z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  max: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="16" stroke="currentColor" stroke-width="2"/><path d="M16 24h16M24 16v16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 14l20 20M34 14L14 34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".35"/></svg>`,
  'ai-chat': `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H9l-4 4V6z" stroke="currentColor" stroke-width="1.75"/><path d="M8 9h8M8 12h5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  'ai-visual': `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.75"/><circle cx="9" cy="10" r="2" stroke="currentColor" stroke-width="1.5"/><path d="M21 15l-5-5-4 4-2-2-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  voice: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" stroke-width="1.75"/><path d="M6 11a6 6 0 0012 0M12 17v4M8 21h8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  windows: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.75"/><path d="M8 20h8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  mobile: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" stroke-width="1.75"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg>`,
  storage: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><ellipse cx="12" cy="7" rx="8" ry="3" stroke="currentColor" stroke-width="1.75"/><path d="M4 7v6c0 1.7 3.6 3 8 3s8-1.3 8-3V7M4 13v4c0 1.7 3.6 3 8 3s8-1.3 8-3v-4" stroke="currentColor" stroke-width="1.75"/></svg>`,
  modules: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.75"/><rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.75"/><rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.75"/><rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.75"/></svg>`,
  backup: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M5 15v2a2 2 0 002 2h10a2 2 0 002-2v-2" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  overflow: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 9v4m0 4h.01M10.3 4.5h3.4l7.3 12.6a2 2 0 01-1.7 3H4.7a2 2 0 01-1.7-3L10.3 4.5z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/></svg>`,
  scope: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.75"/><path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
}

export const DEFAULT_PACKAGES = {
  normal: {
    key: 'normal',
    title: 'Normal',
    subtitle: 'Başlangıç & Serbest İSG Uzmanı',
    priceIncVat: 17400,
    priceExVat: 14500,
    monthlyIncVat: 1450,
    tag: '',
    featured: false,
    accent: 'sky',
    scope: 'Tek kullanıcı — temel saha & ofis',
  },
  pro: {
    key: 'pro',
    title: 'Pro',
    subtitle: 'Yoğun & Tam Zamanlı Saha',
    priceIncVat: 27000,
    priceExVat: 22500,
    monthlyIncVat: 2250,
    tag: '',
    featured: false,
    accent: 'amber',
    scope: 'Tek kullanıcı — AI destekli uzman',
  },
  max: {
    key: 'max',
    title: 'Max',
    subtitle: 'Sınırsız AI & Tam Erişim',
    priceIncVat: 37200,
    priceExVat: 31000,
    monthlyIncVat: 3100,
    tag: 'En Avantajlı',
    featured: true,
    accent: 'violet',
    scope: 'Tek kullanıcı — limitsiz AI',
  },
}

const COMPARE_ROWS = [
  { key: 'scope', label: 'Kapsam', icon: 'scope', values: { normal: 'Başlangıç / serbest uzman', pro: 'Yoğun saha kullanımı', max: 'Tam erişim' } },
  { key: 'ai-chat', label: 'AI Sohbet', icon: 'ai-chat', values: { normal: 'Yok', pro: 'Ayda 300 mesaj', max: 'Sınırsız' } },
  { key: 'ai-visual', label: 'AI Görsel Analiz', icon: 'ai-visual', values: { normal: 'Yok', pro: 'Ayda 50 adet', max: 'Sınırsız' } },
  { key: 'voice', label: 'Sesli Giriş (Dikte)', icon: 'voice', values: { normal: 'Yok', pro: 'Var', max: 'Var' } },
  { key: 'windows', label: 'Windows Agent Araçları', icon: 'windows', values: { normal: 'Asistan', pro: 'Asistan + Veri Girişleri', max: 'Hepsi' } },
  { key: 'mobile', label: 'Mobil Depolama', icon: 'mobile', values: { normal: '2 GB', pro: '5 GB', max: '10 GB' } },
  { key: 'modules', label: 'Modül Erişimi', icon: 'modules', values: { normal: 'Ajanda + Not', pro: 'Dashboard + News', max: 'Hepsi' } },
  { key: 'overflow', label: 'Depolama Aşımı', icon: 'overflow', values: { normal: 'Yeni kayıt durur, uyarı', pro: 'Ek GB satın alma', max: 'Otomatik genişleme' } },
  { key: 'backup', label: 'Yedekleme / Dışa Aktarma', icon: 'backup', values: { normal: 'Yok', pro: 'Manuel', max: 'Otomatik' } },
]

const GLOSSARY = [
  {
    key: 'ai-chat',
    title: 'AI Sohbet Nedir?',
    teaser: '6331 mevzuatına dayalı metin asistanı',
    body: 'Mobil ve Windows’ta İSG sorularınızı doğal dilde sorarsınız; risk değerlendirme, mevzuat yorumu ve saha önerileri alırsınız. Pro pakette ayda 300 mesaj, Max’te adil kullanım kapsamında sınırsız.',
  },
  {
    key: 'ai-visual',
    title: 'AI Görsel Analiz Nedir?',
    teaser: 'Saha fotoğrafından risk & KKD tespiti',
    body: 'Denetim veya uzman ekranından çekilen fotoğraf yapay zekâ ile incelenir; baret, emniyet kemeri, düzensizlik gibi bulgular metne dökülür. Pro’da ayda 50 analiz hakkı vardır.',
  },
  {
    key: 'voice',
    title: 'Sesli Giriş (Dikte) Nedir?',
    teaser: 'Klavyesiz saha kaydı',
    body: 'Mobilde mikrofonla konuşarak denetim notu, bulgu ve form alanı doldurursunuz. Elleriniz doluyken bile kayıt akar. Normal pakette kapalı; Pro ve Max’te açıktır.',
  },
  {
    key: 'windows',
    title: 'Windows Agent Araçları Nedir?',
    teaser: 'Ofiste şablon, firma, evrak motoru',
    body: 'Tag’li Word/Excel şablonları, e-Devlet Excel aktarımı, toplu sertifika basımı ve arşiv. Normal’de temel asistan; Pro’da veri giriş modülleri; Max’te tüm profesyonel araç seti.',
  },
  {
    key: 'mobile',
    title: 'Mobil Depolama Nedir?',
    teaser: 'Saha foto & video bulutu',
    body: 'Telefondan sync edilen medya, denetim ekleri ve arşiv dosyalarının bulutta kapladığı alan. Normal 2 GB, Pro 5 GB, Max 10 GB ile başlar; aşımda paket politikası uygulanır.',
  },
  {
    key: 'modules',
    title: 'Modül Erişimi Nedir?',
    teaser: 'Ajanda, dashboard, haber akışı',
    body: 'Uygulama içi modüller pakete göre açılır. Normal: ajanda ve not. Pro: operasyon dashboard’u ve sektör haberleri. Max: tüm modüller.',
  },
  {
    key: 'overflow',
    title: 'Depolama Aşımı Ne Olur?',
    teaser: 'Kota dolunca ne yapılır?',
    body: 'Normal’de yeni medya yüklemesi durur ve uyarı gösterilir. Pro’da ek GB satın alma teklifi çıkar. Max’te nadiren limit aşılır; aşılırsa otomatik genişletme uygulanır (adil kullanım).',
  },
  {
    key: 'backup',
    title: 'Yedekleme / Dışa Aktarma Nedir?',
    teaser: 'Verinizi dışarı alma',
    body: 'Pro’da manuel yedek indirme; Max’te planlı otomatik yedekleme. Firma ve personel verileriniz size aittir; paket yükseltmeden önce yedek almanız önerilir.',
  },
]

const PRICING_FAQ = [
  {
    q: 'Depolama kotası aşılınca ek GB ne kadar?',
    a: 'Pro pakette liste fiyatı: ek 1 GB = 150 TL + KDV / ay (yıllık sözleşmede indirim uygulanabilir). Normal pakette önce mevcut alanı temizlemeniz gerekir. Max pakette otomatik genişleme devreye girer; olağandışı kullanımda ekibimiz bilgilendirir.',
  },
  {
    q: 'AI kotası (300 mesaj / 50 görsel) ne zaman sıfırlanır?',
    a: 'Her takvim ayının 1’inde sıfırlanır. Kullanılmayan hak bir sonraki aya devretmez. Max pakette adil kullanım politikası geçerlidir.',
  },
  {
    q: 'Tek kullanıcı lisansı ne demek?',
    a: 'Lisans bir İSG uzmanına aittir; Windows Agent + Android aynı hesapta çalışır. Ekip veya çoklu uzman için ayrı lisans gerekir. Windows kurulumu için 3 PC slot hakkı standarttır.',
  },
  {
    q: 'Normal’den Pro’ya geçiş nasıl olur?',
    a: 'Başvuru veya destek üzerinden paket yükseltme yapılır. Kalan lisans süreniz orantılı hesaplanır; yeni paket fiyat farkı tahsil edilir, modüller aynı gün açılır.',
  },
  {
    q: 'Fiyatlar KDV dahil mi?',
    a: 'Kartlarda gösterilen yıllık tutar KDV dahil listedir. Fatura için KDV hariç satır ayrıca belirtilir (ör. Pro: 22.500 + KDV).',
  },
  {
    q: 'Windows’ta Microsoft Office şart mı?',
    a: 'Evet. Tag’li Word/Excel çıktıları için Office 2016+ veya Microsoft 365 gerekir. Mobil tarafta Office gerekmez.',
  },
  {
    q: 'Deneme veya demo var mı?',
    a: 'Başvuru formundan demo talep edebilirsiniz. Admin onaylı deneme hesabı 7–14 gün açılabilir; paket özellikleri deneme tipine göre sınırlanır.',
  },
  {
    q: 'Ödeme ve yenileme nasıl?',
    a: 'Yıllık peşin veya fatura ile ödeme. Yenileme bitiş tarihinden önce hatırlatılır; ödeme yapılmazsa 1 gün tolerans sonrası erişim kapanır.',
  },
]

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
  return ['normal', 'pro', 'max']
    .map((key) => {
      const base = { ...DEFAULT_PACKAGES[key], key, enabled: true }
      const over = raw?.packages?.[key] || raw?.[key] || {}
      const pkg = { ...base }

      if (over.priceIncVat != null && Number(over.priceIncVat) > 0) {
        pkg.priceIncVat = Number(over.priceIncVat)
        pkg.priceExVat =
          over.priceExVat != null && Number(over.priceExVat) > 0
            ? Number(over.priceExVat)
            : Math.round(pkg.priceIncVat / 1.2)
        pkg.monthlyIncVat = Math.round(pkg.priceIncVat / 12)
      }

      if (typeof over.enabled === 'boolean') pkg.enabled = over.enabled

      return pkg
    })
    .filter((p) => p.enabled !== false)
}

function renderPackageCard(pkg) {
  const featured = pkg.featured ? ' is-featured' : ''
  const accent = pkg.accent || 'sky'
  const tag = pkg.tag ? `<span class="pkg-tag">${esc(pkg.tag)}</span>` : ''
  const monthLine = showMonthlyPrice
    ? `<div class="pkg-price-month">≈ ${fmtMoneyInt(pkg.monthlyIncVat)} TL/ay (KDV dahil)</div>`
    : ''
  const ctaLabel = pkg.key === 'max' ? 'Max İle Başla' : 'Başvur'

  return `
    <article class="package-card is-static package-card--v2 package-card--${esc(pkg.key)}${featured}" data-pkg="${esc(pkg.key)}">
      <div class="pkg-card-glow" aria-hidden="true"></div>
      ${tag}
      <div class="pkg-icon-orbit-wrap">
        <div class="pkg-icon-orbit pkg-icon-orbit--outer" aria-hidden="true"></div>
        <div class="pkg-icon-orbit pkg-icon-orbit--inner" aria-hidden="true"></div>
        <div class="pkg-icon-badge pkg-icon-badge--${esc(accent)}">${ICONS[pkg.key] || ICONS.normal}</div>
      </div>
      <div class="pkg-header pkg-header--v2">
        <div class="pkg-title${featured ? ' pkg-title-amber' : ''}">${esc(pkg.title)}</div>
        <div class="pkg-subtitle">${esc(pkg.subtitle)}</div>
      </div>
      <div class="pkg-price-box">
        <div class="pkg-price${featured ? ' pkg-price-amber' : ''}">${fmtMoneyInt(pkg.priceIncVat)} <small>TL/yıl</small></div>
        <div class="pkg-price-ex">${fmtMoneyInt(pkg.priceExVat)} TL + KDV</div>
        ${monthLine}
      </div>
      <p class="pkg-scope-line">${esc(pkg.scope)}</p>
      <a href="/basvuru.html" class="pkg-cta${featured ? ' pkg-cta--featured' : ''}">${esc(ctaLabel)}</a>
    </article>
  `
}

function cellClass(val) {
  const v = String(val).toLowerCase()
  if (v === 'yok' || v.includes('durur')) return 'is-muted'
  if (v.includes('sınırsız') || v === 'var' || v === 'hepsi' || v.includes('otomatik')) return 'is-highlight'
  return ''
}

function renderCompareTable(packages) {
  const cols = packages.map((p) => p.key)
  const head = packages
    .map(
      (p) =>
        `<th class="pricing-compare-th${p.featured ? ' is-featured-col' : ''}"><span class="pricing-compare-pkg">${esc(p.title)}</span></th>`,
    )
    .join('')

  const rows = COMPARE_ROWS.map((row) => {
    const cells = cols
      .map((k) => {
        const val = row.values[k] || '—'
        return `<td class="pricing-compare-td ${cellClass(val)}">${esc(val)}</td>`
      })
      .join('')

    const featureCell =
      row.key === 'scope'
        ? `<th scope="row" class="pricing-compare-feature pricing-compare-feature--plain">
            <span class="pricing-feat-icon">${ICONS[row.icon] || ''}</span>
            <span>${esc(row.label)}</span>
          </th>`
        : `<th scope="row" class="pricing-compare-feature">
            <button type="button" class="pricing-feat-link" data-feat="${esc(row.key)}" aria-label="${esc(row.label)} nedir?">
              <span class="pricing-feat-icon">${ICONS[row.icon] || ''}</span>
              <span>${esc(row.label)}</span>
              <span class="pricing-feat-q" aria-hidden="true">?</span>
            </button>
          </th>`

    return `
      <tr class="pricing-compare-row">
        ${featureCell}
        ${cells}
      </tr>`
  }).join('')

  return `
    <div class="pricing-compare-scroll">
      <table class="pricing-compare-table">
        <thead>
          <tr>
            <th class="pricing-compare-th pricing-compare-th--label">Özellik</th>
            ${head}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `
}

function renderGlossaryChips() {
  return GLOSSARY.map(
    (g) =>
      `<button type="button" class="pricing-glossary-chip" data-feat="${esc(g.key)}">${ICONS[g.key] || ''}<span>${esc(g.title.replace(' Nedir?', ''))}</span></button>`,
  ).join('')
}

function renderGlossaryList() {
  return GLOSSARY.map(
    (g) => `
    <details class="faq-item pricing-glossary-item" id="feat-${esc(g.key)}" data-feat-item="${esc(g.key)}">
      <summary>
        <span class="pricing-glossary-summary-inner">
          <span class="pricing-glossary-summary-icon">${ICONS[g.key] || ''}</span>
          <span>
            <strong>${esc(g.title)}</strong>
            <span class="pricing-glossary-teaser">${esc(g.teaser)}</span>
          </span>
        </span>
      </summary>
      <p>${esc(g.body)}</p>
    </details>`,
  ).join('')
}

function renderPricingFaq() {
  return PRICING_FAQ.map(
    (item) =>
      `<details class="faq-item"><summary>${esc(item.q)}</summary><p>${esc(item.a)}</p></details>`,
  ).join('')
}

function openFeatureExplain(key) {
  const el = document.getElementById(`feat-${key}`)
  if (!el) return
  el.open = true
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el.classList.add('is-flash')
  window.setTimeout(() => el.classList.remove('is-flash'), 1200)
}

function bindFeatureLinks(root) {
  root?.querySelectorAll('[data-feat]').forEach((btn) => {
    btn.addEventListener('click', () => openFeatureExplain(btn.dataset.feat))
  })
}

async function loadPricingPackages() {
  const grid = document.getElementById('pricing-packages-grid')
  const compare = document.getElementById('pricing-compare-wrap')
  const chips = document.getElementById('pricing-glossary-chips')
  const glossary = document.getElementById('pricing-glossary-list')
  const faq = document.getElementById('pricing-faq-list')
  if (!grid) return

  let packages = mergePackages(null)
  try {
    const res = await fetch(`${API_BASE}/v1/site-settings/fiyatlandirma_paketleri`)
    if (res.ok) {
      const data = await res.json()
      if (data && typeof data === 'object' && Object.keys(data).length) {
        if (typeof data.showMonthlyPrice === 'boolean') {
          showMonthlyPrice = data.showMonthlyPrice
        }
        packages = mergePackages(data)
      }
    }
  } catch (err) {
    console.warn('fiyatlandirma_paketleri okunamadı, yerel varsayılan', err)
  }

  grid.innerHTML = packages.map(renderPackageCard).join('')
  if (compare) compare.innerHTML = renderCompareTable(packages)
  if (chips) chips.innerHTML = renderGlossaryChips()
  if (glossary) glossary.innerHTML = renderGlossaryList()
  if (faq) faq.innerHTML = renderPricingFaq()

  bindFeatureLinks(document.getElementById('pricing-page'))

  if (location.hash.startsWith('#feat-')) {
    openFeatureExplain(location.hash.replace('#feat-', ''))
  }
}

const CORP_TIERS = [
  {
    key: 'small',
    range: '1–4 kullanıcı',
    model: 'Bireysel Pro / Max fiyatı',
    badge: 'Küçük ölçek',
    note: 'Firma indirimi uygulanmaz. Her uzman kendi bireysel paketiyle devam eder.',
    icon: 'users-sm',
    accent: 'sky',
  },
  {
    key: 'volume1',
    range: '5–14 kullanıcı',
    model: 'Kişi başı ~%15 indirimli',
    badge: 'Hacim kademesi I',
    note: 'OSGB veya çok uzmanlı ekip için ilk kurumsal kademe. Tek fatura, merkezi yönetim.',
    icon: 'users-md',
    accent: 'teal',
  },
  {
    key: 'volume2',
    range: '15–49 kullanıcı',
    model: 'Kişi başı ~%25 indirimli',
    badge: 'Hacim kademesi II',
    note: 'Orta ölçek OSGB. Eğitim, onboarding ve öncelikli destek pakete dahil edilebilir.',
    icon: 'users-lg',
    accent: 'amber',
  },
  {
    key: 'enterprise',
    range: '50+ kullanıcı',
    model: 'Teklif usulü — görüşme ile',
    badge: 'Kurumsal anlaşma',
    note: 'Büyük OSGB, zincir veya bayi modeli. Özel SLA, entegrasyon ve fiyatlandırma.',
    icon: 'enterprise',
    accent: 'violet',
    featured: true,
  },
]

const CORP_BENEFITS = [
  {
    icon: 'seat',
    title: 'Kademeli Kişi Başı',
    text: 'Sabit paket yerine ekip büyüklüğünüze göre adil ölçeklenen model. Kullanıcı ekledikçe kademe otomatik değerlendirilir.',
  },
  {
    icon: 'admin',
    title: 'Merkezi Yönetim',
    text: 'Tüm uzman hesapları tek kurumsal sözleşme altında. Aktif/pasif, paket ve kota yönetimi admin panelden.',
  },
  {
    icon: 'sync',
    title: 'Aynı Ekosistem',
    text: 'Windows Agent + Android mobil + bulut sync. Kurumsal ekipte de bireysel kullanıcı deneyimi aynı kalır.',
  },
  {
    icon: 'shield',
    title: 'KVKK & Veri Sahipliği',
    text: 'Firma verileri size ait. Yedekleme, dışa aktarma ve hesap yönetimi kurumsal sözleşmeye göre yapılandırılır.',
  },
]

const CORP_ICONS = {
  'users-sm': `<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" stroke="currentColor" stroke-width="1.75"/><path d="M3 19c0-2.5 2.7-4 6-4M15 8a3 3 0 110 6M21 19c0-2.2-2.5-4-5-4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  'users-md': `<svg viewBox="0 0 24 24" fill="none"><circle cx="8" cy="7" r="2.5" stroke="currentColor" stroke-width="1.75"/><circle cx="16" cy="7" r="2.5" stroke="currentColor" stroke-width="1.75"/><path d="M2 19c0-2.2 2.7-4 6-4M16 19c0-2.2 2.7-4 6-4M10 19c0-1.5 1.8-3 4-3s4 1.5 4 3" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  'users-lg': `<svg viewBox="0 0 24 24" fill="none"><circle cx="6" cy="7" r="2" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="6" r="2.5" stroke="currentColor" stroke-width="1.75"/><circle cx="18" cy="7" r="2" stroke="currentColor" stroke-width="1.5"/><path d="M2 20c0-2 1.8-3.5 4-3.5M20 20c0-2-1.8-3.5-4-3.5M8 20c0-1.2 1.8-2.5 4-2.5s4 1.3 4 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  enterprise: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.75"/><path d="M7 8h3v3H7zM14 8h3v3h-3zM7 14h3v3H7zM14 14h3v3h-3z" stroke="currentColor" stroke-width="1.25"/></svg>`,
  seat: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 18v-5a4 4 0 014-4h8a4 4 0 014 4v5" stroke="currentColor" stroke-width="1.75"/><path d="M8 18v2M16 18v2M4 14h16" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  admin: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.75"/><path d="M9 9h6M9 13h6M9 17h4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  sync: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 0113.5-5.7M20 12a8 8 0 01-13.5 5.7" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M16 4h4v4M8 20H4v-4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4v6c0 4.4-3.4 7.4-8 9-4.6-1.6-8-4.6-8-9V7l8-4z" stroke="currentColor" stroke-width="1.75"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
}

function renderCorpHero() {
  return `
    <div class="corp-hero" data-reveal>
      <div class="corp-hero-visual" aria-hidden="true">
        <div class="corp-hero-orbit"></div>
        <div class="corp-hero-icon">${CORP_ICONS.enterprise}</div>
      </div>
      <div class="corp-hero-copy">
        <p class="corp-hero-eyebrow">OSGB & Kurumsal Ekipler</p>
        <h2 class="corp-hero-title">Kademeli Kullanıcı Başı Model</h2>
        <p class="corp-hero-lead">Sabit paket yok. Ekip büyüklüğünüze göre kişi başı yıllık lisans; küçük ekipler bireysel fiyatla, büyüdükçe hacim indirimi. 50+ kullanıcıda özel teklif.</p>
      </div>
    </div>
  `
}

function renderCorpTiers() {
  const cards = CORP_TIERS.map(
    (t) => `
    <article class="corp-tier corp-tier--${esc(t.accent)}${t.featured ? ' corp-tier--featured' : ''}">
      <div class="corp-tier-icon">${CORP_ICONS[t.icon] || ''}</div>
      <div class="corp-tier-body">
        <span class="corp-tier-badge">${esc(t.badge)}</span>
        <h3 class="corp-tier-range">${esc(t.range)}</h3>
        <p class="corp-tier-model">${esc(t.model)}</p>
        <p class="corp-tier-note">${esc(t.note)}</p>
      </div>
    </article>`,
  ).join('')

  return `
    <div class="pricing-panel corp-tiers-panel" data-reveal>
      <div class="pricing-panel-head">
        <h2 class="pricing-panel-title">Kullanıcı Kademeleri</h2>
        <span class="pricing-panel-meta">Liste fiyatı yok — teklif görüşmesi</span>
      </div>
      <div class="corp-tiers-grid">${cards}</div>
      <p class="corp-tiers-foot">Kişi başı tutarlar bireysel Pro/Max referansına göre hesaplanır. Net teklif için iletişime geçin.</p>
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
        <p class="pricing-section-sub">OSGB ve çok uzmanlı yapılar için tasarlandı</p>
      </div>
      <div class="corp-benefits-grid">${items}</div>
    </div>
  `
}

function renderCorpCta() {
  const mailSubject = encodeURIComponent('İSG Atlası — Kurumsal Teklif Talebi')
  const mailBody = encodeURIComponent('Merhaba,\n\nKurumsal / OSGB teklifi almak istiyorum.\n\nFirma/OSGB adı:\nTahmini kullanıcı sayısı:\nİletişim telefonu:\n\nTeşekkürler.')
  return `
    <div class="corp-cta-band" data-reveal>
      <div class="corp-cta-glow" aria-hidden="true"></div>
      <div class="corp-cta-inner">
        <div class="corp-cta-copy">
          <h2 class="corp-cta-title">Kurumsal Teklif Alın</h2>
          <p class="corp-cta-text">Ekip büyüklüğünüzü paylaşın — size uygun kademe ve sözleşme taslağını birlikte çıkaralım.</p>
        </div>
        <div class="corp-cta-actions">
          <a href="tel:${COMPANY_PHONE}" class="btn-amber corp-cta-btn">
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true"><path d="M8 3h2l1 4-2 1a12 12 0 005 5l1-2 4 1v2a2 2 0 01-2 2A16 16 0 018 5a2 2 0 012-2z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/></svg>
            Firmayı Ara · ${esc(COMPANY_PHONE_DISPLAY)}
          </a>
          <a href="mailto:${SUPPORT_EMAIL}?subject=${mailSubject}&body=${mailBody}" class="corp-cta-btn corp-cta-btn--ghost">
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.75"/><path d="M3 7l9 6 9-6" stroke="currentColor" stroke-width="1.75"/></svg>
            ${esc(SUPPORT_EMAIL)}
          </a>
        </div>
      </div>
    </div>
  `
}

function renderCorporatePanel() {
  const hero = document.getElementById('pricing-corp-hero')
  const tiers = document.getElementById('pricing-corp-tiers')
  const benefits = document.getElementById('pricing-corp-benefits')
  const cta = document.getElementById('pricing-corp-cta')
  if (hero) hero.innerHTML = renderCorpHero()
  if (tiers) tiers.innerHTML = renderCorpTiers()
  if (benefits) benefits.innerHTML = renderCorpBenefits()
  if (cta) cta.innerHTML = renderCorpCta()
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
  renderCorporatePanel()
  void loadPricingPackages()
}

bindPricingPage()

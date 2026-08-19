/**
 * İSG Atlası — fiyatlandırma sayfası (salt okunur paket kartları)
 * Kaynak: Firestore sistem_ayarlari/fiyatlandirma_paketleri
 */

import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyB0-AXpS6ZLv5p303lW1-73r9_f4yTUPHQ',
  authDomain: 'isg-pusulasi.firebaseapp.com',
  projectId: 'isg-pusulasi',
  storageBucket: 'isg-pusulasi.firebasestorage.app',
  messagingSenderId: '585271991526',
  appId: '1:585271991526:web:4412eb38bcfd0f52fbaf27',
}

export const DEFAULT_PACKAGES = {
  normal: {
    key: 'normal',
    title: 'Normal',
    subtitle: 'Bireysel Temel Saha & Ofis',
    priceIncVat: 14000,
    priceExVat: 11666.67,
    tag: '',
    featured: false,
    features: [
      { text: 'Bireysel İSG Saha & Ofis Yönetimi', included: true },
      { text: 'Güncel Mevzuat & Form Arşivi', included: true },
      { text: 'Bireysel Lisans & Standart Destek', included: true },
      { text: 'Sesli Modül (Yok)', included: false },
      { text: 'Yapay Zeka & Görsel AI (Yok)', included: false },
    ],
  },
  pro: {
    key: 'pro',
    title: 'Pro',
    subtitle: 'Bireysel AI Destekli Uzman',
    priceIncVat: 27000,
    priceExVat: 22500,
    tag: '',
    featured: false,
    features: [
      { text: 'Normal paketin tüm özellikleri', included: true },
      { text: 'Sesli Not Alma & Hızlı Saha Raporu', included: true },
      { text: 'Yapay Zekâ (AI) İSG Danışmanı', included: true },
      { text: 'Görsel AI Fotoğraf Analizi (50 Adet)', included: true },
      { text: 'Öncelikli Bireysel Destek', included: true },
    ],
  },
  max: {
    key: 'max',
    title: 'Max',
    subtitle: 'Sınırsız AI & Tam Erişim',
    priceIncVat: 35000,
    priceExVat: 29166.67,
    tag: 'En Avantajlı & Sınırsız',
    featured: true,
    features: [
      { text: 'SINIRSIZ Yapay Zeka (AI) Asistanı', included: true, bold: true },
      { text: 'SINIRSIZ Görsel AI Risk Tespiti', included: true, bold: true },
      { text: 'SINIRSIZ Sesli Saha Notu Modülü', included: true, bold: true },
      { text: 'Tüm Sahalar & Şirketler İçin Sınırsız', included: true },
      { text: '7/24 VIP Bireysel Destek', included: true },
    ],
  },
}

const fmtMoney = (n) =>
  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

const fmtMoneyInt = (n) =>
  new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(n)

const fmtUsd = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

let usdTryRate = 34

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderFeature(f) {
  const body = f.bold ? `<strong>${esc(f.text)}</strong>` : esc(f.text)
  return `<li class="pkg-feat ${f.included ? 'yes' : 'no'}">${body}</li>`
}

function renderPackageCard(pkg) {
  const featured = pkg.featured ? ' is-featured' : ''
  const titleCls = pkg.featured ? ' pkg-title-amber' : ''
  const priceCls = pkg.featured ? ' pkg-price-amber' : ''
  const usd =
    usdTryRate > 0 ? `≈ ${fmtUsd(pkg.priceIncVat / usdTryRate)}` : '≈ — USD'
  const tag = pkg.tag ? `<span class="pkg-tag">${esc(pkg.tag)}</span>` : ''

  return `
    <article class="package-card is-static${featured}">
      ${tag}
      <div class="pkg-header">
        <div class="pkg-title${titleCls}">${esc(pkg.title)}</div>
        <div class="pkg-subtitle">${esc(pkg.subtitle)}</div>
      </div>
      <div class="pkg-price-box">
        <div class="pkg-price${priceCls}">${fmtMoneyInt(pkg.priceIncVat)} <small>TL</small></div>
        <div class="pkg-price-ex">${fmtMoney(pkg.priceExVat)} TL + KDV</div>
        <div class="pkg-price-usd">${usd}</div>
      </div>
      <ul class="pkg-features">
        ${(pkg.features || []).map(renderFeature).join('')}
      </ul>
    </article>
  `
}

function mergePackages(raw) {
  const order = ['normal', 'pro', 'max']
  return order.map((key) => {
    const base = DEFAULT_PACKAGES[key]
    const over = raw?.[key] || {}
    return {
      ...base,
      ...over,
      key,
      features: Array.isArray(over.features) && over.features.length ? over.features : base.features,
    }
  })
}

async function fetchUsdRate() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' })
    if (!res.ok) return
    const data = await res.json()
    if (data?.rates?.TRY > 0) usdTryRate = data.rates.TRY
  } catch {
    /* fallback */
  }
}

async function loadPricingPackages() {
  const grid = document.getElementById('pricing-packages-grid')
  if (!grid) return

  let packages = mergePackages(null)
  try {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const snap = await getDoc(doc(db, 'sistem_ayarlari', 'fiyatlandirma_paketleri'))
    if (snap.exists()) {
      packages = mergePackages(snap.data()?.packages || snap.data())
    }
  } catch (err) {
    console.warn('fiyatlandirma_paketleri okunamadı, varsayılan kartlar', err)
  }

  grid.innerHTML = packages.map(renderPackageCard).join('')
}

function bindPricingPage() {
  if (!document.body?.dataset?.page?.includes('pricing') && !document.getElementById('pricing-page')) return
  void fetchUsdRate().then(loadPricingPackages)
}

bindPricingPage()

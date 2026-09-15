import { TR_CITIES } from './tr-cities.js'
import { API_BASE, TURNSTILE_SITE_KEY, TURNSTILE_VERIFY_URL } from './site-config.js'
import { detectLocale, t } from './i18n.js'
import { showSiteFeedback } from './site-feedback.js'
import {
  DEFAULT_PACKAGES,
  DEFAULT_CORPORATE,
  mergeCorporate,
} from './pricing-calculator.js'

const PLATFORMS = new Set([
  'windows_android',
  'windows_ios',
  'macos_android',
  'macos_ios',
  'linux_android',
  'linux_ios',
])

const PACKAGES = new Set(['max', 'kurumsal', 'deneme'])

const NAME_MAX_WORDS = 4
const NAME_MAX_CHARS = 60
const MSG_MAX_WORDS = 40
const MSG_MAX_CHARS = 280
const ADDRESS_MIN = 8
const ADDRESS_MAX = 200

let livePackages = { ...DEFAULT_PACKAGES }
let liveCorporate = { ...DEFAULT_CORPORATE }

function msg(key, fallback) {
  try {
    return t(detectLocale(), key) || fallback
  } catch {
    return fallback
  }
}

function notify(message, kind = 'error') {
  showSiteFeedback(message, kind)
}

function wordCount(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

function validTCKN(s) {
  if (!/^[1-9][0-9]{10}$/.test(s)) return false
  const d = [...s].map((c) => c.charCodeAt(0) - 48)
  const odd = d[0] + d[2] + d[4] + d[6] + d[8]
  const even = d[1] + d[3] + d[5] + d[7]
  let d10 = ((odd * 7) - even) % 10
  if (d10 < 0) d10 += 10
  if (d10 !== d[9]) return false
  const sum = d.slice(0, 10).reduce((a, b) => a + b, 0)
  return sum % 10 === d[10]
}

function normalizePhone(raw) {
  let d = String(raw || '').replace(/\D/g, '')
  if (d.startsWith('90') && d.length >= 12) d = d.slice(2)
  if (d.startsWith('0')) d = d.slice(1)
  return d
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 120
}

function formatTL(n) {
  return new Intl.NumberFormat('tr-TR').format(Number(n) || 0) + ' TL'
}

function fillCitySelect(select) {
  if (!select || select.dataset.filled === '1') return
  select.dataset.filled = '1'
  const first = document.createElement('option')
  first.value = ''
  first.setAttribute('data-i18n', 'apply.phCity')
  first.textContent = msg('apply.phCity', 'Şehir seçin…')
  select.appendChild(first)
  for (const city of TR_CITIES) {
    const opt = document.createElement('option')
    opt.value = city
    opt.textContent = city
    select.appendChild(opt)
  }
}

function updateCounters(form) {
  const nameEl = form.querySelector('[name="adSoyad"]')
  const msgEl = form.querySelector('[name="mesaj"]')
  const nameHint = form.querySelector('[data-name-words]')
  const msgHint = form.querySelector('[data-msg-words]')
  if (nameHint && nameEl) {
    nameHint.textContent = `${wordCount(nameEl.value)}/${NAME_MAX_WORDS}`
  }
  if (msgHint && msgEl) {
    msgHint.textContent = `${wordCount(msgEl.value)}/${MSG_MAX_WORDS}`
  }
}

function getTurnstileToken() {
  const input = document.querySelector('[name="cf-turnstile-response"]')
  if (input?.value) return input.value
  try {
    if (window.turnstile && TURNSTILE_SITE_KEY) {
      const w = document.querySelector('.cf-turnstile')
      if (w) return window.turnstile.getResponse(w) || ''
    }
  } catch (_) {}
  return ''
}

async function verifyTurnstile(token) {
  if (!TURNSTILE_SITE_KEY) return true
  if (!token) return false
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    if (!res.ok) return false
    const data = await res.json()
    return !!data?.success
  } catch (err) {
    console.warn('turnstile verify failed', err)
    return false
  }
}

function queryPaket() {
  try {
    const p = new URLSearchParams(window.location.search).get('paket')
    return PACKAGES.has(String(p || '').toLowerCase()) ? String(p).toLowerCase() : ''
  } catch {
    return ''
  }
}

function querySeats() {
  try {
    const n = parseInt(new URLSearchParams(window.location.search).get('seats') || '', 10)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

function syncPaketSummary(form) {
  const sel = form.querySelector('[name="paket"]')
  const box = form.querySelector('[data-paket-summary]')
  const seatsWrap = form.querySelector('[data-seats-wrap]')
  const seatsInput = form.querySelector('[name="kullaniciSayisi"]')
  const seatsHint = form.querySelector('[data-seats-hint]')
  if (!sel || !box) return

  const key = sel.value
  const isCorp = key === 'kurumsal'
  if (seatsWrap) seatsWrap.hidden = !isCorp
  if (seatsInput) {
    seatsInput.required = isCorp
    seatsInput.min = String(liveCorporate.minSeats)
    if (!seatsInput.value || Number(seatsInput.value) < liveCorporate.minSeats) {
      seatsInput.value = String(liveCorporate.minSeats)
    }
  }

  if (key === 'max') {
    const pkg = livePackages.max || DEFAULT_PACKAGES.max
    box.hidden = false
    box.querySelector('[data-paket-title]').textContent = `İSG Atlası ${pkg.title}`
    box.querySelector('[data-paket-price]').textContent = formatTL(pkg.priceIncVat) + ' / yıl'
    box.querySelector('[data-paket-scope]').textContent = pkg.scope || pkg.subtitle || ''
    return
  }

  if (isCorp) {
    const seats = Math.max(liveCorporate.minSeats, parseInt(seatsInput?.value || '0', 10) || liveCorporate.minSeats)
    const total = liveCorporate.unitPriceIncVat * seats
    box.hidden = false
    box.querySelector('[data-paket-title]').textContent = `İSG Atlası Kurumsal · ${seats} kullanıcı`
    box.querySelector('[data-paket-price]').textContent = formatTL(total) + ' / yıl'
    box.querySelector('[data-paket-scope]').textContent =
      `${formatTL(liveCorporate.unitPriceIncVat)} × ${seats} (min ${liveCorporate.minSeats})`
    if (seatsHint) {
      seatsHint.textContent = `Minimum ${liveCorporate.minSeats} kullanıcı · ${formatTL(liveCorporate.unitPriceIncVat)} × adet`
    }
    return
  }

  if (key === 'deneme' && livePackages.deneme?.enabled !== false) {
    const pkg = livePackages.deneme
    box.hidden = false
    box.querySelector('[data-paket-title]').textContent = `İSG Atlası ${pkg.title}`
    box.querySelector('[data-paket-price]').textContent = formatTL(pkg.priceIncVat)
    box.querySelector('[data-paket-scope]').textContent = pkg.scope || ''
    return
  }

  box.hidden = true
}

function validate(payload, honeypot) {
  if (honeypot) return msg('apply.errBot', 'Doğrulama başarısız.')

  if (!PACKAGES.has(payload.paket)) {
    return msg('apply.errPackage', 'Lütfen bir paket seçin.')
  }

  if (payload.paket === 'kurumsal') {
    const seats = Number(payload.kullaniciSayisi)
    if (!Number.isFinite(seats) || seats < liveCorporate.minSeats) {
      return msg('apply.errSeats', `Kurumsal için en az ${liveCorporate.minSeats} kullanıcı seçin.`)
    }
  }

  const nameWords = wordCount(payload.adSoyad)
  if (!payload.adSoyad || nameWords < 2) {
    return msg('apply.errName', 'Ad soyad en az 2 kelime olmalı.')
  }
  if (nameWords > NAME_MAX_WORDS || payload.adSoyad.length > NAME_MAX_CHARS) {
    return msg('apply.errNameLimit', `Ad soyad en fazla ${NAME_MAX_WORDS} kelime olabilir.`)
  }

  if (!isValidEmail(payload.email)) {
    return msg('apply.errEmail', 'Geçerli bir e-posta girin.')
  }

  const phone = payload.telefon
  if (!/^\d{10}$/.test(phone) || !phone.startsWith('5')) {
    return msg('apply.errPhone', 'Telefon: başında 0 olmadan 10 hane (5xxxxxxxxx).')
  }

  if (!payload.sehir || !TR_CITIES.includes(payload.sehir)) {
    return msg('apply.errCity', 'Şehir seçin.')
  }

  if (!PLATFORMS.has(payload.platform)) {
    return msg('apply.errPlatform', 'Platform seçin.')
  }

  if (!validTCKN(payload.kimlikNo)) {
    return msg('apply.errIdentity', 'Geçerli bir TC kimlik numarası girin.')
  }

  const adres = payload.adres || ''
  if (adres.length < ADDRESS_MIN || adres.length > ADDRESS_MAX) {
    return msg('apply.errAddress', 'Lütfen geçerli bir adres girin.')
  }

  const mw = wordCount(payload.mesaj)
  if (mw > MSG_MAX_WORDS || payload.mesaj.length > MSG_MAX_CHARS) {
    return msg('apply.errMsgLimit', `Mesaj en fazla ${MSG_MAX_WORDS} kelime olabilir.`)
  }

  return null
}

async function loadLivePricing() {
  try {
    const res = await fetch(`${API_BASE}/v1/site-settings/fiyatlandirma_paketleri`)
    if (!res.ok) return
    const data = await res.json()
    if (!data || typeof data !== 'object') return

    const maxOver = data.packages?.max || data.max || {}
    const proOver = data.packages?.pro || data.pro || {}
    livePackages = {
      max: {
        ...DEFAULT_PACKAGES.max,
        ...(maxOver.priceIncVat
          ? {
              priceIncVat: Number(maxOver.priceIncVat),
              priceExVat: Number(maxOver.priceExVat) || Math.round(Number(maxOver.priceIncVat) / 1.2),
            }
          : proOver.priceIncVat
            ? {
                priceIncVat: Number(proOver.priceIncVat),
                priceExVat: Number(proOver.priceExVat) || Math.round(Number(proOver.priceIncVat) / 1.2),
              }
            : {}),
      },
      deneme: {
        ...DEFAULT_PACKAGES.deneme,
        enabled: data.packages?.deneme?.enabled === true,
      },
    }
    liveCorporate = mergeCorporate(data)
    if (!data.corporate && !data.kurumsal && proOver.priceIncVat) {
      liveCorporate.unitPriceIncVat = Number(proOver.priceIncVat)
      liveCorporate.unitPriceExVat =
        Number(proOver.priceExVat) || Math.round(liveCorporate.unitPriceIncVat / 1.2)
    }
  } catch (err) {
    console.warn('fiyat ayarları okunamadı', err)
  }
}

function refreshPaketOptions(form) {
  const sel = form.querySelector('[name="paket"]')
  if (!sel) return
  const current = sel.value
  const max = livePackages.max || DEFAULT_PACKAGES.max
  sel.innerHTML = `
    <option value="">${msg('apply.phPackage', 'Paket seçin…')}</option>
    <option value="max">Max — ${formatTL(max.priceIncVat)} / yıl</option>
    <option value="kurumsal">Kurumsal — ${liveCorporate.minSeats}+ kullanıcı</option>
  `
  if (livePackages.deneme?.enabled) {
    const opt = document.createElement('option')
    opt.value = 'deneme'
    opt.textContent = 'Deneme (test) — 10 TL'
    sel.appendChild(opt)
  }
  if (current && [...sel.options].some((o) => o.value === current)) sel.value = current
}

function bindApplyForm() {
  const form = document.querySelector('#apply-form')
  if (!form || form.dataset.bound === '1') return
  form.dataset.bound = '1'

  fillCitySelect(form.querySelector('[name="sehir"]'))

  void loadLivePricing().then(() => {
    refreshPaketOptions(form)
    const qPaket = queryPaket()
    const qSeats = querySeats()
    const paketSel = form.querySelector('[name="paket"]')
    const seatsInput = form.querySelector('[name="kullaniciSayisi"]')
    if (paketSel && qPaket) paketSel.value = qPaket
    if (seatsInput && qSeats != null) {
      seatsInput.value = String(Math.max(liveCorporate.minSeats, qSeats))
    }
    syncPaketSummary(form)
  })

  const paketSel = form.querySelector('[name="paket"]')
  if (paketSel) {
    paketSel.addEventListener('change', () => syncPaketSummary(form))
  }
  form.querySelector('[name="kullaniciSayisi"]')?.addEventListener('input', () => syncPaketSummary(form))
  form.querySelector('[name="kullaniciSayisi"]')?.addEventListener('change', () => syncPaketSummary(form))

  const phoneInput = form.querySelector('[name="telefon"]')
  phoneInput?.addEventListener('input', () => {
    let v = phoneInput.value.replace(/\D/g, '')
    if (v.startsWith('0')) v = v.slice(1)
    if (v.startsWith('90') && v.length > 10) v = v.slice(2)
    phoneInput.value = v.slice(0, 10)
  })

  const kimlikInput = form.querySelector('[name="kimlikNo"]')
  kimlikInput?.addEventListener('input', () => {
    kimlikInput.value = kimlikInput.value.replace(/\D/g, '').slice(0, 11)
  })

  form.querySelector('[name="adSoyad"]')?.addEventListener('input', () => updateCounters(form))
  form.querySelector('[name="mesaj"]')?.addEventListener('input', () => updateCounters(form))
  updateCounters(form)

  if (TURNSTILE_SITE_KEY) {
    const slot = form.querySelector('[data-turnstile-slot]')
    if (slot && !slot.dataset.ready) {
      slot.dataset.ready = '1'
      slot.innerHTML = `<div class="cf-turnstile" data-sitekey="${TURNSTILE_SITE_KEY}" data-theme="dark"></div>`
      if (!document.querySelector('script[data-turnstile]')) {
        const s = document.createElement('script')
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
        s.async = true
        s.defer = true
        s.dataset.turnstile = '1'
        document.head.appendChild(s)
      } else if (window.turnstile) {
        window.turnstile.render(slot.querySelector('.cf-turnstile'))
      }
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const fd = new FormData(form)
    const honeypot = String(fd.get('website') || '').trim()
    const kimlikRaw = String(fd.get('kimlikNo') || '').replace(/\D/g, '')
    const paket = String(fd.get('paket') || '').toLowerCase()
    const seats = parseInt(String(fd.get('kullaniciSayisi') || '0'), 10)
    const payload = {
      adSoyad: String(fd.get('adSoyad') || '').trim().replace(/\s+/g, ' '),
      email: String(fd.get('email') || '').trim().toLowerCase(),
      telefon: normalizePhone(fd.get('telefon')),
      sehir: String(fd.get('sehir') || '').trim(),
      adres: String(fd.get('adres') || '').trim().replace(/\s+/g, ' '),
      mesaj: String(fd.get('mesaj') || '').trim(),
      platform: String(fd.get('platform') || 'windows_android'),
      paket,
      kullaniciSayisi: paket === 'kurumsal' ? seats : undefined,
      kimlikNo: kimlikRaw,
      kaynak: 'tanitim_web',
    }

    const err = validate(payload, honeypot)
    if (err) {
      notify(err, 'error')
      return
    }

    if (TURNSTILE_SITE_KEY) {
      const token = getTurnstileToken()
      const ok = await verifyTurnstile(token)
      if (!ok) {
        notify(msg('apply.errCaptcha', 'Robot doğrulamasını tamamlayın.'), 'warn')
        return
      }
    }

    const btn = form.querySelector('[type="submit"]')
    const prevLabel = btn?.textContent
    if (btn) {
      btn.disabled = true
      btn.textContent = msg('apply.paying', 'Ödemeye yönlendiriliyor…')
    }

    try {
      const res = await fetch(`${API_BASE}/v1/uyelik/basvuru`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          kimlikNo: kimlikRaw,
          website: honeypot,
        }),
      })
      let data = null
      try {
        data = await res.json()
      } catch (_) {}

      if (res.status === 409 || data?.error === 'duplicate') {
        notify(msg('apply.errDuplicate', 'Bu e-posta ile daha önce ödenmiş bir kayıt var.'), 'warn')
        return
      }
      if (data?.error === 'invalid_package') {
        notify(msg('apply.errPackage', 'Lütfen bir paket seçin.'), 'error')
        return
      }
      if (data?.error === 'invalid_identity') {
        notify(msg('apply.errIdentity', 'Geçerli bir TC kimlik numarası girin.'), 'error')
        return
      }
      if (data?.error === 'payment_init_failed') {
        const detail = data?.detail ? ` (${String(data.detail).slice(0, 120)})` : ''
        notify(msg('apply.errPay', 'Ödeme başlatılamadı. Lütfen tekrar deneyin.') + detail, 'error')
        return
      }
      if (!res.ok || !data?.ok) {
        const code = data?.error ? ` [${data.error}]` : ` [HTTP ${res.status}]`
        notify(msg('apply.errSend', 'Başvuru gönderilemedi. Tekrar deneyin.') + code, 'error')
        return
      }

      if (data.pay && data.paymentPageUrl) {
        window.location.href = data.paymentPageUrl
        return
      }

      form.reset()
      updateCounters(form)
      syncPaketSummary(form)
      try {
        window.turnstile?.reset?.()
      } catch (_) {}
      notify(msg('apply.ok', 'Başvurunuz alındı. En kısa sürede sizinle iletişime geçeceğiz.'), 'success')
    } catch (err) {
      console.error(err)
      notify(msg('apply.errApiDown', 'API’ye ulaşılamıyor. Lokal API (8081) çalışıyor mu?'), 'error')
    } finally {
      if (btn) {
        btn.disabled = false
        if (prevLabel) btn.textContent = prevLabel
      }
    }
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindApplyForm)
} else {
  bindApplyForm()
}

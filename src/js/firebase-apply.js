import { TR_CITIES } from './tr-cities.js'
import { API_BASE, TURNSTILE_SITE_KEY, TURNSTILE_VERIFY_URL } from './site-config.js'
import { detectLocale, t } from './i18n.js'
import { showSiteFeedback } from './site-feedback.js'

const PLATFORMS = new Set([
  'windows_android',
  'windows_ios',
  'macos_android',
  'macos_ios',
  'linux_android',
  'linux_ios',
])

const NAME_MAX_WORDS = 4
const NAME_MAX_CHARS = 60
const MSG_MAX_WORDS = 80
const MSG_MAX_CHARS = 800

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

function normalizePhone(raw) {
  let d = String(raw || '').replace(/\D/g, '')
  if (d.startsWith('90') && d.length >= 12) d = d.slice(2)
  if (d.startsWith('0')) d = d.slice(1)
  return d
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 120
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
    const w = wordCount(nameEl.value)
    nameHint.textContent = `${w}/${NAME_MAX_WORDS}`
  }
  if (msgHint && msgEl) {
    const w = wordCount(msgEl.value)
    msgHint.textContent = `${w}/${MSG_MAX_WORDS}`
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

function validate(payload, honeypot) {
  if (honeypot) return msg('apply.errBot', 'Doğrulama başarısız.')

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

  const mw = wordCount(payload.mesaj)
  if (mw > MSG_MAX_WORDS || payload.mesaj.length > MSG_MAX_CHARS) {
    return msg('apply.errMsgLimit', `Mesaj en fazla ${MSG_MAX_WORDS} kelime olabilir.`)
  }

  return null
}

function bindApplyForm() {
  const form = document.querySelector('#apply-form')
  if (!form || form.dataset.bound === '1') return
  form.dataset.bound = '1'

  fillCitySelect(form.querySelector('[name="sehir"]'))

  const phoneInput = form.querySelector('[name="telefon"]')
  phoneInput?.addEventListener('input', () => {
    let v = phoneInput.value.replace(/\D/g, '')
    if (v.startsWith('0')) v = v.slice(1)
    if (v.startsWith('90') && v.length > 10) v = v.slice(2)
    phoneInput.value = v.slice(0, 10)
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
    const payload = {
      adSoyad: String(fd.get('adSoyad') || '').trim().replace(/\s+/g, ' '),
      email: String(fd.get('email') || '').trim().toLowerCase(),
      telefon: normalizePhone(fd.get('telefon')),
      sehir: String(fd.get('sehir') || '').trim(),
      mesaj: String(fd.get('mesaj') || '').trim(),
      platform: String(fd.get('platform') || 'windows_android'),
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
    if (btn) btn.disabled = true

    try {
      const res = await fetch(`${API_BASE}/v1/uyelik/basvuru`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, website: honeypot }),
      })
      let data = null
      try {
        data = await res.json()
      } catch (_) {}

      if (res.status === 409 || data?.error === 'duplicate') {
        notify(msg('apply.errDuplicate', 'Bu e-posta veya telefon ile daha önce başvuru yapılmış.'), 'warn')
        return
      }
      if (!res.ok || !data?.ok) {
        notify(msg('apply.errSend', 'Başvuru gönderilemedi. Tekrar deneyin.'), 'error')
        return
      }

      form.reset()
      updateCounters(form)
      try {
        window.turnstile?.reset?.()
      } catch (_) {}
      notify(msg('apply.ok', 'Başvurunuz alındı. En kısa sürede sizinle iletişime geçeceğiz.'), 'success')
    } catch (err) {
      console.error(err)
      notify(msg('apply.errSend', 'Başvuru gönderilemedi. Tekrar deneyin.'), 'error')
    } finally {
      if (btn) btn.disabled = false
    }
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindApplyForm)
} else {
  bindApplyForm()
}

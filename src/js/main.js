import '../css/main.css'
import { initI18n, LOCALES, t, detectLocale } from './i18n.js'
import { mountChrome } from './chrome.js'
import './firebase-apply.js'
import './firebase-downloads.js'

mountChrome()
const locale = initI18n()

const body = document.body
const navToggle = document.querySelector('[data-nav-toggle]')
const navClose = document.querySelector('[data-nav-close]')
const navPanel = document.querySelector('[data-nav-panel]')
const navBackdrop = document.querySelector('[data-nav-backdrop]')
const header = document.querySelector('[data-site-header]')
const intro = document.querySelector('[data-site-intro]')

function setLocked(locked) {
  body.classList.toggle('is-locked', locked)
}

function closeNav() {
  navPanel?.classList.remove('is-open')
  navBackdrop?.classList.remove('is-open')
  body.classList.remove('is-nav-open')
  navToggle?.setAttribute('aria-expanded', 'false')
  if (!intro || intro.classList.contains('is-done') || !document.body.contains(intro)) {
    setLocked(false)
  }
}

function openNav() {
  navPanel?.classList.add('is-open')
  navBackdrop?.classList.add('is-open')
  body.classList.add('is-nav-open')
  navToggle?.setAttribute('aria-expanded', 'true')
  setLocked(true)
}

if (navToggle) navToggle.addEventListener('click', () => {
  if (navPanel?.classList.contains('is-open')) closeNav()
  else openNav()
})
if (navClose) navClose.addEventListener('click', closeNav)
if (navBackdrop) navBackdrop.addEventListener('click', closeNav)
navPanel?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav))
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeNav()
})

/* Intro — Sanas timing: once per tab; ?intro forces replay */
if (intro) {
  const force = new URLSearchParams(location.search).has('intro')
  const seen = sessionStorage.getItem('isg-intro') === '1'
  if (!force && seen) {
    intro.remove()
  } else {
    body.classList.add('is-introing')
    intro.classList.add('is-enabled')
    const titleWrap = intro.querySelector('[data-intro-title]')
    const typedEl = intro.querySelector('[data-intro-typed]')
    const caretEl = intro.querySelector('[data-intro-caret]')
    const fullTitle = t(detectLocale(), 'intro.title') || 'İSG Atlası'
    const wait = (ms) => new Promise((r) => setTimeout(r, ms))
    setLocked(true)
    ;(async () => {
      titleWrap?.classList.add('is-revealing')
      await wait(500)
      const charMs = 125
      for (let i = 1; i <= fullTitle.length; i += 1) {
        if (typedEl) typedEl.textContent = fullTitle.slice(0, i)
        await wait(charMs)
      }
      caretEl?.classList.add('is-done')
      titleWrap?.classList.add('is-settled')
      titleWrap?.classList.remove('is-revealing')
      await wait(1400)
      intro.classList.add('is-done')
      sessionStorage.setItem('isg-intro', '1')
      await wait(850)
      intro.remove()
      body.classList.remove('is-introing')
      setLocked(false)
    })()
  }
}

/* Header on hero */
if (header && (body.dataset.page === 'home' || document.querySelector('[data-home-hero]'))) {
  const hero = document.querySelector('[data-home-hero], .home-hero, .page-hero')
  if (hero) {
    header.classList.add('is-on-hero')
    const sync = () => {
      header.classList.toggle('is-on-hero', hero.getBoundingClientRect().bottom > 72)
    }
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
  }
}

/* Reveal */
const reveals = document.querySelectorAll('[data-reveal]')
if (reveals.length) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach((el) => el.classList.add('is-visible'))
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
    )
    reveals.forEach((el) => io.observe(el))
  }
}

/* Language greet modal */
document.addEventListener('isg:locale', (event) => {
  const pack = LOCALES[event.detail?.locale]
  if (!pack) return
  document.querySelector('.lang-greet')?.remove()
  const overlay = document.createElement('div')
  overlay.className = 'lang-greet'
  overlay.setAttribute('aria-hidden', 'true')
  overlay.innerHTML = `<div class="lang-greet-circle"><span class="lang-greet-flag">${pack.flag}</span><span class="lang-greet-text">${pack.greet}</span></div>`
  document.body.appendChild(overlay)
  window.setTimeout(() => overlay.remove(), 2450)
})

/* Year */
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = String(new Date().getFullYear())
})

/* Email gate (download page) */
;(function setupEmailGate() {
  const API = 'https://isg-pusulasi-api-kvfsvqx7na-ew.a.run.app'
  let gatePlatform = 'windows'
  let gateUrls = {}

  window._setDownloadUrls = (urls) => {
    gateUrls = urls || {}
  }

  window.openEmailGate = (platform) => {
    gatePlatform = platform
    const overlay = document.getElementById('email-gate-overlay')
    if (!overlay) return
    overlay.style.display = 'flex'
    const msg = document.getElementById('gate-msg')
    if (msg) msg.textContent = ''
    const input = document.getElementById('gate-email')
    if (input) input.value = ''
    setTimeout(() => input?.focus(), 50)
  }

  window.closeEmailGate = () => {
    const overlay = document.getElementById('email-gate-overlay')
    if (overlay) overlay.style.display = 'none'
  }

  window.submitEmailGate = async () => {
    const email = (document.getElementById('gate-email')?.value || '').trim()
    const msg = document.getElementById('gate-msg')
    const btn = document.getElementById('gate-btn')
    const lang = detectLocale()
    if (!email || !email.includes('@')) {
      if (msg) {
        msg.textContent = t(lang, 'download.gateInvalid')
        msg.style.color = '#ef4444'
      }
      return
    }
    if (btn) {
      btn.disabled = true
      btn.textContent = '...'
    }
    try {
      const resp = await fetch(`${API}/v1/downloads/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, platform: gatePlatform }),
      })
      const data = await resp.json().catch(() => ({}))
      if (resp.status === 429) {
        if (msg) {
          msg.textContent = t(lang, 'download.gateLimit')
          msg.style.color = '#ef4444'
        }
        return
      }
      if (!resp.ok) throw new Error(data.error || 'Error')
      window.closeEmailGate()
      const urlKey = gatePlatform === 'windows' ? 'windowsUrl' : gatePlatform === 'ios' ? 'iosUrl' : 'androidUrl'
      const url = gateUrls[urlKey] || ''
      if (url && url !== '#' && !String(url).includes('ornek')) {
        const a = document.createElement('a')
        a.href = url
        a.download = ''
        a.target = '_blank'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } else {
        alert(t(lang, 'download.gateNotReady'))
      }
    } catch (e) {
      if (msg) {
        msg.textContent = e.message || 'Error'
        msg.style.color = '#ef4444'
      }
    } finally {
      if (btn) {
        btn.disabled = false
        btn.textContent = t(detectLocale(), 'download.gateSubmit')
      }
    }
  }

  document.getElementById('gate-email')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') window.submitEmailGate()
  })
  document.getElementById('email-gate-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) window.closeEmailGate()
  })
})()

void locale

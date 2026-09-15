import '../css/main.css'
import { initI18n, LOCALES, t, detectLocale } from './i18n.js'
import { mountChrome } from './chrome.js'
import { initAnalytics } from './analytics.js'
import './firebase-apply.js'
import './firebase-downloads.js'
import './pricing-calculator.js'
import { mountContactPage } from './contact-page.js'
import { initTawk } from './tawk.js'

initAnalytics()
mountChrome()
mountContactPage()
initTawk()
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
    const eyebrowEl = intro.querySelector('[data-intro-eyebrow]')
    const locale = detectLocale()
    const fullTitle = t(locale, 'intro.title') || 'İSG Atlası'
    if (eyebrowEl) eyebrowEl.textContent = t(locale, 'intro.eyebrow') || ''
    const wait = (ms) => new Promise((r) => setTimeout(r, ms))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setLocked(true)
    ;(async () => {
      titleWrap?.classList.add('is-revealing')
      if (reduce) {
        if (typedEl) typedEl.textContent = fullTitle
        caretEl?.classList.add('is-done')
        titleWrap?.classList.add('is-settled')
        titleWrap?.classList.remove('is-revealing')
        eyebrowEl?.classList.add('is-on')
        await wait(900)
      } else {
        await wait(480)
        const charMs = 145
        for (let i = 1; i <= fullTitle.length; i += 1) {
          if (typedEl) typedEl.textContent = fullTitle.slice(0, i)
          await wait(charMs)
        }
        await wait(380)
        caretEl?.classList.add('is-done')
        titleWrap?.classList.add('is-settled')
        titleWrap?.classList.remove('is-revealing')
        eyebrowEl?.classList.add('is-on')
        await wait(2400)
      }
      intro.classList.add('is-done')
      sessionStorage.setItem('isg-intro', '1')
      await wait(900)
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

void locale

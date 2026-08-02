import './firebase-apply.js'

const INTRO_KEY = 'isg-intro'
const BRAND = 'İSG Pusulası'

function setupIntro() {
  const intro = document.querySelector('.site-intro')
  if (!intro) return

  const params = new URLSearchParams(window.location.search)
  const force = params.has('intro')
  const seen = sessionStorage.getItem(INTRO_KEY) === '1'

  if (seen && !force) {
    intro.classList.add('is-done')
    intro.setAttribute('aria-hidden', 'true')
    return
  }

  const wordEl = intro.querySelector('[data-intro-word]')
  const markEl = intro.querySelector('[data-intro-mark]')
  if (markEl) markEl.hidden = false

  let i = 0
  const type = () => {
    if (!wordEl) {
      finish()
      return
    }
    if (i <= BRAND.length) {
      wordEl.innerHTML =
        BRAND.slice(0, i) + '<span class="site-intro__caret" aria-hidden="true"></span>'
      i += 1
      window.setTimeout(type, i === 1 ? 180 : 55)
    } else {
      window.setTimeout(finish, 700)
    }
  }

  const finish = () => {
    sessionStorage.setItem(INTRO_KEY, '1')
    intro.classList.add('is-done')
    intro.setAttribute('aria-hidden', 'true')
  }

  window.setTimeout(type, 280)
}

function setupReveal() {
  const nodes = document.querySelectorAll('[data-reveal]')
  if (!nodes.length) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    nodes.forEach((el) => el.classList.add('is-visible'))
    return
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  )

  nodes.forEach((el) => io.observe(el))
}

function setupMobileNav() {
  const btn = document.querySelector('[data-nav-toggle]')
  const panel = document.querySelector('[data-nav-panel]')
  if (!btn || !panel) return

  const close = () => {
    panel.classList.add('hidden')
    btn.setAttribute('aria-expanded', 'false')
  }

  btn.addEventListener('click', () => {
    const open = panel.classList.toggle('hidden') === false
    btn.setAttribute('aria-expanded', String(open))
  })

  panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', close))
}

function setupYear() {
  const el = document.querySelector('[data-year]')
  if (el) el.textContent = String(new Date().getFullYear())
}

document.addEventListener('DOMContentLoaded', () => {
  setupIntro()
  setupReveal()
  setupMobileNav()
  setupYear()
})

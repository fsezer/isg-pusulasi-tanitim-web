import { MESSAGES } from '../i18n/messages.js'

export const LOCALES = {
  tr: { code: 'tr', region: 'TR', flag: '🇹🇷', label: 'Türkçe', dir: 'ltr', greet: 'Merhaba' },
  en: { code: 'en', region: 'EN', flag: '🇬🇧', label: 'English', dir: 'ltr', greet: 'Hello' },
  de: { code: 'de', region: 'DE', flag: '🇩🇪', label: 'Deutsch', dir: 'ltr', greet: 'Hallo' },
  fr: { code: 'fr', region: 'FR', flag: '🇫🇷', label: 'Français', dir: 'ltr', greet: 'Bonjour' },
  ar: { code: 'ar', region: 'AR', flag: '🇸🇦', label: 'العربية', dir: 'rtl', greet: 'مرحبا' },
  ru: { code: 'ru', region: 'RU', flag: '🇷🇺', label: 'Русский', dir: 'ltr', greet: 'Здравствуйте' },
}

export const LOCALE_CODES = Object.keys(LOCALES)
export const DEFAULT_LOCALE = 'tr'
export const STORAGE_KEY = 'isg-lang'

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj)
}

export function detectLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && LOCALES[saved]) return saved
  } catch {
    /* ignore */
  }
  const nav = (navigator.language || '').toLowerCase()
  if (nav.startsWith('tr')) return 'tr'
  if (nav.startsWith('de')) return 'de'
  if (nav.startsWith('fr')) return 'fr'
  if (nav.startsWith('ar')) return 'ar'
  if (nav.startsWith('ru')) return 'ru'
  if (nav.startsWith('en')) return 'en'
  return DEFAULT_LOCALE
}

export function t(locale, key) {
  const pack = MESSAGES[locale] || MESSAGES[DEFAULT_LOCALE]
  const value = getByPath(pack, key)
  if (value != null) return value
  return getByPath(MESSAGES[DEFAULT_LOCALE], key) ?? key
}

function syncLangUI(lang) {
  const pack = LOCALES[lang] || LOCALES[DEFAULT_LOCALE]
  document.querySelectorAll('[data-lang-current-flag]').forEach((el) => {
    el.textContent = pack.flag
  })
  document.querySelectorAll('[data-lang-current-code]').forEach((el) => {
    el.textContent = pack.region
  })
  document.querySelectorAll('[data-set-lang]').forEach((btn) => {
    const active = btn.getAttribute('data-set-lang') === lang
    btn.classList.toggle('is-active', active)
    btn.setAttribute('aria-pressed', String(active))
  })
  const trigger = document.querySelector('[data-lang-trigger]')
  if (trigger) {
    trigger.setAttribute('aria-label', `${t(lang, 'nav.lang')}: ${pack.label}`)
  }
}

export function applyTranslations(locale) {
  const lang = LOCALES[locale] ? locale : DEFAULT_LOCALE
  const pack = LOCALES[lang]
  document.documentElement.lang = lang
  document.documentElement.dir = pack.dir

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n')
    if (!key) return
    const value = t(lang, key)
    if (el.hasAttribute('data-i18n-html')) el.innerHTML = value
    else el.textContent = value
  })

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria')
    if (!key) return
    el.setAttribute('aria-label', t(lang, key))
  })

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder')
    if (!key) return
    el.setAttribute('placeholder', t(lang, key))
  })

  const page = document.body?.dataset?.page
  if (page) {
    const title = t(lang, `meta.${page}Title`)
    if (title && title !== `meta.${page}Title`) document.title = title
    const desc = t(lang, `meta.${page}Description`)
    const meta = document.querySelector('meta[name="description"]')
    if (meta && desc && desc !== `meta.${page}Description`) meta.setAttribute('content', desc)
  }

  syncLangUI(lang)
}

export function setLocale(locale, { silent = false } = {}) {
  const lang = LOCALES[locale] ? locale : DEFAULT_LOCALE
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    /* ignore */
  }
  applyTranslations(lang)
  closeLangModal()
  if (!silent) {
    document.dispatchEvent(new CustomEvent('isg:locale', { detail: { locale: lang } }))
  }
  return lang
}

export function openLangModal() {
  const modal = document.querySelector('[data-lang-modal]')
  if (!modal) return
  modal.hidden = false
  modal.classList.add('is-open')
  document.body.classList.add('is-modal-open')
  modal.querySelector('[data-set-lang]')?.focus()
}

export function closeLangModal() {
  const modal = document.querySelector('[data-lang-modal]')
  if (!modal) return
  modal.classList.remove('is-open')
  modal.hidden = true
  document.body.classList.remove('is-modal-open')
}

export function initI18n() {
  const locale = detectLocale()
  applyTranslations(locale)

  document.querySelectorAll('[data-lang-trigger]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      openLangModal()
    })
  })

  document.querySelectorAll('[data-lang-close]').forEach((btn) => {
    btn.addEventListener('click', () => closeLangModal())
  })

  document.querySelector('[data-lang-modal]')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeLangModal()
  })

  document.querySelectorAll('[data-set-lang]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const next = btn.getAttribute('data-set-lang')
      if (next) setLocale(next)
    })
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLangModal()
  })

  return locale
}

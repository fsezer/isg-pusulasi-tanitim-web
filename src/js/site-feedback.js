import { detectLocale, t } from './i18n.js'

const SVG = {
  success: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="m8.2 12.2 2.5 2.5 5.2-5.4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  error: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="m9 9 6 6M15 9l-6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>`,
  warn: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4.2 3.8 19.2h16.4L12 4.2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v4.2M12 16.8h.01" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 11v5.5M12 8h.01" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>`,
}

const TITLES = {
  success: { key: 'apply.okTitle', fallback: 'Başarılı' },
  error: { key: 'apply.errTitle', fallback: 'Kontrol Edin' },
  warn: { key: 'common.warnTitle', fallback: 'Uyarı' },
  info: { key: 'common.infoTitle', fallback: 'Bilgi' },
}

function tr(key, fallback) {
  try {
    return t(detectLocale(), key) || fallback
  } catch {
    return fallback
  }
}

function ensureModal() {
  let root = document.getElementById('site-feedback')
  if (root) return root

  root = document.createElement('div')
  root.id = 'site-feedback'
  root.className = 'site-feedback'
  root.hidden = true
  root.innerHTML = `
    <div class="site-feedback-card" role="dialog" aria-modal="true" aria-labelledby="site-feedback-title">
      <div class="site-feedback-visual" data-feedback-visual aria-hidden="true">
        <span class="site-feedback-icon" data-feedback-icon>${SVG.info}</span>
      </div>
      <h2 class="site-feedback-title" id="site-feedback-title" data-feedback-title></h2>
      <p class="site-feedback-msg" data-feedback-msg></p>
      <button type="button" class="site-feedback-btn" data-feedback-ok>Tamam</button>
    </div>
  `
  document.body.appendChild(root)

  const close = () => hideSiteFeedback()
  root.addEventListener('click', (e) => {
    if (e.target === root) close()
  })
  root.querySelector('[data-feedback-ok]')?.addEventListener('click', close)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !root.hidden) close()
  })
  return root
}

export function hideSiteFeedback() {
  const root = document.getElementById('site-feedback')
  if (!root) return
  root.classList.remove('is-open')
  root.hidden = true
  document.body.classList.remove('is-modal-open')
}

/**
 * @param {string} message
 * @param {'success'|'error'|'warn'|'info'} [kind]
 * @param {{ title?: string }} [opts]
 */
export function showSiteFeedback(message, kind = 'info', opts = {}) {
  const root = ensureModal()
  const type = SVG[kind] ? kind : 'info'
  const titleMeta = TITLES[type]
  const title = opts.title || tr(titleMeta.key, titleMeta.fallback)

  root.dataset.kind = type
  root.querySelector('[data-feedback-icon]').innerHTML = SVG[type]
  root.querySelector('[data-feedback-title]').textContent = title
  root.querySelector('[data-feedback-msg]').textContent = message
  root.querySelector('[data-feedback-ok]').textContent = tr('common.ok', 'Tamam')

  root.hidden = false
  requestAnimationFrame(() => root.classList.add('is-open'))
  document.body.classList.add('is-modal-open')
  root.querySelector('[data-feedback-ok]')?.focus()
}

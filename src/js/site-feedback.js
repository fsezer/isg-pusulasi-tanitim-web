import { detectLocale, t } from './i18n.js'

const ICONS = {
  success: '✅',
  error: '⚠️',
  warn: '⚡',
  info: '💬',
}

const TITLES = {
  success: { key: 'apply.okTitle', fallback: 'Başvuru Alındı' },
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
        <span class="site-feedback-icon" data-feedback-icon>💬</span>
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
  const type = ICONS[kind] ? kind : 'info'
  const titleMeta = TITLES[type]
  const title = opts.title || tr(titleMeta.key, titleMeta.fallback)

  root.dataset.kind = type
  root.querySelector('[data-feedback-icon]').textContent = ICONS[type]
  root.querySelector('[data-feedback-title]').textContent = title
  root.querySelector('[data-feedback-msg]').textContent = message
  root.querySelector('[data-feedback-ok]').textContent = tr('common.ok', 'Tamam')

  root.hidden = false
  requestAnimationFrame(() => root.classList.add('is-open'))
  document.body.classList.add('is-modal-open')
  root.querySelector('[data-feedback-ok]')?.focus()
}

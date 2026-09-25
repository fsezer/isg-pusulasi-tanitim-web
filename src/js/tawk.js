/** Tawk.to canlı destek — varsayılan bubble gizli; kendi FAB ile açılır (ücretsiz). */
export const TAWK_PROPERTY_ID = '6a69e64650dea81d4cf37c6c'
export const TAWK_WIDGET_ID = '1jumqn0s0'

function openTawkChat() {
  const api = window.Tawk_API
  if (!api) return
  try {
    api.showWidget?.()
    if (typeof api.maximize === 'function') api.maximize()
    else if (typeof api.toggle === 'function') api.toggle()
  } catch (_) {
    /* ignore */
  }
}

export function initTawk() {
  const property = String(TAWK_PROPERTY_ID || '').trim()
  if (!property) return

  const widget = String(TAWK_WIDGET_ID || 'default').trim() || 'default'
  window.Tawk_API = window.Tawk_API || {}
  window.Tawk_LoadStart = new Date()

  // Varsayılan "We are here!" bubble’ı kullanma — kendi FAB’ımız var
  window.Tawk_API.customStyle = {
    visibility: {
      desktop: { position: 'br', xOffset: '18px', yOffset: '18px' },
      mobile: { position: 'br', xOffset: '12px', yOffset: '12px' },
    },
  }

  window.Tawk_API.onLoad = function onTawkLoad() {
    try {
      window.Tawk_API.hideWidget?.()
    } catch (_) {
      /* ignore */
    }
    document.documentElement.classList.add('has-tawk-ready')
  }

  window.Tawk_API.onChatMinimized = function onTawkMin() {
    try {
      window.Tawk_API.hideWidget?.()
    } catch (_) {
      /* ignore */
    }
  }

  const s1 = document.createElement('script')
  const s0 = document.getElementsByTagName('script')[0]
  s1.async = true
  s1.src = `https://embed.tawk.to/${property}/${widget}`
  s1.charset = 'UTF-8'
  s1.setAttribute('crossorigin', '*')
  s0.parentNode.insertBefore(s1, s0)

  document.documentElement.classList.add('has-tawk')

  // Chrome FAB sonradan eklenebilir — event delegation
  document.addEventListener('click', (e) => {
    const btn = e.target.closest?.('[data-tawk-open]')
    if (!btn) return
    e.preventDefault()
    openTawkChat()
  })
}

import { API_BASE } from './site-config.js'

const FALLBACK = {
  windowsUrl: '/downloads/ornek-isg-agent.zip',
  androidUrl: '/downloads/ornek-isg.apk',
  iosUrl: '',
  playStoreUrl: '',
  appStoreUrl: '',
  notes: 'Şu an örnek paketler gösteriliyor. Gerçek Agent/APK/IPA admin panelden yüklenecek.',
}

function applyLink(id, url, labelWhenReady) {
  const el = document.getElementById(id)
  if (!el) return
  if (url) {
    el.href = url
    el.removeAttribute('aria-disabled')
    if (labelWhenReady && el.querySelector('[data-store-label]')) {
      el.querySelector('[data-store-label]').textContent = labelWhenReady
    }
  } else {
    el.href = '#'
    el.addEventListener('click', (e) => {
      e.preventDefault()
      alert('Mağaza linki henüz eklenmedi. APK / Agent ile kurulum yapabilirsiniz.')
    })
  }
}

async function loadDownloads() {
  if (!document.getElementById('download-windows') && !document.getElementById('store-play')) return

  let cfg = { ...FALLBACK }
  try {
    const res = await fetch(`${API_BASE}/v1/site-settings/indirme_paketleri`)
    if (res.ok) {
      const d = await res.json()
      if (d && typeof d === 'object' && (d.windowsUrl || d.androidUrl || d.playStoreUrl)) {
        cfg = {
          windowsUrl: d.windowsUrl || FALLBACK.windowsUrl,
          androidUrl: d.androidUrl || FALLBACK.androidUrl,
          iosUrl: d.iosUrl || '',
          playStoreUrl: d.playStoreUrl || '',
          appStoreUrl: d.appStoreUrl || '',
          notes: d.notes || FALLBACK.notes,
        }
      }
    }
  } catch (err) {
    console.warn('indirme_paketleri okunamadı, örnek paketler kullanılıyor', err)
  }

  if (typeof window._setDownloadUrls === 'function') window._setDownloadUrls(cfg)

  applyLink('store-play', cfg.playStoreUrl, 'Google Play')
  applyLink('store-apple', cfg.appStoreUrl, 'App Store')

  const note = document.getElementById('download-notes')
  if (note && cfg.notes) note.textContent = cfg.notes

  const API = API_BASE
  const badge = (text) => {
    const span = document.createElement('span')
    span.className = 'inline-flex rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200'
    span.textContent = text
    return span
  }
  const fillOs = async (platform, elId) => {
    const host = document.getElementById(elId)
    if (!host) return
    try {
      const resp = await fetch(`${API}/v1/updates/check?platform=${platform}&current_code=0`)
      const data = await resp.json()
      const latest = data.latest
      if (!latest) return
      host.innerHTML = ''
      if (latest.version_name) host.appendChild(badge('v' + latest.version_name))
      if (latest.min_os) host.appendChild(badge(latest.min_os))
      else if (latest.os_family) host.appendChild(badge(latest.os_family))
    } catch (_) { /* sessiz */ }
  }
  fillOs('windows', 'os-badge-windows')
  fillOs('android', 'os-badge-android')
  fillOs('ios', 'os-badge-ios')
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    void loadDownloads()
  })
} else {
  void loadDownloads()
}

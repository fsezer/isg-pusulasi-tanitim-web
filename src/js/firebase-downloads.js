import { API_BASE } from './site-config.js'
import { detectLocale, t } from './i18n.js'
import { showSiteFeedback } from './site-feedback.js'

const FALLBACK = {
  windowsUrl: '',
  androidUrl: '',
  iosUrl: '',
  playStoreUrl: '',
  appStoreUrl: '',
  windowsVersion: '',
  androidVersion: '',
  iosVersion: '',
  notes: '',
}

let downloadCfg = { ...FALLBACK }

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
    el.setAttribute('aria-disabled', 'true')
    el.addEventListener('click', (e) => {
      e.preventDefault()
      showSiteFeedback(t(detectLocale(), 'download.gateNotReady') || 'İndirme linki henüz hazır değil.', 'warn')
    })
  }
}

function setVersionBadge(hostId, version) {
  const host = document.getElementById(hostId)
  if (!host || !version) return
  const existing = host.querySelector('[data-dl-version]')
  if (existing) {
    existing.textContent = 'v' + version
    return
  }
  const span = document.createElement('span')
  span.className = 'inline-flex rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200'
  span.dataset.dlVersion = '1'
  span.textContent = 'v' + version
  host.prepend(span)
}

function startDownload(platform) {
  const key =
    platform === 'windows' ? 'windowsUrl' : platform === 'ios' ? 'iosUrl' : 'androidUrl'
  const url = downloadCfg[key] || ''
  if (!url || url === '#' || String(url).includes('ornek')) {
    showSiteFeedback(t(detectLocale(), 'download.gateNotReady') || 'İndirme linki henüz hazır değil.', 'warn')
    return
  }
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.rel = 'noopener noreferrer'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

async function loadDownloads() {
  if (!document.getElementById('download-windows') && !document.getElementById('store-play')) return

  let cfg = { ...FALLBACK }
  try {
    const res = await fetch(`${API_BASE}/v1/site-settings/indirme_paketleri`)
    if (res.ok) {
      const d = await res.json()
      if (d && typeof d === 'object') {
        const notesRaw = String(d.notes || '').trim()
        cfg = {
          windowsUrl: d.windowsUrl || '',
          androidUrl: d.androidUrl || '',
          iosUrl: d.iosUrl || '',
          playStoreUrl: d.playStoreUrl || '',
          appStoreUrl: d.appStoreUrl || '',
          windowsVersion: d.windowsVersion || d.windowsVersionName || '',
          androidVersion: d.androidVersion || d.androidVersionName || '',
          iosVersion: d.iosVersion || d.iosVersionName || '',
          notes: notesRaw,
        }
      }
    }
  } catch (err) {
    console.warn('indirme_paketleri okunamadı', err)
  }

  downloadCfg = cfg

  applyLink('store-play', cfg.playStoreUrl, 'Google Play')
  applyLink('store-apple', cfg.appStoreUrl, 'App Store')

  const bindBtn = (id, platform) => {
    const btn = document.getElementById(id)
    if (!btn) return
    btn.onclick = (e) => {
      e.preventDefault()
      startDownload(platform)
    }
  }
  bindBtn('download-windows', 'windows')
  bindBtn('download-android', 'android')
  bindBtn('download-ios', 'ios')

  const API = API_BASE
  const badge = (text) => {
    const span = document.createElement('span')
    span.className = 'inline-flex rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200'
    span.textContent = text
    return span
  }
  const fillOs = async (platform, elId, fallbackVersion) => {
    const host = document.getElementById(elId)
    if (!host) return
    host.innerHTML = ''
    if (fallbackVersion) setVersionBadge(elId, fallbackVersion)
    try {
      const resp = await fetch(`${API}/v1/updates/check?platform=${platform}&current_code=0`)
      const data = await resp.json()
      const latest = data.latest
      if (!latest) return
      if (!fallbackVersion && latest.version_name) host.appendChild(badge('v' + latest.version_name))
      if (latest.min_os) host.appendChild(badge(latest.min_os))
      else if (latest.os_family) host.appendChild(badge(latest.os_family))
    } catch (_) {
      /* sessiz */
    }
  }
  await Promise.all([
    fillOs('windows', 'os-badge-windows', cfg.windowsVersion),
    fillOs('android', 'os-badge-android', cfg.androidVersion),
    fillOs('ios', 'os-badge-ios', cfg.iosVersion),
  ])
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    void loadDownloads()
  })
} else {
  void loadDownloads()
}

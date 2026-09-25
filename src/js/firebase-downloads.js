import { API_BASE } from './site-config.js'
import { detectLocale, t } from './i18n.js'
import { showSiteFeedback } from './site-feedback.js'

/** İndirme linkleri — Admin Sürüm & Güncelleme (app_releases / updates/check). */
const FALLBACK = {
  windowsUrl: '',
  androidUrl: '',
  playStoreUrl: '',
  windowsVersion: '',
  androidVersion: '',
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
  const key = platform === 'windows' ? 'windowsUrl' : 'androidUrl'
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

async function fetchPlatformRelease(platform) {
  const resp = await fetch(`${API_BASE}/v1/updates/check?platform=${platform}&current_code=0`)
  if (!resp.ok) return null
  const data = await resp.json()
  return data.latest || null
}

async function loadDownloads() {
  if (!document.getElementById('download-windows') && !document.getElementById('store-play')) return

  let cfg = { ...FALLBACK }
  try {
    const [win, and] = await Promise.all([
      fetchPlatformRelease('windows'),
      fetchPlatformRelease('android'),
    ])
    if (win) {
      cfg.windowsUrl = win.download_url || ''
      cfg.windowsVersion = win.version_name || ''
    }
    if (and) {
      cfg.androidUrl = and.download_url || ''
      cfg.androidVersion = and.version_name || ''
    }
  } catch (err) {
    console.warn('updates/check okunamadı', err)
  }

  downloadCfg = cfg

  applyLink('store-play', cfg.playStoreUrl || cfg.androidUrl, 'Google Play')

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
      const latest = await fetchPlatformRelease(platform)
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
  ])
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    void loadDownloads()
  })
} else {
  void loadDownloads()
}

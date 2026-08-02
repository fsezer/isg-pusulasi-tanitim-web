import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyB0-AXpS6ZLv5p303lW1-73r9_f4yTUPHQ',
  authDomain: 'isg-pusulasi.firebaseapp.com',
  projectId: 'isg-pusulasi',
  storageBucket: 'isg-pusulasi.firebasestorage.app',
  messagingSenderId: '585271991526',
  appId: '1:585271991526:web:4412eb38bcfd0f52fbaf27',
}

const FALLBACK = {
  windowsUrl: '/downloads/ornek-isg-agent.zip',
  androidUrl: '/downloads/ornek-isg.apk',
  playStoreUrl: '',
  appStoreUrl: '',
  notes: 'Şu an örnek paketler gösteriliyor. Gerçek Agent/APK admin panelden yüklenecek.',
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

document.addEventListener('DOMContentLoaded', async () => {
  let cfg = { ...FALLBACK }
  try {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const snap = await getDoc(doc(db, 'sistem_ayarlari', 'indirme_paketleri'))
    if (snap.exists()) {
      const d = snap.data()
      cfg = {
        windowsUrl: d.windowsUrl || FALLBACK.windowsUrl,
        androidUrl: d.androidUrl || FALLBACK.androidUrl,
        playStoreUrl: d.playStoreUrl || '',
        appStoreUrl: d.appStoreUrl || '',
        notes: d.notes || FALLBACK.notes,
      }
    }
  } catch (err) {
    console.warn('indirme_paketleri okunamadı, örnek paketler kullanılıyor', err)
  }

  applyLink('download-windows', cfg.windowsUrl)
  applyLink('download-android', cfg.androidUrl)
  applyLink('store-play', cfg.playStoreUrl, 'Google Play')
  applyLink('store-apple', cfg.appStoreUrl, 'App Store')

  const note = document.getElementById('download-notes')
  if (note) note.textContent = cfg.notes || FALLBACK.notes
})

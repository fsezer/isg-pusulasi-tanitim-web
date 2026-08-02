import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyB0-AXpS6ZLv5p303lW1-73r9_f4yTUPHQ',
  authDomain: 'isg-pusulasi.firebaseapp.com',
  projectId: 'isg-pusulasi',
  storageBucket: 'isg-pusulasi.firebasestorage.app',
  messagingSenderId: '585271991526',
  appId: '1:585271991526:web:4412eb38bcfd0f52fbaf27',
}

let db = null
try {
  const app = initializeApp(firebaseConfig)
  db = getFirestore(app)
} catch (err) {
  console.warn('Firebase init failed', err)
}

function setStatus(el, message, ok) {
  if (!el) return
  el.hidden = false
  el.textContent = message
  el.className = ok
    ? 'mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800'
    : 'mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800'
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#apply-form')
  const status = document.querySelector('#apply-status')
  if (!form) return

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const fd = new FormData(form)
    const payload = {
      adSoyad: String(fd.get('adSoyad') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      telefon: String(fd.get('telefon') || '').trim(),
      sehir: String(fd.get('sehir') || '').trim(),
      mesaj: String(fd.get('mesaj') || '').trim(),
      platform: String(fd.get('platform') || 'both'),
      createdAt: serverTimestamp(),
      kaynak: 'tanitim_web',
    }

    if (!payload.adSoyad || !payload.email) {
      setStatus(status, 'Lütfen ad soyad ve e-posta alanlarını doldurun.', false)
      return
    }

    if (!db) {
      setStatus(
        status,
        'Başvuru servisi şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin veya e-posta ile ulaşın.',
        false,
      )
      return
    }

    const btn = form.querySelector('[type="submit"]')
    if (btn) btn.disabled = true

    try {
      await addDoc(collection(db, 'uyelik_basvurulari'), payload)
      form.reset()
      setStatus(status, 'Başvurunuz alındı. En kısa sürede sizinle iletişime geçeceğiz.', true)
    } catch (err) {
      console.error(err)
      setStatus(
        status,
        'Başvuru gönderilemedi. Bağlantınızı kontrol edip tekrar deneyin veya bize e-posta yazın.',
        false,
      )
    } finally {
      if (btn) btn.disabled = false
    }
  })
})

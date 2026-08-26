/** Tek kaynak: canlı site URL, SEO, iletişim ve analitik */
export const SITE_ORIGIN = 'https://isgatlasi.com'
export const SITE_NAME = 'İSG Atlası'
export const COMPANY_NAME = 'İstiklal Yazılım'
export const COMPANY_URL = 'https://istiklalyazilim.com'
export const GA_MEASUREMENT_ID = 'G-FL51D5GZ85'
export const INDEXNOW_KEY = 'isgatlasi-indexnow-2026'

/** Ürün e-postaları (İSG Atlası) */
export const SUPPORT_EMAIL = 'info@isgatlasi.com'
export const SUPPORT_EMAIL_ALT = 'destek@isgatlasi.com'

/** Firma iletişim — istiklalyazilim.com ile aynı */
export const COMPANY_PHONE = '+905300130326'
export const COMPANY_PHONE_DISPLAY = '0530 013 03 26'
export const WHATSAPP_URL = 'https://wa.me/905300130326'
export const INSTAGRAM_URL = 'https://instagram.com/isgatlasi'
export const TWITTER_URL = 'https://twitter.com/isgatlasi'
export const SOCIAL_HANDLE = '@isgatlasi'
export const COMPANY_ADDRESS_LINE = 'Büyükdere Mah. Kaplanlı Cad. No:10A Odunpazarı / ESKİŞEHİR'
export const COMPANY_ADDRESS_HINT = 'Büyükdere ve Göztepe Tramvay Durakları Arasında'
export const COMPANY_MAP_YANDEX = 'https://yandex.com.tr/maps/org/istiklal_yazilim/130911416806/'
export const COMPANY_MAP_LAT = 39.7578926
export const COMPANY_MAP_LNG = 30.502264
/** Google Maps — kayıtlı işletme (place) */
export const COMPANY_MAP_GOOGLE =
  'https://www.google.com/maps/place/%C4%B0stiklal+Yaz%C4%B1l%C4%B1m/@39.7578926,30.502264,17z/data=!3m1!4b1!4m6!3m5!1s0x14cc17004a0a7245:0xe493348f71f65f3c!8m2!3d39.7578926!4d30.502264!16s%2Fg%2F11z39hjght'
/** Gömülü harita — koordinat + işletme adı (iletişim sayfası) */
export const COMPANY_MAP_EMBED =
  'https://maps.google.com/maps?q=39.7578926,30.502264+(İstiklal+Yazılım)&z=17&hl=tr&output=embed'

/** Fiyat kartları — aylık gösterim (admin/feature flag) */
export const SHOW_MONTHLY_PRICE = false

/**
 * API tabanı — lokal geliştirme localhost; canlı Cloud Run.
 * Canlıya deploy edilmeden production’a yazılmaz.
 */
const h = typeof location !== 'undefined' ? location.hostname : ''
const p = typeof location !== 'undefined' ? location.port : ''
const isViteDev = typeof import.meta !== 'undefined' && !!import.meta.env?.DEV
const isLocalHost =
  isViteDev ||
  h === 'localhost' ||
  h === '127.0.0.1' ||
  h.endsWith('.local') ||
  /^192\.168\./.test(h) ||
  /^10\./.test(h) ||
  p === '5710' ||
  p === '8080' ||
  p === '8082' ||
  p === '3010'
export const API_BASE = isLocalHost
  ? 'http://localhost:8081'
  : 'https://isg-pusulasi-api-kvfsvqx7na-ew.a.run.app'

/**
 * Cloudflare Turnstile (başvuru formu bot engeli).
 * Site key public; secret yalnız Worker env `TURNSTILE_SECRET`.
 * Boş = widget kapalı (honeypot + e-posta/tel tekillik). Canlıda tekrar doldur.
 */
export const TURNSTILE_SITE_KEY = ''
export const TURNSTILE_VERIFY_URL = '/api/turnstile'

export const SEO_VERIFICATION = {
  bing: '',
  yandex: '93273c723dc8716c',
}

export const SITEMAP_PATHS = [
  '/',
  '/ozellikler.html',
  '/windows.html',
  '/mobil.html',
  '/indir.html',
  '/fiyatlar.html',
  '/sss.html',
  '/hakkimizda.html',
  '/basvuru.html',
  '/iletisim.html',
  '/gizlilik.html',
  '/teslimat-ve-iade.html',
  '/mesafeli-satis-sozlesmesi.html',
  '/cerez-politikasi.html',
  '/kvkk.html',
  '/banka-ve-firma-bilgileri.html',
]

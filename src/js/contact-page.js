import {
  COMPANY_MAP_EMBED,
  COMPANY_MAP_GOOGLE,
  COMPANY_MAP_YANDEX,
  COMPANY_PHONE,
  INSTAGRAM_URL,
  TWITTER_URL,
} from './site-config.js'

export function mountContactPage() {
  const root = document.getElementById('contact-page')
  if (!root) return

  const iframe = root.querySelector('[data-contact-map]')
  if (iframe) iframe.setAttribute('src', COMPANY_MAP_EMBED)

  root.querySelector('[data-contact-google]')?.setAttribute('href', COMPANY_MAP_GOOGLE)
  root.querySelector('[data-contact-yandex]')?.setAttribute('href', COMPANY_MAP_YANDEX)
  root.querySelector('[data-contact-phone]')?.setAttribute('href', `tel:${COMPANY_PHONE}`)
  root.querySelector('[data-contact-instagram]')?.setAttribute('href', INSTAGRAM_URL)
  root.querySelector('[data-contact-twitter]')?.setAttribute('href', TWITTER_URL)
}

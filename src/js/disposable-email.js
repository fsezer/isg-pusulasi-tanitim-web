/** Yaygın geçici / disposable e-posta domainleri (istemci kontrolü). */
const DISPOSABLE = new Set([
  '10minutemail.com', 'guerrillamail.com', 'guerrillamail.de', 'mailinator.com',
  'tempmail.com', 'temp-mail.org', 'temp-mail.io', 'throwaway.email', 'yopmail.com',
  'sharklasers.com', 'guerrillamailblock.com', 'grr.la', 'dispostable.com',
  'maildrop.cc', 'trashmail.com', 'trashmail.me', 'fakeinbox.com', 'getnada.com',
  'moakt.com', 'emailondeck.com', 'mintemail.com', 'mytemp.email', 'tmpmail.org',
  'tmpmail.net', 'mailnesia.com', 'discard.email', 'mailcatch.com', 'tempr.email',
  'tempail.com', 'burnermail.io', 'inboxkitten.com', 'tempinbox.com', 'mohmal.com',
  'mailnull.com', 'spamgourmet.com', 'jetable.org', 'mailexpire.com',
  'temporary-mail.net', 'throwawaymail.com', 'getairmail.com', 'emailtemporanea.com',
])

export function isDisposableEmail(email) {
  const e = String(email || '').trim().toLowerCase()
  const at = e.lastIndexOf('@')
  if (at < 1) return false
  const domain = e.slice(at + 1)
  if (!domain || !domain.includes('.')) return false
  if (DISPOSABLE.has(domain)) return true
  // alt domain: foo.mailinator.com
  for (const d of DISPOSABLE) {
    if (domain.endsWith('.' + d)) return true
  }
  return false
}

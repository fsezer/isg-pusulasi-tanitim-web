/** Cloudflare Worker: isgatlasi.com → Cloud Run + Turnstile verify */
const ORIGIN = 'https://isg-tanitim-web-kvfsvqx7na-ew.a.run.app'

async function verifyTurnstile(token, secret, ip) {
  if (!secret || !token) return { success: false, 'error-codes': ['missing-input'] }
  const body = new URLSearchParams()
  body.set('secret', secret)
  body.set('response', token)
  if (ip) body.set('remoteip', ip)
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  })
  return res.json()
}

function corsJson(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  })
}

export default {
  async fetch(request, env) {
    const incoming = new URL(request.url)

    if (incoming.hostname === 'www.isgatlasi.com') {
      const bare = new URL(incoming)
      bare.hostname = 'isgatlasi.com'
      return Response.redirect(bare.toString(), 301)
    }

    if (incoming.pathname === '/api/turnstile') {
      if (request.method === 'OPTIONS') return corsJson({ ok: true })
      if (request.method !== 'POST') return corsJson({ success: false }, 405)
      try {
        const payload = await request.json()
        const token = String(payload?.token || '')
        const ip = request.headers.get('CF-Connecting-IP') || ''
        const result = await verifyTurnstile(token, env.TURNSTILE_SECRET, ip)
        return corsJson({ success: !!result.success, codes: result['error-codes'] || [] })
      } catch (e) {
        return corsJson({ success: false, error: String(e?.message || e) }, 400)
      }
    }

    const target = new URL(incoming.pathname + incoming.search, ORIGIN)
    const headers = new Headers(request.headers)
    headers.delete('host')

    const init = {
      method: request.method,
      headers,
      redirect: 'follow',
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      init.body = request.body
    }

    const response = await fetch(target.toString(), init)
    const out = new Response(response.body, response)
    out.headers.set('X-Isg-Origin', 'cloud-run')
    return out
  },
}

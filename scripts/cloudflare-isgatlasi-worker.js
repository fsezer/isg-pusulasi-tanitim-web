/** Cloudflare Worker: isgatlasi.com → Cloud Run tanıtım sitesi */
const ORIGIN = 'https://isg-tanitim-web-kvfsvqx7na-ew.a.run.app'

export default {
  async fetch(request) {
    const incoming = new URL(request.url)

    if (incoming.hostname === 'www.isgatlasi.com') {
      const bare = new URL(incoming)
      bare.hostname = 'isgatlasi.com'
      return Response.redirect(bare.toString(), 301)
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

/**
 * Cloud Run: static dist + POST /api/turnstile (Turnstile siteverify).
 * Cloudflare Worker aynı path'i yakalayabilirse orada kalır; yoksa buraya proxy edilir.
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = process.env.STATIC_ROOT || path.join(__dirname, '..', 'dist')
const PORT = Number(process.env.PORT || 8080)
const SECRET = process.env.TURNSTILE_SECRET || ''

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'content-length': Buffer.byteLength(body),
  })
  res.end(body)
}

async function readBody(req) {
  const chunks = []
  for await (const c of req) chunks.push(c)
  return Buffer.concat(chunks).toString('utf8')
}

async function verifyTurnstile(token, ip) {
  if (!SECRET || !token) return { success: false, 'error-codes': ['missing-input'] }
  const body = new URLSearchParams()
  body.set('secret', SECRET)
  body.set('response', token)
  if (ip) body.set('remoteip', ip)
  const cf = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  })
  return cf.json()
}

function safeJoin(root, urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0])
  const cleaned = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '')
  const full = path.join(root, cleaned)
  if (!full.startsWith(root)) return null
  return full
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const type = MIME[ext] || 'application/octet-stream'
  const cache =
    ext === '.html' || ext === '.xml' || ext === '.txt'
      ? 'no-cache'
      : 'public, max-age=604800'
  res.writeHead(200, { 'content-type': type, 'cache-control': cache })
  fs.createReadStream(filePath).pipe(res)
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)

  if (url.pathname === '/api/turnstile') {
    if (req.method === 'OPTIONS') return sendJson(res, 200, { ok: true })
    if (req.method !== 'POST') return sendJson(res, 405, { success: false })
    try {
      const raw = await readBody(req)
      const payload = raw ? JSON.parse(raw) : {}
      const token = String(payload?.token || '')
      const ip =
        String(req.headers['x-forwarded-for'] || '')
          .split(',')[0]
          .trim() || ''
      // remoteip gönderme — proxy arkasında yanlış IP siteverify'i bozabiliyor
      const result = await verifyTurnstile(token, '')
      return sendJson(res, 200, {
        success: !!result.success,
        codes: result['error-codes'] || [],
      })
    } catch (e) {
      return sendJson(res, 400, { success: false, error: String(e?.message || e) })
    }
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405).end('Method Not Allowed')
    return
  }

  let filePath = safeJoin(ROOT, url.pathname === '/' ? '/index.html' : url.pathname)
  if (!filePath) {
    res.writeHead(400).end('Bad Request')
    return
  }

  if (!path.extname(filePath) && !fs.existsSync(filePath)) {
    const asHtml = `${filePath}.html`
    if (fs.existsSync(asHtml)) filePath = asHtml
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html')
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.writeHead(404).end('Not Found')
    return
  }

  if (req.method === 'HEAD') {
    res.writeHead(200, { 'content-type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' })
    res.end()
    return
  }
  sendFile(res, filePath)
})

server.listen(PORT, () => {
  console.log(`isg-tanitim serve on :${PORT} root=${ROOT} turnstile=${SECRET ? 'on' : 'off'}`)
})

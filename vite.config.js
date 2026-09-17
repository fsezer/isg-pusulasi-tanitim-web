import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import {
  SITE_ORIGIN,
  SEO_VERIFICATION,
} from './src/js/site-config.js'

const pages = [
  'index', 'ozellikler', 'windows', 'mobil', 'indir', 'fiyatlar', 'sss', 'basvuru', 'iletisim', 'hakkimizda',
  'gizlilik', 'teslimat-ve-iade', 'mesafeli-satis-sozlesmesi', 'cerez-politikasi', 'kvkk', 'banka-ve-firma-bilgileri',
  'odeme-sonuc',
]

function seoHeadInject(pageName) {
  const lines = [
    '<meta name="author" content="İstiklal Yazılım" />',
    '<meta name="application-name" content="İSG Atlası" />',
    '<link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:site" content="@isgatlasi" />`,
    `<meta property="og:locale" content="tr_TR" />`,
  ]

  if (SEO_VERIFICATION.bing) {
    lines.push(`<meta name="msvalidate.01" content="${SEO_VERIFICATION.bing}" />`)
  }
  if (SEO_VERIFICATION.yandex) {
    lines.push(`<meta name="yandex-verification" content="${SEO_VERIFICATION.yandex}" />`)
  }

  if (pageName === 'index') {
    lines.push(`<link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}/" />`)
    lines.push(`<link rel="alternate" hreflang="tr" href="${SITE_ORIGIN}/" />`)
  }

  return `\n    ${lines.join('\n    ')}\n  `
}

function seoPlugin() {
  return {
    name: 'isg-seo-inject',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const pageName = ctx.filename ? ctx.filename.replace(/\\/g, '/').split('/').pop()?.replace('.html', '') : 'index'
        if (!html.includes('</head>')) return html

        const inject = seoHeadInject(pageName)
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
          .filter((line) => {
            // Zaten varsa tekrar ekleme (twitter:card olan sayfalar da diğer meta’ları alsın)
            if (line.includes('name="author"') && html.includes('name="author"')) return false
            if (line.includes('name="application-name"') && html.includes('name="application-name"')) return false
            if (line.includes('href="/llms.txt"') && html.includes('href="/llms.txt"')) return false
            if (line.includes('name="twitter:card"') && html.includes('name="twitter:card"')) return false
            if (line.includes('name="twitter:site"') && html.includes('name="twitter:site"')) return false
            if (line.includes('property="og:locale"') && html.includes('property="og:locale"')) return false
            if (line.includes('name="msvalidate.01"') && html.includes('name="msvalidate.01"')) return false
            if (line.includes('name="yandex-verification"') && html.includes('name="yandex-verification"')) return false
            if (line.includes('hreflang="x-default"') && html.includes('hreflang="x-default"')) return false
            if (line.includes('hreflang="tr"') && html.includes('hreflang="tr"')) return false
            return true
          })

        if (!inject.length) return html
        return html.replace('</head>', `\n    ${inject.join('\n    ')}\n  </head>`)
      },
    },
  }
}

/** Lokal: POST /api/turnstile → Cloudflare siteverify */
function turnstileDevPlugin(secret) {
  return {
    name: 'isg-turnstile-dev',
    configureServer(server) {
      server.middlewares.use('/api/turnstile', async (req, res, next) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }
        if (req.method !== 'POST') {
          next()
          return
        }
        try {
          const chunks = []
          for await (const c of req) chunks.push(c)
          const raw = Buffer.concat(chunks).toString('utf8')
          const payload = raw ? JSON.parse(raw) : {}
          const token = String(payload?.token || '')
          if (!secret || !token) {
            res.statusCode = 200
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify({ success: false, codes: ['missing-input'] }))
            return
          }
          const body = new URLSearchParams()
          body.set('secret', secret)
          body.set('response', token)
          const cf = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body,
          })
          const data = await cf.json()
          res.statusCode = 200
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ success: !!data.success, codes: data['error-codes'] || [] }))
        } catch (e) {
          res.statusCode = 400
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ success: false, error: String(e?.message || e) }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const turnstileSecret = env.TURNSTILE_SECRET || ''

  return {
    plugins: [tailwindcss(), seoPlugin(), turnstileDevPlugin(turnstileSecret)],
    server: {
      host: true,
      port: 5710,
      proxy: {
        '/v1': { target: 'http://127.0.0.1:8081', changeOrigin: true },
      },
    },
    build: {
      rollupOptions: {
        input: Object.fromEntries(
          pages.map((name) => [name, resolve(__dirname, `${name}.html`)]),
        ),
      },
    },
  }
})

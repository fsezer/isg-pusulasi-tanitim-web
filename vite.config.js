import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import {
  SITE_ORIGIN,
  SITE_NAME,
  SEO_VERIFICATION,
} from './src/js/site-config.js'

const pages = [
  'index', 'ozellikler', 'windows', 'mobil', 'indir', 'fiyatlar', 'sss', 'basvuru', 'iletisim', 'hakkimizda',
  'gizlilik', 'teslimat-ve-iade', 'mesafeli-satis-sozlesmesi', 'cerez-politikasi', 'kvkk', 'banka-ve-firma-bilgileri',
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
        if (html.includes('name="twitter:card"')) return html
        return html.replace('</head>', `${seoHeadInject(pageName)}</head>`)
      },
    },
  }
}

export default defineConfig({
  plugins: [tailwindcss(), seoPlugin()],
  server: {
    port: 5710,
    proxy: {
      '/v1': { target: 'http://localhost:8081', changeOrigin: true },
    },
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((name) => [name, resolve(__dirname, `${name}.html`)]),
      ),
    },
  },
})

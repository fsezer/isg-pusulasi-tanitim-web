#!/usr/bin/env node
/** IndexNow ping — deploy sonrası Bing / Yandex hızlı indeks bildirimi */
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ORIGIN = 'https://isgatlasi.com'
const KEY = 'isgatlasi-indexnow-2026'
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`

function urlsFromSitemap(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

async function ping(endpoint, urlList) {
  const body = {
    host: 'isgatlasi.com',
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  })
  const text = await resp.text()
  console.log(endpoint, resp.status, text.slice(0, 120))
}

const sitemapPath = resolve(ROOT, 'public/sitemap.xml')
const xml = readFileSync(sitemapPath, 'utf8')
const urlList = urlsFromSitemap(xml)

if (!urlList.length) {
  console.error('sitemap boş')
  process.exit(1)
}

await ping('https://api.indexnow.org/indexnow', urlList)
await ping('https://yandex.com/indexnow', urlList)
await ping('https://www.bing.com/indexnow', urlList)

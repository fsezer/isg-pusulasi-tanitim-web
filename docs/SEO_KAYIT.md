# isgatlasi.com — SEO ve arama kayıtları

Site teknik altyapısı hazır: `sitemap.xml`, `robots.txt`, `llms.txt`, schema.org, GA4, IndexNow.

## Öncelik sırası

| Platform | Neden | Kayıt |
|----------|-------|-------|
| Google Search Console | Ana trafik TR | https://search.google.com/search-console |
| Bing Webmaster Tools | Bing + **Yahoo** aynı indeks | https://www.bing.com/webmasters |
| Yandex Webmaster | Rusya / Türkiye ek görünürlük | https://webmaster.yandex.com |
| IndexNow | Bing/Yandex hızlı güncelleme | Otomatik (`npm run seo:ping`) |

> **Yahoo** ayrı panele gerek yok — sonuçlar Bing indeksinden gelir.

## 1) Google Search Console

1. Domain mülkü: `isgatlasi.com`
2. Doğrulama: DNS TXT (Cloudflare’de zaten var)
3. Sitemap gönder: `https://isgatlasi.com/sitemap.xml`

## 2) Bing Webmaster Tools

1. https://www.bing.com/webmasters → site ekle: `https://isgatlasi.com`
2. Doğrulama (birini seç):
   - **DNS CNAME** (Cloudflare’e ekle) veya
   - **Meta etiket** → kodu al, `src/js/site-config.js` içinde `SEO_VERIFICATION.bing` alanına yapıştır, deploy
3. Sitemap: `https://isgatlasi.com/sitemap.xml`
4. URL Gönder → ana sayfa

## 3) Yandex Webmaster

1. https://webmaster.yandex.com → site ekle
2. Doğrulama: meta `yandex-verification` veya DNS
3. Kodu `SEO_VERIFICATION.yandex` alanına yaz, deploy
4. Sitemap ekle

## 4) IndexNow (otomatik)

Deploy sonrası:

```bash
npm run seo:ping
```

Anahtar dosyası: `https://isgatlasi.com/isgatlasi-indexnow-2026.txt`

## 5) Yapay zeka görünürlüğü

- `robots.txt` — GPTBot, ClaudeBot, PerplexityBot vb. **Allow**
- `llms.txt` — https://isgatlasi.com/llms.txt
- Zengin schema.org (Organization + WebSite + SoftwareApplication)

Ayrı kayıt gerekmez; tarayıcılar siteyi buldukça indeksler.

## 6) İsteğe bağlı (sonra)

- **Google Business Profile** — fiziksel ofis varsa
- **LinkedIn Company Page** — kurumsal güven
- **Apple App Store Connect** — iOS çıkınca

## Deploy sonrası kontrol listesi

- [ ] https://isgatlasi.com/robots.txt
- [ ] https://isgatlasi.com/sitemap.xml
- [ ] https://isgatlasi.com/llms.txt
- [ ] Search Console sitemap
- [ ] Bing sitemap
- [ ] `npm run seo:ping`

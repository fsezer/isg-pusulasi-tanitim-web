# İSG Pusulası — Tanıtım Web

Vite 7 + Tailwind CSS v4 pazarlama sitesi (Türkçe). Üyelik başvuruları Firestore `uyelik_basvurulari` koleksiyonuna yazılır.

## Geliştirme

```bash
npm install
npm run dev
```

Yerel adres: `http://localhost:5710`

Intro’yu tekrar görmek için: `http://localhost:5710/?intro`

## Build

```bash
npm run build
npm run preview
```

Çıktı: `dist/` (`index.html`, `kvkk.html`, varlıklar).

## Deploy (Docker)

```bash
docker build -t isg-pusulasi-tanitim-web .
docker run --rm -p 8080:8080 isg-pusulasi-tanitim-web
```

Nginx `8080` dinler; `dist` statik olarak sunulur.

## Firestore kuralı (ipucu)

Tanıtım formundan **yalnızca oluşturma** yeterli; okuma/güncelleme/silme istemciye kapalı olmalı:

```
match /uyelik_basvurulari/{id} {
  allow create: if request.resource.data.keys().hasAll([
    'adSoyad', 'email', 'telefon', 'sehir', 'mesaj', 'platform', 'createdAt', 'kaynak'
  ])
  && request.resource.data.kaynak == 'tanitim_web'
  && request.resource.data.email is string
  && request.resource.data.adSoyad is string;
  allow read, update, delete: if false;
}
```

Admin paneli sunucu / yetkili hesap üzerinden okusun.

## Sayfalar

| Dosya | Açıklama |
|-------|----------|
| `index.html` | Ana tanıtım (intro, ürün, özellikler, indir, başvuru) |
| `kvkk.html` | Kısa KVKK aydınlatma stub |

## Notlar

- Logolar: `public/img/app_logo.png`, `public/img/istiklal_logo.png`
- Firebase config admin web ile aynı proje (`isg-pusulasi`)
- Store / indirme URL’leri placeholder (`#`); `data-url` veya `href` güncellenebilir

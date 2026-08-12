# İSG Pusulası — Tanıtım Web

Vite 7 + Tailwind CSS v4 çok sayfalı pazarlama sitesi. 6 dil (TR/EN/DE/FR/AR/RU), Sanas tarzı intro + dil modalı, SEO sayfaları.

## Geliştirme

```bash
npm install
npm run dev
```

Yerel: `http://localhost:5710` · Intro tekrarı: `/?intro`

## Sayfalar

| Dosya | Açıklama |
|-------|----------|
| `index.html` | Ana sayfa |
| `ozellikler.html` | Özellikler |
| `windows.html` | Windows Agent |
| `mobil.html` | Android mobil |
| `indir.html` | İndirmeler (e-posta kapısı) |
| `sss.html` | SSS |
| `basvuru.html` | Üyelik formu → Firestore |
| `iletisim.html` | İletişim |
| `kvkk.html` | KVKK stub |

## Build / Docker

```bash
npm run build
docker build -t isg-pusulasi-tanitim-web .
docker run --rm -p 8080:8080 isg-pusulasi-tanitim-web
```

Canlı: `https://isg-tanitim-web-kvfsvqx7na-ew.a.run.app`

## Deploy

```bash
gcloud run deploy isg-tanitim-web --source . --project=isg-pusulasi --region=europe-west1 --allow-unauthenticated
```

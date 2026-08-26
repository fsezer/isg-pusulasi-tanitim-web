# İSG Atlası — iyzico ödeme sistemi (Checkout Form)

Başka projede “ödeme böyle yapılsın” denince bu dosya kaynak.

## Akış

```
Tanıtım (isgatlasi.com)
  → paket seç (?paket=normal|pro|max|deneme)
  → basvuru.html form (TC zorunlu + checksum)
  → POST /v1/uyelik/basvuru
  → API iyzico CheckoutForm init
  → redirect paymentPageUrl
  → ödeme
  → iyzico → GET/POST callback
  → API retrieve + tutar/basket doğrula → odeme_durum=odendi
  → redirect /odeme-sonuc.html
  → Admin: Üyelik Başvuruları (Ödendi / Ödenmedi)
```

Lisans **otomatik açılmaz**. Admin “Müşteri yap” ile manuel.

## Repolar

| Parça | Repo | Not |
|-------|------|-----|
| API + iyzico client | `isg_pusulasi-api` | `internal/iyzico`, `handler/uyelik_basvuru.go` |
| Form + sonuç sayfası | `isg_pusulasi_tanitim_web` | `basvuru.html`, `odeme-sonuc.html`, `firebase-apply.js` |
| Admin badge | `isg_pusulasi-admin-web` | Üyelik Başvuruları listesi |

## Fiyat

Sunucu katalogu (`paketCatalog`) — istemci fiyatına güvenilmez:

| paket | TL (KDV dahil yıllık; deneme tek sefer) |
|-------|----------------------------------------|
| deneme | 10 (geçici test; canlıda bilinçli bırakılabilir) |
| normal | 17400 |
| pro | 27000 |
| max | 37200 |

## Ortam değişkenleri

### Lokal (`isg_pusulasi-api/.env` + docker compose `isgatlasi`)

```
IYZICO_API_KEY=...
IYZICO_SECRET_KEY=...
IYZICO_BASE_URL=https://api.iyzipay.com
IYZICO_CALLBACK_URL=http://127.0.0.1:8081/v1/uyelik/odeme/callback
PUBLIC_SITE_URL=http://127.0.0.1:5710
```

Tanıtım Vite: `http://127.0.0.1:5710` → `/v1` proxy → `8081`.

### Canlı (Cloud Run `isg-pusulasi-api`)

Secret Manager:

- `isg-pusulasi-iyzico-api-key` → env `IYZICO_API_KEY`
- `isg-pusulasi-iyzico-secret-key` → env `IYZICO_SECRET_KEY`

Env:

- `IYZICO_BASE_URL=https://api.iyzipay.com`
- `IYZICO_CALLBACK_URL=https://isg-pusulasi-api-kvfsvqx7na-ew.a.run.app/v1/uyelik/odeme/callback`
- `PUBLIC_SITE_URL=https://isgatlasi.com`

Deploy: `./scripts/deploy-cloudrun.sh`

## iyzico panel

**Ayarlar → IP/Back URL Yönetimi → Back URL:**

```
https://isg-pusulasi-api-kvfsvqx7na-ew.a.run.app/v1/uyelik/odeme/callback
```

IP ekleme (Cloud Run sabit egress yok). Back URL “Onay Bekleniyor” bitmeden canlı callback kırılabilir.

Taksit: paneldaki komisyon / kart ailesi. Kodda `EnabledInstallments: 1,2,3,6,9,12`.

## API uçları

| Method | Path | Kim |
|--------|------|-----|
| POST | `/v1/uyelik/basvuru` | public — kayıt + ödeme init |
| GET/POST | `/v1/uyelik/odeme/callback` | iyzico redirect |
| GET | `/v1/admin/uyelik/basvurulari` | admin |
| PATCH | `/v1/admin/uyelik/basvurulari/{id}` | admin durum |

## Güvenlik kuralları (kopyala)

1. Fiyat yalnız sunucu kataloğu.
2. `skipPay` yok sayılır; iyzico açıksa ödeme zorunlu.
3. Init cevabında `token` tarayıcıya verilmez (yalnız `paymentPageUrl`).
4. Callback: `SUCCESS` + `paidPrice` ≈ `fiyat_tl` + basket/conversation = başvuru id.
5. TC: zorunlu + TC checksum (NVI kişi sorgusu yok).
6. Ödenmiş e-posta tekrar 409; ödenmemiş güncellenir yeniden ödeme.
7. Anahtarlar git’e girmez (`.env` / Secret Manager).

## DB

Migration `015_uyelik_basvuru_odeme.sql`:

- `paket`, `paket_baslik`, `fiyat_tl`
- `odeme_durum`: `odenmedi|beklemede|odendi|basarisiz`
- `iyzico_token`, `iyzico_payment_id`, `odeme_at`

API açılışında migration runner uygular.

## Yeni projeye taşıma checklist

1. Bu dosyadaki akış + güvenlik maddeleri.
2. iyzico Checkout Form (HMAC IYZWSv2) — `internal/iyzico/client.go`.
3. Callback URL HTTPS public + panel Back URL whitelist.
4. Secret Manager / env; asla istemciye secret yok.
5. Admin’de ödeme durumu görünür olsun.
6. Küçük tutarlı test paketi (deneme) → sonra kapat.

## Smoke test

1. Site → paket → form → iyzico sayfası açılır.
2. Ödeme tamam → `odeme-sonuc.html?status=success`.
3. Admin → başvuru **Ödendi**.
4. Aynı e-posta tekrar → 409.

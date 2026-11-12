# RasaRuang Web Self-Order (Dine-In QR Table Ordering)

Prototipe interaktif dibuat sesuai PRD "Website Self-Order RasaRuang".

## Cara Menjalankan
Buka `index.html` di browser (klik dua kali). Tidak perlu instalasi atau build.

- Simulasi scan QR meja: `index.html?table=12` (otomatis memakai Meja #08 jika tanpa parameter)
- Untuk presentasi di laptop: tampilan otomatis terpusat (lebar 440px) dengan latar cokelat gelap.
- Agar tampil seperti di HP: DevTools → Toggle device toolbar (Ctrl+Shift+M).

## Struktur
```
index.html              # Seluruh layar (Katalog, Bottom Sheet, Checkout, Pembayaran, Status)
styles.css              # Design system (palet warna logo, tipografi, komponen)
app.js                  # Data menu, state keranjang (LocalStorage), router, logika harga
manifest.webmanifest    # Siap PWA
assets/logo.jpg         # Logo RasaRuang
assets/menu/*.jpg       # Foto 12 menu
```

## Pengaturan Cepat (`app.js` → `CONFIG`)
- `TAX_RATE` — Pajak PB1 (default 0.10, isi 0 untuk menonaktifkan)
- `SERVICE_FEE` — Biaya layanan dine-in (default 0)
- `PAY_TIMEOUT_SEC` — Batas waktu pembayaran (default 600 detik = 10:00)
- `FIRST_ORDER_NO` — Nomor pesanan pertama (default 84 → #RR-084)

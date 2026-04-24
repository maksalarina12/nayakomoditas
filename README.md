# SIPANGAN — Sistem Informasi Pangan Nasional

Dashboard pemantauan harga bahan pokok dengan analitik AI & sustainability.

## Deploy ke GitHub Pages (repo: `nayakomoditas`)

Project ini sudah dikonfigurasi **khusus** untuk repo bernama `nayakomoditas`,
sehingga URL akhirnya:

```
https://<username>.github.io/nayakomoditas/
```

### Langkah 1 — Push ke GitHub
Di Lovable: **GitHub** (kanan atas) → **Connect to GitHub** → **Create Repository**.
Beri nama repo **persis**: `nayakomoditas`.

> Kalau Anda ingin nama repo lain, ubah `basePath` di `vite.config.ts` dan
> `VITE_BASE_PATH` di `.github/workflows/deploy.yml` agar sama dengan
> `/<nama-repo>/`. Untuk repo `<username>.github.io`, pakai `/`.

### Langkah 2 — Aktifkan permission workflow
1. Buka repo di GitHub → **Settings** → **Actions** → **General**.
2. Scroll ke **Workflow permissions** → pilih **Read and write permissions** → **Save**.

### Langkah 3 — Tunggu workflow pertama
1. Buka tab **Actions**. Workflow `Deploy to GitHub Pages` jalan otomatis.
2. Tunggu job **build-and-deploy** ✅ hijau (~2 menit).
3. Workflow membuat branch `gh-pages` berisi hasil build.

### Langkah 4 — Aktifkan GitHub Pages
1. **Settings** → **Pages**.
2. **Source**: **Deploy from a branch**.
3. **Branch**: **`gh-pages`** + folder **`/ (root)`** → **Save**.
4. Tunggu ~1 menit, URL muncul di atas halaman Pages.

### Kalau halaman blank putih
Penyebab paling umum: base path tidak sinkron. Pastikan ketiganya konsisten:
- `vite.config.ts` → `basePath = "/nayakomoditas/"`
- `.github/workflows/deploy.yml` → `VITE_BASE_PATH: /nayakomoditas/`
- `src/router.tsx` → otomatis baca `import.meta.env.BASE_URL`
- Nama repo di GitHub: `nayakomoditas`

### Build lokal
```bash
bun install
bun run dev
bun run build
```

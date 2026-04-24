# SIPANGAN — Sistem Informasi Pangan Nasional

Dashboard pemantauan harga bahan pokok dengan analitik AI & sustainability.

## Deploy gratis ke GitHub Pages (step-by-step)

Project ini dikonfigurasi sebagai **Static SPA** dan otomatis deploy ke branch `gh-pages` setiap kali ada push ke `main`.

### Langkah 1 — Push ke GitHub
Di Lovable: **GitHub** (kanan atas) → **Connect to GitHub** → **Create Repository**.
Beri nama repo, misal `sipangan`.

### Langkah 2 — Aktifkan permission workflow
1. Buka repo di GitHub → **Settings** → **Actions** → **General**.
2. Scroll ke **Workflow permissions** → pilih **Read and write permissions** → **Save**.

### Langkah 3 — Tunggu workflow pertama
1. Buka tab **Actions** di repo. Workflow `Deploy to GitHub Pages` akan otomatis jalan setelah Langkah 2.
2. Tunggu sampai job **build-and-deploy** ✅ hijau (~2 menit).
3. Workflow akan membuat branch baru bernama `gh-pages` berisi hasil build.

### Langkah 4 — Aktifkan GitHub Pages dari branch
1. Buka **Settings** → **Pages**.
2. Pada **Build and deployment**:
   - **Source**: pilih **Deploy from a branch**
   - **Branch**: pilih **`gh-pages`** dan folder **`/ (root)`** → **Save**.
3. Tunggu ~1 menit. URL preview tampil di bagian atas halaman Pages:
   ```
   https://<username>.github.io/<nama-repo>/
   ```

### Catatan teknis
- `VITE_BASE_PATH` di workflow otomatis di-set ke `/<nama-repo>/` agar asset path benar.
- File `_shell.html` (output TanStack static SPA) otomatis disalin jadi `index.html` + `404.html` agar deep link & refresh tidak 404.
- Kalau Anda host di repo bernama `<username>.github.io` (user/organization page), edit `.github/workflows/deploy.yml` dan ubah `VITE_BASE_PATH` jadi `/`.

### Build lokal

```bash
bun install
bun run dev      # development
bun run build    # static build → dist/client
```

# SIPANGAN — Sistem Informasi Pangan Nasional

Dashboard pemantauan harga bahan pokok dengan analitik AI & sustainability.

## Deploy gratis ke GitHub Pages

Project sudah dikonfigurasi sebagai **Static SPA** sehingga bisa di-host gratis di GitHub Pages.

### Langkah

1. **Push project ke repo GitHub** (gunakan tombol GitHub di Lovable: _Connectors → GitHub → Connect project_, lalu _Create Repository_).
2. Di repo GitHub, buka **Settings → Pages**, lalu pada bagian _Source_ pilih **GitHub Actions**.
3. Workflow `.github/workflows/deploy.yml` akan otomatis build & deploy setiap kali ada push ke branch `main`.
4. Setelah workflow selesai (~2 menit), URL preview tersedia di:
   ```
   https://<username>.github.io/<nama-repo>/
   ```

### Catatan teknis

- `VITE_BASE_PATH` di workflow otomatis di-set ke `/<nama-repo>/` agar asset path benar.
- File `_shell.html` (output TanStack static SPA) otomatis disalin jadi `index.html` + `404.html` agar deep link & refresh tidak 404.
- Kalau Anda host di repo bernama `<username>.github.io` (user/organization page), edit workflow dan ubah `VITE_BASE_PATH` jadi `/`.

### Build lokal

```bash
bun install
bun run dev      # development
bun run build    # static build → dist/client
```

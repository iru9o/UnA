# Up n Atom Kitchen Dashboard

Dashboard manajemen operasional dapur dan penjualan untuk Resto Up n Atom di server IME Roleplay Indonesia. Dashboard ini membantu kru dapur mengelola menu harian, mencatat riwayat transaksi, menghitung pembagian komisi staff, serta menyusun iklan promosi restoran.

## Fitur Utama

- **Menu Harian & Apipi**: Menampilkan menu makanan dan minuman aktif beserta rincian resep, bahan, durasi masak, serta stasiun kerja (cutting board, stove, fry station, drink station).
- **Pencatatan Penjualan**: Form pencatatan transaksi penjualan paket makanan (Reguler, Custom, Delivery, Catering, Apipi) dengan perhitungan otomatis PPN (5%), potongan perusahaan (70%), dan komisi staff (30% + ongkos kirim).
- **Statistik & Laporan**: Menampilkan ringkasan pendapatan hari ini dan total penjualan kumulatif secara langsung.
- **Generator Iklan (Announce)**: Menyediakan variasi teks promosi otomatis untuk perintah `/joball` di dalam server kota, lengkap dengan fitur acak teks (shuffle) dan hitungan batas karakter (maksimal 250 karakter).
- **Pencarian Resep**: Kamus resep lengkap untuk mempercepat proses masak kru di dapur berdasarkan jenis stasiun kerja.

## Teknologi

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Penyimpanan**: Browser LocalStorage
- **Bahasa**: TypeScript

## Deployment ke GitHub Pages

Aplikasi ini dapat di-deploy secara gratis ke GitHub Pages karena sudah dikonfigurasi sebagai *static export* dan berjalan sepenuhnya di sisi client.

### 1. Konfigurasi Subpath (Jika Diperlukan)
Jika aplikasi diakses melalui alamat sub-direktori bawaan GitHub Pages (misalnya `https://username.github.io/nama-repo/`), Anda perlu menambahkan konfigurasi `basePath` di `next.config.js` agar aset gambar dan script dapat dimuat dengan benar:

```javascript
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/nama-repo', // Ganti dengan nama repositori GitHub Anda
}
```
*Catatan: Jika Anda menggunakan Custom Domain (misalnya `https://kitchen.domainanda.com`), Anda tidak perlu menambahkan `basePath`.*

### 2. Cara Deploy Menggunakan GitHub Actions (Rekomendasi)
Anda dapat menggunakan GitHub Actions untuk melakukan build dan deploy otomatis setiap kali Anda melakukan push ke branch `main`:

1. Buat folder `.github/workflows/` di direktori utama proyek Anda.
2. Buat file baru bernama `deploy.yml` di dalam folder tersebut dan isi dengan kode berikut:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches:
         - main

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: "pages"
     cancel-in-progress: false

   jobs:
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4
         - name: Setup Node
           uses: actions/setup-node@v4
           with:
             node-version: "20"
             cache: npm
         - name: Install dependencies
           run: npm ci
         - name: Build
           run: npm run build
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: ./out
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```
3. Buka halaman repositori Anda di GitHub, pilih menu **Settings** > **Pages**.
4. Pada bagian **Build and deployment** > **Source**, pilih **GitHub Actions**.
5. Push kode Anda ke GitHub, dan proses deploy akan berjalan otomatis secara latar belakang.

## Cara Menjalankan Secara Lokal

### Prasyarat
- Node.js (versi 18 ke atas)
- npm atau yarn

### Langkah Instalasi

1. Clone repositori ini ke komputer lokal Anda:
   ```bash
   git clone <url-repositori-anda>
   cd <nama-folder-repositori>
   ```

2. Instal seluruh dependensi proyek:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan (development server):
   ```bash
   npm run dev
   ```

4. Buka browser dan akses alamat berikut:
   ```
   http://localhost:3000
   ```

## Penyimpanan Data (LocalStorage)

Aplikasi ini berjalan sepenuhnya di sisi client (browser). Seluruh riwayat transaksi disimpan langsung di dalam penyimpanan lokal browser (LocalStorage) pada komputer Anda.

Catatan penting:
- Data transaksi Anda tetap aman dan privat di dalam komputer Anda sendiri.
- Jika Anda mengakses aplikasi ini dari browser atau perangkat lain, data transaksi Anda sebelumnya tidak akan tersinkronisasi atau muncul di perangkat tersebut.

# Up n Atom Kitchen Dashboard

Dashboard manajemen operasional dapur dan penjualan untuk Resto Up n Atom di server IME Roleplay Indonesia. Dashboard ini membantu kru dapur mengelola menu harian, mencatat riwayat transaksi, menghitung pembagian komisi staff, serta menyusun iklan promosi restoran.

Aplikasi dapat diakses langsung secara online melalui: [iru9o.github.io/UnA](https://iru9o.github.io/UnA/)

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

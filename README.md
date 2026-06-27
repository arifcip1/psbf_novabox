# Smart Inventory Management System

Aplikasi manajemen inventaris kelas *Enterprise SaaS* berbasis web. Dibuat menggunakan arsitektur *decoupled* modern (Node.js Backend + React.js Frontend).

## 🚀 Persyaratan Sistem (Prerequisites)
Pastikan komputer Anda sudah terinstal:
- **Node.js** (Disarankan versi 18 atau 20 LTS)
- **NPM** (Bawaan dari instalasi Node.js)

---

## 🛠️ Cara Menjalankan Program

Karena aplikasi ini terbagi menjadi dua bagian (*Backend* dan *Frontend*), Anda harus membuka **dua buah Terminal (Command Prompt / PowerShell)** untuk menjalankannya secara bersamaan.

### Langkah 1: Jalankan Server Backend
Backend bertanggung jawab atas logika bisnis, penyimpanan memori, dan penyediaan API.

1. Buka Terminal pertama.
2. Pindah ke folder backend:
   ```bash
   cd "C:\collage\SEMESTER 4\PSBF\inventaris\backend"
   ```
3. Install semua pustaka yang dibutuhkan (hanya perlu dilakukan sekali):
   ```bash
   npm install
   ```
4. Jalankan server:
   ```bash
   node server.js
   ```
5. Jika berhasil, akan muncul pesan `Server is running on port 5000`. **Biarkan terminal ini tetap terbuka.**

### Langkah 2: Jalankan Server Frontend (UI)
Frontend adalah antarmuka visual yang dilihat dan dioperasikan oleh pengguna di Browser.

1. Buka Terminal *kedua*.
2. Pindah ke folder frontend:
   ```bash
   cd "C:\collage\SEMESTER 4\PSBF\inventaris\frontend"
   ```
3. Install semua pustaka yang dibutuhkan (hanya perlu dilakukan sekali):
   ```bash
   npm install
   ```
4. Jalankan *Vite Development Server*:
   ```bash
   npm run dev
   ```
5. Jika berhasil, akan muncul tulisan `➜  Local:   http://localhost:5173/`. 

### Langkah 3: Buka Aplikasi di Browser
1. Buka *Google Chrome*, *Firefox*, atau browser pilihan Anda.
2. Kunjungi alamat: **http://localhost:5173**
3. Masuk dengan akun *default*:
   - **Email:** `admin@smartinventory.com`
   - **Sandi:** `admin123`

---

## Fitur Utama:
- Dasbor analitik (Nilai aset, jumlah barang kritis)
- *QR Code Generator* & *Scanner* (Gunakan kamera untuk mencari/update barang)
- Ekspor / Impor Data menggunakan file `.csv` (Excel)
- Pencatatan Otomatis *Audit Log* / Riwayat Mutasi Keluar-Masuk Barang
- Dukungan Multi-Lokasi Penyimpanan

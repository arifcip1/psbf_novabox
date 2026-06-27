# PANDUAN CEPAT HOSTING GRATIS (DEADLINE 2 JAM)

Jangan panik! Aplikasi Anda secara pemrograman **sudah 100% siap** untuk di-_hosting_. Saya baru saja mengubah pengaturan di `axios.js` agar aplikasinya pintar mendeteksi apakah ia sedang berjalan secara lokal atau sedang di internet.

Ikuti panduan _Copy-Paste_ ini secara berurutan. Ini hanya akan memakan waktu sekitar **20-30 Menit** jika Anda fokus!

---

## 1. Siapkan Akun (Lakukan Sekarang)
Buka tab peramban (_browser_) baru dan segera daftar menggunakan **Akun GitHub** Anda di ketiga situs ini:
1. **GitHub** (Pasti Anda sudah punya).
2. **Aiven** ([aiven.io](https://aiven.io/)) $\rightarrow$ Untuk Database MySQL gratis.
3. **Render** ([render.com](https://render.com/)) $\rightarrow$ Untuk Backend Node.js.
4. **Vercel** ([vercel.com](https://vercel.com/)) $\rightarrow$ Untuk Frontend React.

---

## 2. Unggah Kode ke GitHub
1. Buka akun GitHub Anda.
2. Buat **Repository Baru** (Beri nama misal: `novabox-inventaris`), biarkan kosong.
3. Buka Terminal di VS Code Anda (pastikan berada di folder `inventaris` utama), lalu ketikkan perintah berikut secara berurutan:
   ```bash
   git init
   git add .
   git commit -m "Siap Hosting"
   git branch -M main
   git remote add origin https://github.com/USERNAME-ANDA/novabox-inventaris.git
   git push -u origin main
   ```
   *(Ganti `USERNAME-ANDA` dengan username GitHub Anda).*

---

## 3. Setup Database (Aiven)
1. Buka [Aiven Console](https://console.aiven.io/).
2. Klik **Create Service** $\rightarrow$ Pilih **MySQL** $\rightarrow$ Pilih paket **Free Plan**.
3. Tunggu 2 menit sampai _database_ aktif.
4. Di halaman detail layanan tersebut, cari bagian **Connection Information** (atau "Service URI").
5. Anda akan mendapatkan URL yang bentuknya mirip seperti ini: `mysql://avnadmin:password_panjang@mysql-xxx.aivencloud.com:20885/defaultdb?ssl-mode=REQUIRED`. **Simpan (Copy) URL ini**.

---

## 4. Hosting Backend (Render)
1. Buka *Dashboard* [Render](https://dashboard.render.com/).
2. Klik **New +** $\rightarrow$ Pilih **Web Service**.
3. Pilih **"Build and deploy from a Git repository"** $\rightarrow$ Hubungkan ke repository GitHub `novabox-inventaris` yang baru Anda buat.
4. Pada kolom isian, isi sebagai berikut:
   * **Name:** `novabox-api` (bebas).
   * **Root Directory:** `backend` *(SANGAT PENTING! Jangan salah ketik).*
   * **Runtime:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `node server.js`
5. *Scroll* ke bawah ke bagian **Environment Variables** (Klik *Advanced*), lalu tambahkan:
   * **Key:** `DATABASE_URL` | **Value:** *(Paste URL dari Aiven di Langkah 3).*
   * *(Catatan: Kita perlu memodifikasi sedikit `db.js` jika menggunakan URL panjang. Tapi tenang, karena Anda mepet deadline, lebih aman masukkan satuan seperti ini)*:
     * **Key:** `DB_HOST` | **Value:** `mysql-xxx.aivencloud.com` (Dari Aiven).
     * **Key:** `DB_USER` | **Value:** `avnadmin` (Dari Aiven).
     * **Key:** `DB_PASSWORD` | **Value:** `password_panjang` (Dari Aiven).
     * **Key:** `DB_NAME` | **Value:** `defaultdb` (Dari Aiven).
     * **Key:** `JWT_SECRET` | **Value:** `apapun_bebas_rahasia`.
6. Klik **Create Web Service**. Tunggu sampai statusnya "Live".
7. Perhatikan di pojok kiri atas, Anda akan diberi Link API (Misal: `https://novabox-api.onrender.com`). **Simpan (Copy) Link ini**.

---

## 5. Hosting Frontend (Vercel)
1. Buka *Dashboard* [Vercel](https://vercel.com/dashboard).
2. Klik **Add New...** $\rightarrow$ **Project**.
3. *Import* repository `novabox-inventaris` dari GitHub Anda.
4. Pada bagian *Configure Project*:
   * **Framework Preset:** Pilih `Vite`.
   * **Root Directory:** Edit dan pilih folder `frontend`.
5. Buka tab **Environment Variables** dan tambahkan:
   * **Name:** `VITE_API_URL`
   * **Value:** *(Paste Link API Render dari Langkah 4.7)* + `/api` (Contoh: `https://novabox-api.onrender.com/api`).
6. Klik **Deploy**.
7. Tunggu confetti (kertas warna-warni) muncul di layar. Vercel akan memberi Anda Link aplikasi web Anda (Misal: `https://novabox-inventaris.vercel.app`).

**SELESAI!**
Kumpulkan Link Vercel tersebut ke Dosen Anda. Selamat atas bonus nilainya!

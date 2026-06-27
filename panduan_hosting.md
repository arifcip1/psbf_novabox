# PANDUAN CEPAT HOSTING GRATIS (DEADLINE 2 JAM)

Jangan panik! Aplikasi Anda secara pemrograman **sudah 100% siap** untuk di-_hosting_. Saya baru saja mengubah pengaturan di `axios.js` agar aplikasinya pintar mendeteksi apakah ia sedang berjalan secara lokal atau sedang di internet.

Ikuti panduan _Copy-Paste_ ini secara berurutan. Ini hanya akan memakan waktu sekitar **20-30 Menit** jika Anda fokus!

---

## 1. Siapkan Akun (Lakukan Sekarang)
Buka tab peramban (_browser_) baru dan segera daftar menggunakan **Akun GitHub** Anda di dua situs ini:
1. **GitHub** (Pasti Anda sudah punya).
2. **Aiven** ([aiven.io](https://aiven.io/)) $\rightarrow$ Untuk Database MySQL gratis.
3. **Netlify** ([netlify.com](https://netlify.com/)) $\rightarrow$ Untuk Backend Node.js & Frontend React.

---

## 2. Unggah Kode ke GitHub
1. Buka akun GitHub Anda.
2. Buat **Repository Baru** (Beri nama misal: `novabox-inventaris`), biarkan kosong.
3. Buka Terminal di VS Code Anda (pastikan berada di folder `inventaris` utama), lalu ketikkan perintah berikut secara berurutan:
   ```bash
   git init
   git add .
   git commit -m "Siap Hosting 100% Netlify"
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

## 4. Hosting Backend (Netlify)
1. Buka *Dashboard* [Netlify](https://app.netlify.com/).
2. Klik **Add new site** $\rightarrow$ **Import an existing project**.
3. Hubungkan dengan GitHub dan pilih repository `novabox-inventaris`.
4. Pada bagian *Site settings*, sesuaikan isian ini:
   * **Base directory:** `backend` *(SANGAT PENTING!)*
   * **Build command:** `npm install`
   * **Publish directory:** *(kosongkan saja)*
5. Buka tab **Environment variables** (Show advanced) dan tambahkan variabel ini:
   * **Key:** `DB_URL` | **Value:** *(Paste URL MySQL dari Aiven di Langkah 3).*
6. Klik **Deploy site**.
7. Tunggu sampai statusnya _Published_. Setelah selesai, Netlify akan memberi Anda Link API publik (Misal: `https://acak-backend.netlify.app`). **Simpan (Copy) Link ini**.

---

## 5. Hosting Frontend (Netlify)
1. Kembali ke beranda utama [Netlify](https://app.netlify.com/).
2. Sekali lagi, klik **Add new site** $\rightarrow$ **Import an existing project**.
3. Pilih repository `novabox-inventaris` yang sama persis seperti tadi.
4. Pada bagian *Site settings*, kali ini sesuaikan isiannya menjadi:
   * **Base directory:** `frontend`
   * **Build command:** `npm run build`
   * **Publish directory:** `frontend/dist`
5. Buka tab **Environment variables** (Show advanced) dan tambahkan:
   * **Key:** `VITE_API_URL`
   * **Value:** *(Paste Link API Backend dari Langkah 4.7)* + `/api` (Contoh: `https://acak-backend.netlify.app/api`).
6. Klik **Deploy site**.
7. Netlify akan membangun frontend Anda dan memberikan URL publik final.

**SELESAI!**
Kumpulkan Link Netlify (Frontend) tersebut ke Dosen Anda. Selamat atas bonus nilainya!

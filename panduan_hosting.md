# PANDUAN CEPAT HOSTING GRATIS (DEADLINE 2 JAM)

Jangan panik! Aplikasi Anda secara pemrograman **sudah 100% siap** untuk di-_hosting_. Saya baru saja mengubah pengaturan di `axios.js` agar aplikasinya pintar mendeteksi apakah ia sedang berjalan secara lokal atau sedang di internet.

Ikuti panduan _Copy-Paste_ ini secara berurutan. Ini hanya akan memakan waktu sekitar **20-30 Menit** jika Anda fokus!

---

## 1. Siapkan Akun (Lakukan Sekarang)
Buka tab peramban (_browser_) baru dan segera daftar menggunakan **Akun GitHub** Anda di ketiga situs ini:
1. **GitHub** (Pasti Anda sudah punya).
2. **Aiven** ([aiven.io](https://aiven.io/)) $\rightarrow$ Untuk Database MySQL gratis.
3. **Koyeb** ([koyeb.com](https://koyeb.com/)) $\rightarrow$ Untuk Backend Node.js (Tanpa Kartu Kredit).
4. **Netlify** ([netlify.com](https://netlify.com/)) $\rightarrow$ Untuk Frontend React.

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

## 4. Hosting Backend (Koyeb)
1. Buka *Dashboard* [Koyeb](https://app.koyeb.com/) dan login dengan GitHub.
2. Klik tombol **Deploy** $\rightarrow$ Pilih **GitHub**.
3. Pilih repository `novabox-inventaris` Anda.
4. Pada bagian *Configure*:
   * Pilih tipe **Web Service**.
   * Di bagian **Builder**, pilih **Buildpack** (jangan Docker).
   * **Work directory:** `backend` *(SANGAT PENTING! Jangan salah ketik)*.
   * **Run command:** Kosongkan (Koyeb akan otomatis mendeteksi Node.js).
5. Buka tab **Environment variables** dan tambahkan:
   * **Key:** `DB_URL` | **Value:** *(Paste URL MySQL dari Aiven di Langkah 3).*
   * *(Opsional: Jika menggunakan satuan variabel, Anda bisa memasukkan DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET seperti di file .env)*
6. Di bagian *Instance*, pastikan Anda memilih tipe **Free / Eco**.
7. Klik **Deploy**.
8. Setelah selesai, Koyeb akan memberi Anda Link API publik. **Simpan (Copy) Link ini**.

---

## 5. Hosting Frontend (Netlify)
1. Buka *Dashboard* [Netlify](https://app.netlify.com/).
2. Klik **Add new site** $\rightarrow$ **Import an existing project**.
3. Hubungkan dengan GitHub dan pilih repository `novabox-inventaris`.
4. Pada bagian *Site settings*:
   * **Base directory:** `frontend`
   * **Build command:** `npm run build`
   * **Publish directory:** `frontend/dist`
5. Buka tab **Environment variables** (Show advanced) dan tambahkan:
   * **Key:** `VITE_API_URL`
   * **Value:** *(Paste Link API Koyeb dari Langkah 4.8)* + `/api` (Contoh: `https://novabox-api.koyeb.app/api`).
6. Klik **Deploy site**.
7. Netlify akan membangun web Anda dan memberikan URL publik.

**SELESAI!**
Kumpulkan Link Netlify tersebut ke Dosen Anda. Selamat atas bonus nilainya!

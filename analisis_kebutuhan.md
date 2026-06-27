# TAHAP 1: RESUME 3 APLIKASI SEJENIS

Dalam merancang sistem inventaris "NovaBox", kami melakukan studi literatur dan observasi terhadap 3 aplikasi manajemen stok yang sudah ada di pasaran. Berikut adalah resume dari ketiga aplikasi tersebut:

## 1. Jurnal.id (Mekari)
* **Informasi Website:** Jurnal.id adalah *software* akuntansi dan inventaris *cloud-based* yang ditargetkan untuk UKM di Indonesia. Sistem ini mengintegrasikan pencatatan keuangan dengan pergerakan barang.
* **Proses Utama (Menu Penting):** Menu "Manajemen Stok / Produk".
* **Proses & Data yang Digunakan:** 
  Proses utamanya adalah pelacakan multi-gudang dan penyesuaian stok (*stock opname*). Data yang digunakan meliputi SKU barang, nama barang, harga beli rata-rata (*moving average*), batas stok minimum, dan riwayat mutasi perpindahan barang antar gudang.

## 2. Odoo (Modul Inventory)
* **Informasi Website:** Odoo adalah aplikasi ERP (*Enterprise Resource Planning*) *open-source* global yang memiliki modul *Inventory* yang sangat komprehensif.
* **Proses Utama (Menu Penting):** Menu "Inventory / Operations".
* **Proses & Data yang Digunakan:** 
  Proses utamanya adalah *Double-Entry Inventory* (tidak ada barang yang hilang, hanya berpindah lokasi). Data yang digunakan meliputi *Location* (lokasi rak/gudang), *Serial Number/Lot*, kuantitas produk, dan *Lead Time* (waktu tunggu pemesanan).

## 3. Moka POS (Modul Manajemen Stok)
* **Informasi Website:** Moka POS adalah aplikasi Kasir (Point of Sales) yang memiliki fitur manajemen stok di *back-office* mereka, cocok untuk *retail* dan *F&B*.
* **Proses Utama (Menu Penting):** Menu "Ingredient / Item Library".
* **Proses & Data yang Digunakan:** 
  Proses utamanya adalah pemotongan stok otomatis saat terjadi penjualan di kasir (*Real-time Deduction*). Data yang digunakan meliputi daftar *item/ingredient*, resep (kalkulasi bahan baku), peringatan stok rendah (*low stock alert*), dan daftar *Supplier*.

---

# TAHAP 2: REQUIREMENT APLIKASI NOVABOX

## 1. Deskripsi Aplikasi
**NovaBox** adalah aplikasi Sistem Manajemen Inventaris Berbasis Web yang dirancang dengan desain antarmuka *Neo-Brutalism* modern. Aplikasi ini berfungsi untuk membantu pemilik usaha dan staf gudang dalam mencatat pergerakan barang secara mutakhir (*real-time*), memberikan peringatan dini jika ada barang yang hampir habis, serta mengkalkulasi valuasi aset yang ada di dalam gudang secara otomatis. Aplikasi ini dibangun eksklusif menggunakan ekosistem JavaScript (React.js untuk *Frontend* dan Node.js/Express untuk *Backend*).

## 2. Data yang Digunakan
Sistem ini mengelola beberapa entitas data utama yang disimpan di dalam *database* MySQL:
* **Data Kredensial (Aktor):** Nama lengkap, Email, Kata Sandi (*Bcrypt Hashed*), dan Peran/Role (Super Admin, Admin, Manajer, Staff Gudang).
* **Data Produk:** Kode SKU unik, Nama Produk, Kategori, Lokasi Rak, Stok Aktual, Batas Minimum Stok, Harga Beli (Modal), Harga Jual, dan URL Foto Produk.
* **Data Transaksi (Mutasi):** ID Produk referensi, Jenis Mutasi (Masuk/Keluar), Jumlah unit yang dimutasi, dan *Timestamp* pencatatan.

## 3. Alur dari Fungsi Utama (*Main Function*)
Fungsi utama NovaBox adalah **Dashboard Analitik & Quick Stock**, dengan alur sebagai berikut:
1. **Otentikasi & Penentuan Akses (RBAC):** Pengguna masuk (Login). Node.js memvalidasi *password* dan memberikan token JWT berisi Peran pengguna. React.js membaca token ini untuk menyembunyikan atau menampilkan tombol sensitif (seperti menu "Hapus" yang hanya untuk Admin).
2. **Pengambilan Data (Fetch Data):** Sistem memanggil data dari tabel `tb_products`. 
3. **Komputasi Status Inventaris:** Algoritma *Backend* mengevaluasi data:
   * Jika `Stok = 0` $\rightarrow$ Status **Habis** (Merah).
   * Jika `Stok <= Batas Minimum` $\rightarrow$ Status **Butuh Re-stock** (Kuning).
   * Jika di luar kondisi di atas $\rightarrow$ Status **Aman** (Hijau).
4. **Kalkulasi Finansial:** Menjumlahkan (`Stok Aktual` $\times$ `Harga Beli`) dari seluruh barang untuk menghasilkan **Total Nilai Aset Gudang**.
5. **Quick Stock Update (Tombol +/-):** Saat staf menekan tombol (+), React.js memanggil *Endpoint PATCH* di Node.js. Server menambahkan stok di `tb_products` dan otomatis menyuntikkan catatan ke `tb_stock_logs` tanpa mengubah halaman.

---

# TAHAP 3: PEMBATASAN HAK AKSES (ROLE-BASED ACCESS CONTROL)

Sistem otentikasi pada aplikasi ini mengadopsi mekanisme RBAC (*Role-Based Access Control*) untuk menjaga integritas data dan rahasia perusahaan. Setelah pengguna masuk, sistem membedakan antarmuka UI dan batas API berdasarkan 3 tingkatan aktor:

## 1. Super Admin / Admin
* **Deskripsi:** Pemilik sistem atau pengelola utama aplikasi.
* **Hak Akses Penuh (Full Access):**
  * Memiliki kendali penuh (*Create, Read, Update, Delete*) terhadap seluruh data produk di sistem.
  * Bisa menambah barang baru, mengedit informasi barang yang salah, hingga menghapus barang dari basis data.
  * Dapat melihat *Dashboard Analytics* (Kalkulasi Nilai Aset, Grafik Proporsi Inventaris, Estimasi Anggaran Belanja).
  * Bebas memodifikasi profil akun dan *password* pribadi.
  * Mengakses riwayat mutasi (*Stock Logs*).

## 2. Manajer
* **Deskripsi:** Pengawas tingkat menengah yang berfokus pada pengambilan keputusan, namun tidak mengoperasikan gudang secara fisik.
* **Hak Akses Supervisi (View-Only & Analytics):**
  * **TIDAK BISA** menambah, mengedit, atau menghapus data produk (tombol "Tambah Barang", "Edit", dan "Hapus" otomatis disembunyikan oleh sistem).
  * Namun, Manajer **DIBERIKAN AKSES** untuk melihat *Dashboard Analytics* lengkap (Nilai Aset Makro, Anggaran Belanja, Grafik Chart).
  * Bisa melihat seluruh *Stock Logs* (Riwayat Mutasi) untuk keperluan *monitoring*.
  * Bebas memodifikasi profil akun dan *password* pribadi.

## 3. Staff Gudang
* **Deskripsi:** Eksekutor lapangan yang kesehariannya bertugas menata barang fisik di rak penyimpanan.
* **Hak Akses Operasional Terbatas:**
  * **TIDAK BISA** melihat *Dashboard Analytics* finansial (Grafik dan angka triliunan/miliaran nilai aset otomatis disembunyikan agar rahasia dagang perusahaan aman).
  * **TIDAK BISA** menambah, mengedit deskripsi, atau menghapus barang permanen.
  * **BISA** melihat tabel inventaris barang, status, dan lokasi rak.
  * **HANYA BISA** melakukan penyesuaian (*Quick Stock Update*) menggunakan tombol _Plus_ (+) untuk barang masuk dan _Minus_ (-) untuk barang keluar. Ini ditujukan untuk kerja cepat tanpa harus repot membuka form penuh.
  * Bebas memodifikasi profil akun dan *password* pribadi.

---

# TAHAP 4: DAFTAR FILE PENGKODEAN WEBSITE (STRUKTUR PROGRAM)

Untuk memenuhi persyaratan penjelasan program, berikut adalah daftar nama-nama file utama yang kami gunakan dalam proses pengkodean (*coding*) beserta fungsinya:

## A. Bagian Backend (Folder `backend/`)
Berisi logika peladen (Node.js) dan basis data (MySQL):
1. **`server.js`** : Berfungsi sebagai file utama (*entry point*) dari API Backend. File ini memuat konfigurasi _routing_ Express.js, algoritma logika status barang, fitur unggah foto (`multer`), dan otentikasi JWT.
2. **`db.js`** : Berfungsi untuk mengatur koneksi (*Connection Pool*) antara Node.js dengan database MySQL menggunakan `mysql2/promise`.
3. **`init_db.js`** : Berfungsi sebagai skrip migrasi untuk menciptakan tabel-tabel di dalam database MySQL secara otomatis (`tb_users`, `tb_products`, `tb_stock_logs`).
4. **`.env`** : Berfungsi untuk menyimpan variabel rahasia lingkungan (seperti kata sandi database dan kunci rahasia JWT).

## B. Bagian Frontend (Folder `frontend/src/`)
Berisi antarmuka visual (React.js + Tailwind CSS):
1. **`App.jsx`** : File induk *Frontend* yang mengatur sistem navigasi jalur (_React Router_), seperti rute ke `/login`, `/dashboard`, `/profile`, dan memblokir akses jika pengguna belum masuk (*ProtectedRoute*).
2. **`main.jsx`** : File pengikat utama yang me-render aplikasi React ke dalam file HTML *browser*.
3. **`api/axios.js`** : File konfigurasi yang mengatur komunikasi (HTTP Request) dari React ke Backend. File ini secara otomatis menyisipkan Token JWT ke setiap _request_ agar diizinkan oleh server.
4. **`context/AuthContext.jsx`** : Mengelola *Global State* untuk sesi pengguna. Di sinilah logika *Login*, *Logout*, dan penyimpanan data akun berjalan di latar belakang.
5. **`pages/Login.jsx` & `pages/Register.jsx`** : Berisi tampilan antarmuka (UI) form untuk pengguna baru mendaftar atau pengguna lama masuk ke dalam sistem.
6. **`pages/Dashboard.jsx`** : Halaman utama (Fungsi Utama) tempat tabel inventaris berada, beserta grafik *Chart.js* (khusus Admin) dan fitur pencarian (*Search*).
7. **`pages/InventoryForm.jsx`** : Halaman UI berbentuk formulir untuk fitur *Create* dan *Update* (Menambah atau Mengedit) data produk beserta fotonya.
8. **`pages/Profile.jsx`** : Halaman pengaturan akun tempat setiap aktor bisa merubah nama, email, hingga *password* baru.
9. **`pages/StockLogs.jsx`** : Halaman untuk menampilkan tabel riwayat mutasi barang (kapan barang masuk/keluar dan oleh siapa).
10. **`components/Navbar.jsx`** : Komponen UI navigasi atas (berisi logo NovaBox, nama aktor, jabatan, dan tombol keluar) yang selalu muncul di setiap halaman.

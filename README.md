# Altura Sinergi - Core Branding Engine & Mini-CRM

## Ikhtisar
Altura Sinergi adalah aplikasi web monolitik yang dibangun menggunakan kerangka kerja Laravel dan antarmuka React via Inertia.js. Sistem ini berfungsi sebagai titik sentuh digital utama (Landing Page) yang terintegrasi penuh dengan Content Management System (CMS) dan Mini-CRM (Manajemen Prospek/Leads) untuk menangkap dan melacak pertanyaan bisnis secara mulus.

Platform ini dirancang khusus untuk memenuhi kebutuhan bisnis B2B penyedia layanan dan infrastruktur, memberdayakan administrator sistem untuk secara berkelanjutan memperbarui portofolio, memodifikasi peran pengguna, dan memantau jalur masuk calon klien.

## Tumpukan Teknologi (Technology Stack)
- **Backend:** Laravel 11.x (PHP 8.2+)
- **Frontend:** React 18.x via Inertia.js
- **Styling:** Tailwind CSS (dikonfigurasikan untuk Dashboard modular bertema gelap)
- **Database:** MySQL / MariaDB
- **Routing:** Ziggy (Client-Side Laravel Routing)
- **Editor:** Tiptap (Pembuatan Teks Kaya / Rich Text)
- **Grafik:** Recharts (Visualisasi Data)
- **Drag & Drop:** Dnd-Kit (Elemen Interaktif yang Dapat Diurutkan)

## Arsitektur Sistem
Aplikasi ini memanfaatkan arsitektur berlapis (multi-layered architecture) yang ketat pada logika backend untuk menegakkan pemisahan perhatian (separation of concerns) dan memaksimalkan skalabilitas.

- **Lapisan Controller:** Secara khusus menangani HTTP request yang masuk, variabel sesi, dan definisi respons Inertia. Tidak ada logika bisnis utama yang disematkan pada lapisan ini.
- **Lapisan Service:** Menyelesaikan skema logika yang kompleks, manipulasi data lintas entitas, serta penanganan penyimpanan/penghapusan berkas.
- **Lapisan Repository:** Sebuah lapisan abstraksi yang secara eksplisit berinteraksi dengan Eloquent Model untuk memastikan kueri basis data tetap modular dan dapat digunakan kembali.
- **Berbasis Antarmuka (Interface Driven):** Menerapkan kontrak antarmuka (`Contracts/BaseRepositoryInterface.php`) yang memastikan kompatibilitas polimorfik dan struktur standar yang ketat di seluruh modul sistem.

## Fitur Utama
1. **CMS Landing Page Dinamis**
   - Hero Section yang dapat disunting dengan pemformatan warna Rich Text dan animasi yang dapat dinyalakan/dimatikan.
   - Metrik Bisnis yang dapat dikelola dengan operasi drag and drop.
   - Proposisi Nilai (Value Propositions) yang dinamis.
   - Integrasi Informasi Layanan dengan validasi sistem.
   - Konfigurasi Profil Perusahaan terpusat dengan angka metrik historis perusahaan.
   - Manajemen *Footer* ringkas dan pengaturan konfigurasi SEO master.
2. **CMS Studi Kasus & Portofolio**
   - Manajemen CRUD ekstensif untuk dokumentasi operasi spesifik skenario B2B.
   - Pengelolaan logo dan parameter visibilitas modul Daftar Klien.
3. **Mini-CRM Pipeline (Manajemen Prospek/Leads)**
   - Integrasi otomatis formulir pengajuan penawaran dari situs muka langsung menuju Pipeline.
   - Status siklus hidup klien yang modular: `New`, `Contacted`, `Deal Won`, `Rejected`.
4. **Insight Dashboard (Pusat Wawasan Operasional)**
   - Visualisasi tren harian prospek Mini-CRM, metrik aktivitas langsung, yang semuanya divisualisasikan melalui Recharts fungsional.
5. **Role-Based User Management (Manajemen Pengguna)**
   - Autorisasi terpusat memanfaatkan hierarki peran dan kewenangan (`Super Admin`, `Admin`, `Editor`).

## Instalasi & Persiapan

### Prasyarat
- PHP 8.2 atau lebih baru
- Composer
- Node.js (v18+) dan npm/yarn
- Database Relasional (MySQL, PostgreSQL, atau SQLite)

### Prosedur
1. **Klon Repositori**
   ```bash
   git clone <repository-url>
   cd altura_sinergi
   ```

2. **Dependensi Backend**
   ```bash
   composer install
   ```

3. **Pengaturan Lingkungan**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Catatan: Perbarui variabel di dalam file `.env` dan letakkan penekanan/fokus utama pada kredensial koneksi basis data Anda (`DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).*

4. **Tautan Penyimpanan Berkas (Storage Links)**
   Langkah ini wajib dilakukan untuk menghubungkan direktori publik agar aplikasi dapat mengelola berkas/aset CMS yang diunggah secara publik:
   ```bash
   php artisan storage:link
   ```

5. **Migrasi & Seeding Database**
   ```bash
   php artisan migrate --seed
   ```

6. **Dependensi Frontend & Kompilasi**
   ```bash
   npm install
   npm run build
   ```
   *(Untuk sesi pengembangan aktif/live-reload, gunakan `npm run dev` di tab terminal terpisah).*

7. **Peluncuran Server (Development)**
   ```bash
   php artisan serve
   ```
   Akses aplikasi secara global melalui peramban pada `http://localhost:8000`. Dasbor administratif diakses melalui tautan `/admin`.

## Ikhtisar Struktur Direktori
```text
altura_sinergi/
├── app/
│   ├── Http/Controllers/Web/Admin/   # Lapisan presentasi Controller
│   ├── Models/                       # Entitas ORM (Eloquent)
│   ├── Modules/                      # Pengelompokan spesifik fitur (berisi Service & Repository)
│   │   ├── CmsService/
│   │   ├── Dashboard/
│   │   ├── LandingPage/
│   │   └── Leads/
│   └── Repositories/                 # Abstraksi dan Kontrak Standar Repository Dasar
├── database/
│   ├── migrations/                   # Skrip generasi skema tabel basis data
│   └── seeders/                      # Entri data master/fiktif awal sistem
├── public/                           # Aset statis terbuka ke publik
├── resources/
│   ├── js/
│   │   ├── Components/               # Komponen Atom & Makro React Global
│   │   ├── Layouts/                  # Cetak biru tata letak kerangka Inertia
│   │   └── Pages/Admin/              # Seluruh halaman React tunggal per entitas administratif
│   └── views/                        # Tampilan peluncur inti sistem Blade Middleware (app.blade.php)
└── routes/
    ├── web.php                       # Endpoint halaman terautentikasi dan tamu (guest)
    └── api.php                       # Rute data API modular (jika disematkan)
```

## Kerentanan Keamanan
Jika Anda mendesak menemukan kelemahan/kerentanan pada sisi keamanan aplikasi ini, mohon agar dapat melaporkan vektor anomali tersebut secara langsung via saluran internal ke pihak yang berwenang. Anda tidak diperkenankan untuk mengungkap celah kerentanan maupun bug secara publik.

## Lisensi Perangkat Lunak
Perangkat lunak berbasis web ini memiliki status perangkat lunak hak milik (Proprietary Software). Menyalin, memodifikasi, menggabungkan, mendistribusikan ulang, atau mengeksploitasikan modifikasi dari rilis aplikasi secara publik secara komersial maupun sebaliknya tanpa ada izin dokumentasi persetujuan organisasi, sangat dilarang.

# Delcom Auction (Vue 3)

Aplikasi web lelang daring yang dibangun menggunakan Vue 3, Pinia, dan Tailwind CSS v4. Aplikasi ini mengonsumsi REST API Delcom Auction sebagai sumber data dan mendukung autentikasi pengguna, pengelolaan profil, pembuatan lelang, serta pengajuan penawaran (bid).

Proyek ini dikerjakan sebagai bagian dari tugas mata kuliah Pengembangan Aplikasi Web (PABWE) 2026, Studi Kasus 1 (Praktikum 5, VueJS).

## Informasi Pengembang

| Keterangan | Detail |
| --- | --- |
| Nama | lysonmnk |
| Username / ID | ifs24024 |
| Mata Kuliah | Pengembangan Aplikasi Web (PABWE) 2026 |
| Repositori | ifs24024-pabwe2026-sk-p5-vue |

## Daftar Isi

1. [Fitur Utama](#fitur-utama)
2. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
3. [Prasyarat](#prasyarat)
4. [Instalasi](#instalasi)
5. [Konfigurasi Environment](#konfigurasi-environment)
6. [Menjalankan Aplikasi](#menjalankan-aplikasi)
7. [Pengujian](#pengujian)
8. [Struktur Proyek](#struktur-proyek)
9. [Daftar Rute](#daftar-rute)
10. [Integrasi API](#integrasi-api)
11. [Lisensi](#lisensi)

## Fitur Utama

### Autentikasi
- Registrasi akun baru dan login pengguna.
- Penyimpanan token akses pada `localStorage` dengan pengiriman otomatis melalui header `Authorization: Bearer <token>`.
- Validasi formulir dan notifikasi dialog interaktif menggunakan SweetAlert2.

### Profil dan Pengguna
- Direktori seluruh pengguna sistem.
- Pembaruan data profil, unggah foto avatar, dan penggantian kata sandi.

### Lelang (Auction)
- Dashboard lelang dengan tab filter: Semua Lelang, Lelang Saya, Lelang Berlangsung, dan Lelang Ditutup.
- Pencarian judul dan deskripsi secara langsung (live search).
- Pembuatan, pengubahan, dan penghapusan item lelang, termasuk pergantian foto cover.
- Deskripsi barang berformat Markdown menggunakan Toast UI Editor.
- Pengajuan dan pembatalan penawaran (bid) dengan validasi nominal harus lebih tinggi dari penawaran tertinggi saat ini.
- Halaman detail lelang yang memuat cover, deskripsi, dan riwayat penawar.
- Penghapusan seluruh lelang milik pengguna.

### Kualitas dan Pengujian
- Pengujian unit dan integrasi menggunakan Vitest dan Testing Library.
- Ambang batas cakupan kode (coverage threshold) 100% menggunakan provider v8.

## Teknologi yang Digunakan

| Kategori | Teknologi |
| --- | --- |
| Runtime dan Package Manager | Bun |
| Framework | Vue 3 (JavaScript) |
| Build Tool | Vite |
| State Management | Pinia |
| Routing | Vue Router |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Ikon | lucide-vue-next |
| Tipografi | Plus Jakarta Sans (Google Fonts) |
| Dialog Notifikasi | SweetAlert2 |
| Editor Markdown | @toast-ui/editor |
| Pengujian | Vitest, jsdom, @testing-library/vue, @testing-library/jest-dom |

## Prasyarat

Pastikan perangkat lunak berikut telah terpasang:

- [Bun](https://bun.sh) versi terbaru
- [Git](https://git-scm.com)

## Instalasi

1. Clone repositori:

   ```bash
   git clone https://github.com/lysonmnk/ifs24024-pabwe2026-sk-p5-vue.git
   cd ifs24024-pabwe2026-sk-p5-vue
   ```

2. Pasang seluruh dependensi:

   ```bash
   bun install
   ```

3. Salin berkas contoh environment:

   ```bash
   cp .env.example .env
   ```

   Pada Windows (Command Prompt), gunakan:

   ```bash
   copy .env.example .env
   ```

## Konfigurasi Environment

Aplikasi membaca konfigurasi dari berkas `.env`. Contoh isi berkas:

```env
VITE_DELCOM_BASEURL=https://open-api.delcom.org/api/v1
APP_PORT=5173
```

| Variabel | Deskripsi | Nilai Default |
| --- | --- | --- |
| `VITE_DELCOM_BASEURL` | Base URL REST API Delcom | `https://open-api.delcom.org/api/v1` |
| `APP_PORT` | Port server pengembangan lokal | `5173` |

Konstanta `DELCOM_BASEURL` didefinisikan pada `vite.config.js` dan diarahkan ke `https://open-api.delcom.org/api/v1`.

## Menjalankan Aplikasi

Mode pengembangan:

```bash
bun run dev
```

Build produksi:

```bash
bun run build
```

Pratinjau hasil build:

```bash
bun run preview
```

Aplikasi dapat diakses melalui `http://localhost:<APP_PORT>`.

## Pengujian

Menjalankan seluruh pengujian:

```bash
bun run test
```

Menjalankan pengujian beserta laporan cakupan kode:

```bash
bun run test:coverage
```

Konfigurasi Vitest menggunakan lingkungan `jsdom` dengan berkas setup `src/setupTests.js`. Utilitas pengujian `renderWithProviders` dan `createMockPinia` pada `src/test-utils.js` digunakan untuk merender komponen yang terhubung dengan Pinia dan router berbasis memori.

Cakupan pengujian meliputi:

- Helper (`apiHelper`, `toolsHelper`) dan custom hook (`useInput`)
- API caller pada setiap fitur
- Pinia store
- Komponen navigasi dan modal
- Layout dan halaman
- Integrasi aplikasi (`App.test.js`)

> Catatan: nama skrip pada perintah di atas mengikuti konfigurasi pada `package.json`. Sesuaikan apabila nama skrip berbeda.

## Struktur Proyek

```text
.
├── public/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api/            # authApi.js
│   │   │   ├── layouts/        # AuthLayout.vue
│   │   │   ├── pages/          # LoginPage.vue, RegisterPage.vue
│   │   │   └── states/         # authStore.js
│   │   ├── users/
│   │   │   ├── api/            # userApi.js
│   │   │   ├── pages/          # UsersPage.vue, ProfilePage.vue
│   │   │   └── states/         # usersStore.js
│   │   ├── aucations/
│   │   │   ├── api/            # aucationApi.js
│   │   │   ├── components/     # Navbar, Sidebar, MarkdownEditor, MarkdownViewer
│   │   │   │   └── modals/     # AddModal, ChangeModal, ChangeCoverModal, BidModal
│   │   │   ├── layouts/        # AucationLayout.vue
│   │   │   ├── pages/          # HomePage.vue, DetailPage.vue
│   │   │   └── states/         # aucationsStore.js
│   │   └── common/
│   │       └── pages/          # NotFoundPage.vue
│   ├── helpers/                # apiHelper.js, toolsHelper.js
│   ├── hooks/                  # useInput.js
│   ├── App.vue
│   ├── index.css
│   ├── main.js
│   ├── router.js
│   ├── setupTests.js
│   └── test-utils.js
├── .env.example
├── Jenkinsfile
├── index.html
├── package.json
└── vite.config.js
```

## Daftar Rute

| Path | Komponen | Akses | Keterangan |
| --- | --- | --- | --- |
| `/auth/login` | `LoginPage.vue` | Publik | Halaman login |
| `/auth/register` | `RegisterPage.vue` | Publik | Halaman registrasi |
| `/` | `HomePage.vue` | Terproteksi | Daftar dan filter lelang |
| `/aucations/:aucationId` | `DetailPage.vue` | Terproteksi | Detail lelang dan riwayat penawaran |
| `/users` | `UsersPage.vue` | Terproteksi | Direktori pengguna |
| `/profile` | `ProfilePage.vue` | Terproteksi | Profil dan pengaturan akun |
| `/:pathMatch(.*)*` | `NotFoundPage.vue` | Publik | Halaman 404 |

## Integrasi API

Sumber data: [Delcom Open API - Aucations](https://open-api.delcom.org/docs/1.0/api-aucations)

### Autentikasi

| Metode | Endpoint | Fungsi |
| --- | --- | --- |
| POST | `/auth/register` | Registrasi akun baru |
| POST | `/auth/login` | Login pengguna |

### Pengguna

| Metode | Endpoint | Fungsi |
| --- | --- | --- |
| GET | `/users` | Daftar pengguna |
| GET | `/users/me` | Profil pengguna aktif |
| PUT | `/users/me` | Pembaruan profil |
| POST | `/users/me/photo` | Unggah foto avatar |
| PUT | `/users/me/password` | Ganti kata sandi |

### Lelang

| Metode | Endpoint | Fungsi |
| --- | --- | --- |
| GET | `/aucations` | Daftar lelang (filter `is_me`, `is_closed`) |
| GET | `/aucations/:id` | Detail lelang |
| POST | `/aucations` | Tambah lelang (`title`, `description`, `start_bid`, `closed_at`) |
| PUT | `/aucations/:id` | Ubah data lelang |
| POST | `/aucations/:id/cover` | Unggah atau ganti cover |
| DELETE | `/aucations/:id` | Hapus lelang |
| POST | `/aucations/:id/bids` | Ajukan penawaran |
| DELETE | `/aucations/:id/bids` | Batalkan penawaran |
| DELETE | `/aucations` | Hapus seluruh lelang milik pengguna |

## Lisensi

Proyek ini dibuat untuk keperluan akademik. Seluruh hak cipta atas kode pada repositori ini dimiliki oleh pengembang, lysonmnk (ifs24024).

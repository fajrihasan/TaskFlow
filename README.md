# TaskFlow

TaskFlow adalah aplikasi dashboard sederhana untuk mengelola pekerjaan. Saat ini aplikasi menyediakan sidebar responsif dengan tiga menu: **Dashboard**, **My Task**, dan **Settings**.

## Teknologi

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Persyaratan

- Node.js
- npm

## Menjalankan aplikasi

Pasang dependency:

```bash
npm install
```

Jalankan server development:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Environment

Saat ini aplikasi belum membutuhkan variabel environment. Jika konfigurasi diperlukan nanti, simpan nilainya di file `.env.local` (file environment lokal diabaikan oleh Git). Jangan commit kredensial atau rahasia. File `.env.example` boleh digunakan untuk mendokumentasikan nama variabel tanpa nilai rahasia.

## Perintah yang tersedia

```bash
npm run dev    # Menjalankan server development
npm run lint   # Menjalankan ESLint
npm run build  # Membuat build production
npm run start  # Menjalankan build production
```

## Struktur utama

```text
src/
└── app/
    ├── layout.tsx  # Root layout dan metadata
    ├── page.tsx    # Dashboard dan navigasi sidebar
    └── globals.css # Style global
```

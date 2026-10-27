# TaskFlow

TaskFlow adalah aplikasi untuk mengelola pekerjaan dengan autentikasi Supabase. Dashboard menyediakan menu **Dashboard**, **My Task**, dan **Settings**. Pengguna dapat membuat, melihat, mengubah status, mengedit, dan menghapus tugas miliknya.

## Teknologi

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth dan PostgreSQL Row Level Security (RLS)

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

Salin `.env.example` ke `.env.local`, lalu isi URL proyek dan publishable key Supabase. Jangan commit nilai rahasia.

## Database Supabase

Tabel `public.tasks` menggunakan kolom `id`, `user_id`, `title`, `description`, `status`, `priority`, `due_date`, dan `created_at`. Nilai status yang diizinkan adalah `todo`, `in_progress`, dan `done`; prioritas `low`, `medium`, dan `high`.

Jalankan SQL di [`supabase/migrations/20261027000000_create_tasks.sql`](./supabase/migrations/20261027000000_create_tasks.sql) melalui Supabase CLI atau SQL Editor. Migrasi ini membuat tabel jika belum ada, mengaktifkan RLS, dan membatasi operasi baca/tulis/hapus ke pemilik tugas (`auth.uid() = user_id`). Jika tabel dan kebijakan yang sama sudah dibuat manual, kebijakan akan dibuat ulang dengan aman. Server Action juga memverifikasi sesi dan mengisi `user_id` dari pengguna terautentikasi.

Untuk konfirmasi email, tambahkan URL `/auth/callback` aplikasi ke daftar **Redirect URLs** di pengaturan Supabase Auth.

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

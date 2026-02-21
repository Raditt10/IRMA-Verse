# Irma Verse

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

**Irma Verse** adalah platform web komprehensif yang dirancang untuk kebutuhan edukasi dan komunitas. Aplikasi ini mengintegrasikan *Learning Management System* (LMS) dengan fitur sosial interaktif, memungkinkan pengguna untuk belajar, berkompetisi, dan berinteraksi secara *real-time*.

## 📌 Deskripsi Project
Sistem ini dibangun untuk memfasilitasi interaksi antara instruktur dan siswa/member melalui berbagai fitur unggulan:
* **Akademi Digital:** Manajemen materi pembelajaran, jadwal kelas, dan presensi otomatis.
* **Kompetisi:** Platform untuk mengadakan dan mengelola lomba atau event.
* **Interaksi Real-time:** Ruang obrolan (Chat Rooms) dan diskusi langsung antara instruktur dan member.
* **Informasi Terpusat:** Portal berita dan pengumuman kegiatan.

## 🛠️ Tech Stack
Project ini menggunakan teknologi modern *full-stack* berbasis TypeScript:

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS & Shadcn UI
* **Database:** MySQL
* **ORM:** Prisma
* **Authentication:** NextAuth.js (Auth.js)
* **Real-time Engine:** Socket.io (Custom Server)
* **Package Manager:** PNPM

## 🚀 Fitur Utama

### 🎓 Academy & Learning
* **Manajemen Materi:** Instruktur dapat mengunggah dan menyusun materi pelajaran.
* **Jadwal & Presensi:** Kalender kegiatan dan sistem absensi digital.
* **Quiz & Penilaian:** (Opsional/Planned) Fitur evaluasi pembelajaran.

### 🏆 Kompetisi & Event
* **Listing Kompetisi:** Daftar lomba yang tersedia beserta detail pendaftarannya.
* **Leaderboard:** Papan peringkat untuk memacu semangat kompetisi member.

### 💬 Sosial & Komunikasi
* **Real-time Chat:** Fitur kirim pesan instan antar pengguna atau dalam grup.
* **Pengumuman (News):** Portal berita terbaru seputar komunitas.
* **Profil Pengguna:** Kustomisasi profil, avatar, dan status kehadiran (*online/offline*).

### 🛡️ Admin & Instruktur
* **Dashboard Statistik:** Ringkasan data pengguna, materi, dan aktivitas.
* **Manajemen User:** Kontrol penuh atas data member dan hak akses.

## 📁 Struktur Folder
Gambaran struktur direktori utama project (Next.js App Router):

```text
irma-verse/
├── app/                   # Halaman dan API Routes (Next.js App Router)
│   ├── academy/           # Halaman modul akademi
│   ├── admin/             # Dashboard khusus admin
│   ├── api/               # Backend API endpoints
│   ├── auth/              # Halaman login/register
│   ├── chat-rooms/        # Interface chat
│   ├── competitions/      # Halaman kompetisi
│   └── materials/         # Halaman materi pelajaran
├── components/            # Komponen UI Reusable (Buttons, Cards, Modals)
│   ├── ui/                # Komponen dasar (Shadcn/Custom)
├── lib/                   # Utilitas, konfigurasi Prisma, Auth, & Socket
├── prisma/                # Skema database & file migrasi
├── public/                # Aset statis (Gambar, Suara notifikasi)
├── server.ts              # Konfigurasi custom server (untuk Socket.io)
└── package.json           # Dependensi project

```

## ⚙️ Instalasi & Setup

Pastikan Anda sudah menginstal **Node.js** dan **PNPM**.

1. **Clone Repository**
```bash
git clone [https://github.com/raditt10/irma-verse.git](https://github.com/raditt10/irma-verse.git)
cd irma-verse

```


2. **Instal Dependensi**
```bash
pnpm install

```


3. **Konfigurasi Environment**
Buat file `.env` di root folder dan sesuaikan variabel berikut:
```env
DATABASE_URL="mysql://user:password@localhost:3306/db_irmaverse"
NEXTAUTH_SECRET="rahasia_anda_disini"
NEXTAUTH_URL="http://localhost:3000"
# Tambahkan variabel lain jika diperlukan (misal: Cloudinary/Uploadthing)

```


4. **Setup Database (Prisma)**
Jalankan migrasi untuk membuat tabel di database MySQL Anda:
```bash
npx prisma generate
npx prisma migrate dev --name init

```


*(Opsional)* Jalankan seeder untuk data awal:
```bash
npx prisma db seed

```


5. **Jalankan Project**
Karena menggunakan custom server untuk Socket.io, gunakan perintah:
```bash
pnpm dev

```


Akses aplikasi di `http://localhost:3000`.

## 🤝 Kontribusi

Ingin berkontribusi? Silakan ikuti langkah standar GitHub Flow:

1. Fork repository.
2. Buat branch fitur (`git checkout -b fitur-baru`).
3. Commit perubahan (`git commit -m 'Menambah fitur X'`).
4. Push ke branch (`git push origin fitur-baru`).
5. Buat Pull Request.

## 📄 Lisensi

_© 2026 IRMAVerse - Hak cipta milik pengembang [Raditt10](https://github.com/Raditt10) dan [Fauzaroo01](https://github.com/Fauzaroo01)

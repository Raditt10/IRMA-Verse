import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding data...');

  // Clear existing data
  await prisma.schedule.deleteMany();
  await prisma.news.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'ustadz.ahmad@irma.com',
      name: 'Ustadz Ahmad Zaki',
      password: hashedPassword,
      role: 'instruktur',
      notelp: '081234567890',
      address: 'Jakarta, Indonesia',
      bio: 'Pengajar bijak dengan 15 tahun pengalaman',
      bidangKeahlian: 'Akidah dan Aqidah',
      pengalaman: 'Mengajar sejak tahun 2010 di berbagai pesantren dan institusi pendidikan',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'ustadzah.fatimah@irma.com',
      name: 'Ustadzah Fatimah',
      password: hashedPassword,
      role: 'instruktur',
      notelp: '082345678901',
      address: 'Bandung, Indonesia',
      bio: 'Spesialis dalam mengajar Al-Quran dan Tafsir',
      bidangKeahlian: 'Al-Quran dan Tafsir',
      pengalaman: 'Pengalaman 10 tahun mengajar dan membimbing santri',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'rafa@irma.com',
      name: 'Rafa Ardanza',
      password: hashedPassword,
      role: 'user',
      notelp: '083456789012',
      address: 'Surabaya, Indonesia',
      bio: 'Santri yang antusias belajar',
    },
  });

  // Create news articles
  const news1 = await prisma.news.create({
    data: {
      title: 'Kedudukan Akal dan Wahyu',
      slug: 'kedudukan-akal-dan-wahyu',
      category: 'Kajian',
      deskripsi: 'Memahami hubungan dan kedudukan akal dalam konteks wahyu ilahi',
      content: `# Kedudukan Akal dan Wahyu

Dalam khazanah pemikiran Islam, relasi antara akal dan wahyu telah menjadi topik diskusi yang mendalam dan berkelanjutan.

## Pengertian Akal dalam Islam

Akal merupakan nikmat yang diberikan Allah kepada manusia...

## Kedudukan Wahyu

Wahyu adalah petunjuk langsung dari Allah kepada hamba-Nya...

## Hubungan Akal dan Wahyu

Akal dan wahyu bukan dua hal yang saling bertentangan...`,
      image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500',
      authorId: user1.id,
    },
  });

  const news2 = await prisma.news.create({
    data: {
      title: 'Fiqih Ibadah Sehari-hari',
      slug: 'fiqih-ibadah-sehari-hari',
      category: 'Pembelajaran',
      deskripsi: 'Panduan praktis menjalankan ibadah dalam kehidupan sehari-hari',
      content: `# Fiqih Ibadah Sehari-hari

Ibadah bukan hanya dilakukan di masjid, tetapi adalah bagian dari kehidupan sehari-hari seorang Muslim.

## Wudhu yang Sempurna

Wudhu adalah niat untuk membersihkan diri...

## Shalat Dengan Khusyu'

Khusyu' adalah hadirnya hati dalam shalat...`,
      image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500',
      authorId: user2.id,
    },
  });

  const news3 = await prisma.news.create({
    data: {
      title: 'Tafsir Al-Quran Surat Al-Fatihah',
      slug: 'tafsir-al-quran-surat-al-fatihah',
      category: 'Tafsir',
      deskripsi: 'Penjelasan mendalam tentang surat pertama dalam Al-Quran',
      content: `# Tafsir Al-Quran Surat Al-Fatihah

Surat Al-Fatihah adalah surat pembuka Al-Quran yang penuh dengan makna dan hikmah.

## Bismillah

Membaca dengan nama Allah adalah cara memulai segala aktivitas...

## Alhamdulillah

Segala puji bagi Allah, Tuhan sekalian alam...`,
      image: 'https://images.unsplash.com/photo-1488173174519-e21cc028cb29?w=500',
      authorId: user2.id,
    },
  });

  const news4 = await prisma.news.create({
    data: {
      title: 'Akhlak Mulia dalam Berinteraksi',
      slug: 'akhlak-mulia-dalam-berinteraksi',
      category: 'Akhlak',
      deskripsi: 'Mempelajari etika Islam dalam menjalin hubungan dengan sesama',
      content: `# Akhlak Mulia dalam Berinteraksi

Islam mengajarkan akhlak yang luhur dalam setiap aspek interaksi sosial.

## Salam dan Sapa

Memberikan salam adalah bentuk kasih sayang...

## Silaturahmi

Menjaga hubungan baik dengan keluarga dan teman...`,
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500',
      authorId: user1.id,
    },
  });

  const news5 = await prisma.news.create({
    data: {
      title: 'Memahami Hadis Nabawi',
      slug: 'memahami-hadis-nabawi',
      category: 'Pembelajaran',
      deskripsi: 'Pengenalan tentang hadis dan cara memahami petunjuk Rasulullah',
      content: `# Memahami Hadis Nabawi

Hadis adalah warisan berharga dari Rasulullah Muhammad SAW...

## Definisi Hadis

Hadis adalah segala ucapan, perbuatan, dan taqrir (persetujuan) Rasulullah...

## Tingkatan Hadis

Hadis dibagi menjadi beberapa tingkatan berdasarkan kualitasnya...`,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
      authorId: user1.id,
    },
  });

  // Create schedules
  const schedule1 = await prisma.schedule.create({
    data: {
      title: 'Seminar Akhlak Pemuda',
      description: 'Membangun karakter islami generasi muda',
      fullDescription: 'Generasi muda adalah pilar masa depan umat Islam. Seminar ini menghadirkan diskusi mendalam tentang pembangunan karakter Islami yang kuat di tengah tantangan zaman modern.',
      date: new Date('2026-02-15T09:00:00'),
      time: '09:00 WIB',
      location: 'Aula Utama',
      pemateri: 'Ustadz Ahmad Zaki',
      status: 'segera_hadir',
      instructorId: user1.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500',
    },
  });

  const schedule2 = await prisma.schedule.create({
    data: {
      title: 'Workshop Tahfidz Al-Quran',
      description: 'Meningkatkan kemampuan menghafal Al-Quran',
      fullDescription: 'Tahfidz Al-Quran adalah pencapaian spiritual tertinggi yang dapat diraih seorang Muslim. Program intensif ini dirancang untuk membantu peserta mengembangkan kemampuan menghafal Al-Quran dengan metode yang telah terbukti efektif.',
      date: new Date('2026-02-20T14:00:00'),
      time: '14:00 WIB',
      location: 'Ruang Tahfidz',
      pemateri: 'Ustadzah Fatimah',
      status: 'segera_hadir',
      instructorId: user2.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=500',
    },
  });

  const schedule3 = await prisma.schedule.create({
    data: {
      title: 'Kajian Tafsir Surat Al-Baqarah',
      description: 'Memahami makna mendalam surat Al-Baqarah',
      fullDescription: 'Surat Al-Baqarah adalah surat terpanjang dalam Al-Quran yang penuh dengan hikmah dan petunjuk. Kajian ini akan membahas ayat demi ayat dengan pendekatan komprehensif.',
      date: new Date('2026-03-01T16:00:00'),
      time: '16:00 WIB',
      location: 'Musholla Al-Ikhlas',
      pemateri: 'Ustadzah Fatimah',
      status: 'segera_hadir',
      instructorId: user2.id,
    },
  });

  console.log('✅ Data seeding completed!');
  console.log('📊 Summary:');
  console.log(`   - Users: 3`);
  console.log(`   - News: 5`);
  console.log(`   - Schedules: 3`);
  console.log(`   - Instructors: 2`);
  console.log('\n💡 Test the search with these keywords:');
  console.log('   - "kedudukan" (untuk mencari berita tentang akal dan wahyu)');
  console.log('   - "ahmad" (untuk mencari instruktur)');
  console.log('   - "tafsir" (untuk mencari artikel tafsir)');
  console.log('   - "rafa" (untuk mencari pengguna)');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

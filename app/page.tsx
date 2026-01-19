"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import heroImage from "@/public/hero-image.jpg";
import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";
import SearchBar from "@/components/ui/SearchBar";
import {
  ArrowRight,
  Award,
  BarChart,
  Bell,
  BookOpen,
  Calendar,
  CalendarDays,
  Clock,
  Facebook,
  Heart,
  Instagram,
  MapPin,
  Quote,
  Search,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Youtube,
  Zap,
} from "lucide-react";

export default function Home() {
  const [latestNews, setLatestNews] = useState<Array<{ id: string; title: string; category: string | null; deskripsi?: string; slug: string; image?: string | null }>>([]);
  const [newsLoading, setNewsLoading] = useState(false);

  const features = [
    {
      icon: Bell,
      title: "Pengumuman",
      description: "Dapatkan informasi terbaru tentang kegiatan IRMA",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Calendar,
      title: "Jadwal Kajian",
      description: "Lihat jadwal kajian per kelas dan materi",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: BookOpen,
      title: "Kajian Mingguan",
      description: "Akses materi kajian yang telah dirangkum",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      title: "Anggota & Pengurus",
      description: "Kenali pengurus IRMA SMK Negeri 13 Bandung",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Award,
      title: "Prestasi",
      description: "Catat dan lihat prestasi anggota IRMA",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: BarChart,
      title: "Rating Pemateri",
      description: "Berikan feedback untuk pemateri kajian",
      color: "from-indigo-500 to-blue-500",
    },
  ];

  const stats = [
    { icon: Users, label: "Member Aktif", value: "150+" },
    { icon: BookOpen, label: "Materi Kajian", value: "50+" },
    { icon: Award, label: "Badge Tersedia", value: "30+" },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Terorganisir dengan Baik",
      description:
        "Sistem yang terstruktur untuk mengelola seluruh kegiatan IRMA dengan efisien",
    },
    {
      icon: Clock,
      title: "Hemat Waktu",
      description:
        "Akses informasi kapan saja, di mana saja tanpa perlu hadir secara fisik",
    },
    {
      icon: TrendingUp,
      title: "Tracking Progress",
      description:
        "Pantau perkembangan pembelajaran dan pencapaian pribadi secara real-time",
    },
    {
      icon: Heart,
      title: "Komunitas Solid",
      description: "Membangun ikatan yang kuat dengan sesama anggota IRMA",
    },
  ];

  const testimonials = [
    {
      name: "Ahmad Fauzi",
      role: "Anggota IRMA",
      content:
        "IRMAVerse memudahkan saya mengakses materi kajian dan mengikuti kegiatan IRMA. Platform yang sangat membantu!",
      rating: 5,
    },
    {
      name: "Siti Aisyah",
      role: "Pengurus IRMA",
      content:
        "Dengan IRMAVerse, koordinasi kegiatan jadi lebih mudah. Fitur-fiturnya lengkap dan mudah digunakan.",
      rating: 5,
    },
    {
      name: "Muhammad Rizki",
      role: "Pemateri",
      content:
        "Sistem rating dan feedback membantu saya meningkatkan kualitas materi kajian yang saya sampaikan.",
      rating: 5,
    },
  ];

  const today = new Date();
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const tanggalStr = `${hari[today.getDay()]}, ${today.getDate()} ${
    bulan[today.getMonth()]
  } ${today.getFullYear()}`;

  const [userLocation, setUserLocation] = useState<string>(
    "Lokasi tidak diketahui"
  );
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            setUserLocation(
              data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.state ||
                data.display_name ||
                "Lokasi ditemukan"
            );
          } catch {
            setUserLocation("Lokasi ditemukan");
          }
        },
        () => setUserLocation("Lokasi tidak diketahui")
      );
    }
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      setNewsLoading(true);
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (Array.isArray(data)) {
          setLatestNews(data.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to load news", error);
      } finally {
        setNewsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-500 text-white relative overflow-hidden" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22), transparent 38%), radial-gradient(circle at 78% 12%, rgba(59,130,246,0.28), transparent 32%), radial-gradient(circle at 68% 72%, rgba(16,185,129,0.42), transparent 32%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative w-full">
        <div className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8 text-sm text-white/80 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className="text-xs sm:text-sm">{tanggalStr}</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-white/70">
            <MapPin className="h-4 w-4" />
            <span>{userLocation}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="IRMA Verse"
                  className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/70">
                  Platform Rohis Digital
                </p>
                <h1 className="text-lg sm:text-2xl font-bold leading-tight">
                  IRMA Verse
                </h1>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-white/80">
              <Link href="/" className="hover:text-white transition-colors">
                Beranda
              </Link>
              <Link
                href="/profile"
                className="hover:text-white transition-colors"
              >
                Profil
              </Link>
              <Link
                href="/announcements"
                className="hover:text-white transition-colors"
              >
                Informasi
              </Link>
              <Link
                href="/gallery"
                className="hover:text-white transition-colors"
              >
                Galeri
              </Link>
              <Link href="/faq" className="hover:text-white transition-colors">
                FAQ
              </Link>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                Kontak
              </Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 text-white/70">
                <Instagram className="h-5 w-5" />
                <Youtube className="h-5 w-5" />
                <Facebook className="h-5 w-5" />
              </div>
              <Link href="/auth">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white text-emerald-900 hover:bg-white/90 px-4 sm:px-6 py-2 sm:py-3 text-sm font-semibold shadow-lg"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end pt-4 pb-2 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs sm:text-sm font-semibold shadow-lg">
                Official Website{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-white to-cyan-200 bg-clip-text text-transparent">
                  IRMA13
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm sm:text-base md:text-lg text-white/80 font-medium">
                  ROHIS DIGITAL SEKOLAH
                </p>
                <div className="text-left">
                  <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-none tracking-tight drop-shadow-xl align-top">
                    IRMA{" "}
                    <span className="bg-gradient-to-r from-emerald-300 via-white to-cyan-200 bg-clip-text text-transparent align-top">
                      VERSE
                    </span>
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed">
                Platform digital yang menghubungkan seluruh anggota IRMA dengan
                sistem terorganisir, modern, dan efisien untuk pembelajaran
                Islami yang lebih baik.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-inner w-full">
                <SearchBar />
              </div>


              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="bg-white/90 rounded-xl sm:rounded-2xl shadow-lg border-0 flex flex-col items-center justify-center py-6 sm:py-8 px-4 sm:px-6 min-h-[200px] sm:min-h-[260px]">
                  <div className="flex flex-col items-center w-full">
                    <div className="flex items-center justify-center mb-3 sm:mb-4">
                      <div className="rounded-lg sm:rounded-xl bg-white shadow p-1.5 sm:p-2 border border-gray-200">
                        <img
                          src="/logo13.png"
                          alt="SMKN 13 Bandung"
                          className="h-10 sm:h-14 w-auto object-contain"
                        />
                      </div>
                    </div>
                    <div className="text-center w-full">
                      <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider sm:tracking-widest text-gray-500 mb-1">
                        Platform Ekskul IRMA
                      </div>
                      <div className="text-base sm:text-lg font-bold text-gray-700 mb-1">
                        SMKN 13 Bandung
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="hidden sm:block relative -mr-0 lg:-mr-6 -mb-4 self-end overflow-hidden">
              <div className="absolute -inset-6 bg-gradient-to-br from-white/25 via-emerald-200/25 to-cyan-200/25 blur-3xl" />
              <div className="relative h-[350px] sm:h-[450px] md:h-[600px] lg:h-[700px] w-full flex items-end justify-center lg:justify-end">
                <img
                  src="/model.png"
                  alt="Role model IRMA"
                  className="h-full w-auto object-cover object-bottom drop-shadow-[0_25px_80px_rgba(0,0,0,0.45)] block"
                  style={{ display: "block" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Icons Section */}
      <section className="py-20 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent mb-2 sm:mb-4">Fitur Tersedia</h2>
            <p className="text-lg text-slate-600">Berbagai fitur yang memudahkan aktivitas IRMA Anda</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 group cursor-pointer"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                  <feature.icon className="h-7 w-7 sm:h-9 sm:w-9 text-slate-800 group-hover:text-slate-900 transition-colors duration-300" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-gray-800 text-center leading-tight">
                  {feature.title}
                </p>
              </div>
            ))}

            {/* Additional Menu Items */}
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                <Zap className="h-9 w-9 text-slate-800 group-hover:text-slate-900 transition-colors duration-300" />
              </div>
              <p className="text-sm font-semibold text-gray-800 text-center leading-tight">
                Event Terbaru
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 group cursor-pointer">
             <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                <Target className="h-9 w-9 text-slate-800 group-hover:text-slate-900 transition-colors duration-300" />
              </div>
              <p className="text-sm font-semibold text-gray-800 text-center leading-tight">
                Program Kurikulum
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                <CalendarDays className="h-9 w-9 text-slate-800 group-hover:text-slate-900 transition-colors duration-300" />
              </div>
              <p className="text-sm font-semibold text-gray-800 text-center leading-tight">
                Absensi Kajian
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 group cursor-pointer">
             <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                <Heart className="h-9 w-9 text-slate-800 group-hover:text-slate-900 transition-colors duration-300" />
              </div>
              <p className="text-sm font-semibold text-gray-800 text-center leading-tight">
                Fitur Keren Lainnya
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-white/10 border border-white/20 rounded-full backdrop-blur-md shadow-lg">
              <Target className="h-4 w-4 text-emerald-300 animate-pulse" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Keunggulan</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Mengapa Memilih <span className="bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent">IRMAVerse?</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Rasakan pengalaman berbeda dalam mengelola kegiatan organisasi Islami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border-2 border-white/10 hover:border-emerald-400/50 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-cyan-500/0 group-hover:from-emerald-500/10 group-hover:to-cyan-500/10 rounded-3xl transition-all duration-500" />

                <div className="relative">
                  <div className="inline-flex p-4 rounded-2xl bg-white/10 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <benefit.icon className="h-8 w-8 text-emerald-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-200 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-white/10 border border-white/20 rounded-full backdrop-blur-md shadow-lg">
              <Star className="h-4 w-4 text-emerald-300 animate-pulse" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Testimoni</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Apa Kata <span className="bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent">Mereka?</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Dengarkan pengalaman anggota IRMA yang telah menggunakan IRMAVerse
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border-2 border-white/10 hover:border-emerald-400/50 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-cyan-500/0 group-hover:from-emerald-500/10 group-hover:to-cyan-500/10 rounded-3xl transition-all duration-500" />

                <div className="relative">
                  <Quote className="h-10 w-10 text-white/20 mb-4" />

                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-white/90 leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-sm text-white/60">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/40 via-teal-600/40 to-cyan-600/40" />

        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 bg-white/10 border border-white/20 rounded-full backdrop-blur-md shadow-lg">
            <Target className="h-4 w-4 text-white animate-pulse" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">Bergabung Sekarang</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-8 leading-tight">
            Siap Memulai Perjalanan
            <br />
            <span className="relative inline-block mt-2">
              <span className="relative">Pembelajaran Islami?</span>
              <div className="absolute bottom-0 left-0 w-full h-2 bg-white/20 rounded-full" />
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Daftar sekarang dan dapatkan akses ke semua fitur untuk pengalaman yang lebih terorganisir, modern, dan menyenangkan
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link href="/auth" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-7 text-base sm:text-lg group shadow-2xl transition-all duration-300 hover:scale-105 sm:hover:scale-110 font-bold bg-white/95 text-emerald-900 hover:bg-white rounded-lg flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Daftar Sekarang - Gratis!</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-white/70">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">100% Aman</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">150+ Anggota Aktif</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-white/70" />
              <span className="text-sm font-medium">Rating 5.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black/20 backdrop-blur-sm border-t-2 border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <img
                    src="/logo.png"
                    alt="IRMA"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <div className="font-bold text-lg sm:text-xl bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                    IRMAVerse
                  </div>
                  <div className="text-xs text-white/60 font-medium">
                    Platform Digital IRMA
                  </div>
                </div>
              </div>
              <p className="text-white/70 leading-relaxed text-sm">
                Menghubungkan anggota IRMA dengan teknologi modern untuk
                pengalaman pembelajaran Islami yang lebih baik
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/auth"
                    className="text-white/70 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    Login / Register
                  </Link>
                </li>
                <li>
                  <Link
                    href="/structure"
                    className="text-white/70 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    Struktur Organisasi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/schedule"
                    className="text-white/70 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    Jadwal Kajian
                  </Link>
                </li>
                <li>
                  <Link
                    href="/announcements"
                    className="text-white/70 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    Pengumuman
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="text-white/70 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    Galeri
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-white/70 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Contact Us</h3>
              <p className="text-sm text-white/70 mb-2">
                Jl. SMK Negeri 13 Bandung, Kota Bandung, Jawa Barat
              </p>
              <p className="text-sm text-white/70 mb-2">
                Email: 1CtJ3@example.com
              </p>
              <p className="text-sm text-white/70">
                Telepon: 0812-3456-7890
              </p>
            </div>
          </div>
          <p className="text-center text-white/60 text-sm">
            &copy; {new Date().getFullYear()} IRMAVerse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

